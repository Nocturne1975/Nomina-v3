import type { Request, Response } from "express";
import { z } from "zod";
import OpenAI from "openai";
import prisma from "../../utils/prisma";
import {
  countQuerySchema,
  optionalIdQuerySchema,
  optionalStringQuerySchema,
  normalizeGenreValues,
} from "../../services/generation/generationHelpers";

// ── Client OpenAI ─────────────────────────────────────────────────────────────

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY manquante : configurez la variable d'environnement OPENAI_API_KEY.");
  }
  return new OpenAI({ apiKey });
}

function getModel(): string {
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}

// ── Contexte tiré de la base ──────────────────────────────────────────────────

async function buildContext(options: { cultureId?: number; categorieId?: number }) {
  const [culture, categorie, sampleTitres] = await Promise.all([
    options.cultureId
      ? prisma.culture.findUnique({ where: { id: options.cultureId }, select: { name: true, description: true } })
      : null,
    options.categorieId
      ? prisma.categorie.findUnique({ where: { id: options.categorieId }, select: { name: true } })
      : null,
    prisma.titre.findMany({
      where: {
        ...(options.cultureId ? { cultureId: options.cultureId } : {}),
        ...(options.categorieId ? { categorieId: options.categorieId } : {}),
      },
      select: { valeur: true, type: true },
      take: 10,
    }),
  ]);

  return {
    culture: culture?.name ?? null,
    cultureDesc: culture?.description ?? null,
    categorie: categorie?.name ?? null,
    existingTitres: sampleTitres.map((t: { valeur: string; type: string | null }) =>
      `${t.valeur}${t.type ? ` (${t.type})` : ""}`
    ),
  };
}

// ── Prompts ───────────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `Tu es un générateur de titres fictifs (nobiliaires, professionnels, religieux, militaires, etc.) pour jeux de rôle, romans et univers fictifs.
Tu génères du contenu en français.
Tu dois TOUJOURS répondre avec du JSON valide et rien d'autre (pas de texte avant ou après, pas de bloc markdown).
Respecte strictement la structure demandée.`;
}

function buildUserPrompt(
  count: number,
  keywords: string | undefined,
  genre: string | undefined,
  context: Awaited<ReturnType<typeof buildContext>>
): string {
  const genreValues = genre ? normalizeGenreValues(genre) : [];
  const contextLines: string[] = [];
  if (context.culture) contextLines.push(`Culture : ${context.culture}${context.cultureDesc ? ` — ${context.cultureDesc}` : ""}`);
  if (context.categorie) contextLines.push(`Catégorie : ${context.categorie}`);
  if (genreValues.length > 0) contextLines.push(`Genre : ${genreValues[0]}`);
  if (keywords) contextLines.push(`Mots-clés / thème demandé : ${keywords}`);

  const inspirationBlock = context.existingTitres.length > 0
    ? `\nTitres déjà existants dans cet univers (inspire-toi du style, ne les recopie pas) :\n${context.existingTitres.map((t: string) => `  - ${t}`).join("\n")}\n`
    : "";

  const keywordsInstruction = keywords
    ? `\nIMPORTANT — instruction sur les mots-clés "${keywords}" :
TOUS les ${count} titres générés doivent être des variations ou déclinaisons directement liées à "${keywords}" — pas des titres vaguement liés au thème général. Si le mot-clé est un métier ou un rôle précis (ex: "pompier"), génère des variantes de grade ou de spécialisation de ce même rôle (ex: pompier volontaire, capitaine des pompiers, chef de caserne).\n`
    : "";

  return `Génère ${count} titres fictifs (nobiliaires, professionnels, militaires, religieux, ou autres selon le contexte).

${contextLines.length > 0 ? `Contexte :\n${contextLines.map(l => `  - ${l}`).join("\n")}\n` : ""}${inspirationBlock}${keywordsInstruction}
Retourne UNIQUEMENT un objet JSON avec cette structure exacte :
{
  "items": [
    {
      "valeur": "Capitaine des pompiers",
      "type": "Titres réels — Sécurité"
    }
  ]
}

Règles importantes :
- Exactement ${count} titres dans le tableau items.
- Chaque titre doit être DISTINCT des autres.
- "type" doit suivre le format "Thème — Section" si pertinent (ex: "Titres réels — Administration", "Médiéval — Noblesse").
- Ne retourne AUCUN texte en dehors du JSON.`;
}

// ── Controller ────────────────────────────────────────────────────────────────

export const generateTitres = async (req: Request, res: Response) => {
  const parsed = z
    .object({
      count: countQuerySchema,
      cultureId: optionalIdQuerySchema,
      categorieId: optionalIdQuerySchema,
      genre: optionalStringQuerySchema,
      seed: optionalStringQuerySchema,
      keywords: optionalStringQuerySchema,
    })
    .safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: "Paramètres invalides", issues: parsed.error.issues });
  }

  const { count, cultureId, categorieId, genre, seed, keywords } = parsed.data;
  const effectiveSeed = seed ?? `titres-${Date.now()}`;

  try {
    const client = getClient();
    const model = getModel();
    const context = await buildContext({ cultureId, categorieId });

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.85,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(Math.min(count, 30), keywords, genre, context) },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let rawParsed: Record<string, unknown>;
    try {
      rawParsed = JSON.parse(raw);
    } catch {
      throw new Error("Réponse OpenAI invalide : JSON non parsable.");
    }

    const rawItems = Array.isArray(rawParsed.items) ? rawParsed.items : [];
    const items = rawItems.map((it: Record<string, unknown>) => ({
      valeur: String(it.valeur ?? "Titre inconnu"),
      type: it.type ? String(it.type) : null,
      genre: genre ?? null,
      cultureId: cultureId ?? null,
      categorieId: categorieId ?? null,
    }));

    return res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { cultureId: cultureId ?? null, categorieId: categorieId ?? null, genre: genre ?? null, keywords: keywords ?? null },
      items,
      warning: items.length === 0 ? "Aucun titre généré." : undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("OPENAI_API_KEY")) {
      return res.status(503).json({ error: message });
    }

    const statusCode = (err as { status?: number })?.status ?? 500;
    if (statusCode === 429) {
      return res.status(429).json({ error: "Quota OpenAI dépassé. Réessayez plus tard." });
    }

    return res.status(500).json({ error: `Erreur OpenAI: ${message}` });
  }
};