import type { Request, Response } from "express";
import { z } from "zod";
import OpenAI from "openai";
import prisma from "../../utils/prisma";
import {
  countQuerySchema,
  optionalIdQuerySchema,
  optionalStringQuerySchema,
  normalizeAppliesToValues,
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

async function buildContext(options: { cultureId?: number; categorieId?: number; universId?: number }) {
  const [culture, categorie, univers, sampleFragments] = await Promise.all([
    options.cultureId
      ? prisma.culture.findUnique({ where: { id: options.cultureId }, select: { name: true, description: true } })
      : null,
    options.categorieId
      ? prisma.categorie.findUnique({ where: { id: options.categorieId }, select: { name: true } })
      : null,
    options.universId
      ? prisma.universThematique.findUnique({ where: { id: options.universId }, select: { name: true } })
      : null,
    prisma.fragmentsHistoire.findMany({
      where: {
        ...(options.cultureId ? { OR: [{ cultureId: options.cultureId }, { cultureId: null }] } : {}),
      },
      select: { texte: true },
      take: 8,
    }),
  ]);

  return {
    culture: culture?.name ?? null,
    cultureDesc: culture?.description ?? null,
    categorie: categorie?.name ?? null,
    univers: univers?.name ?? null,
    existingFragments: sampleFragments.map((f: { texte: string }) => f.texte),
  };
}

// ── Prompts ───────────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `Tu es un générateur de fragments d'histoire (accroches narratives courtes) pour jeux de rôle, romans et jeux vidéo.
Tu génères du contenu en français.
Tu dois TOUJOURS répondre avec du JSON valide et rien d'autre (pas de texte avant ou après, pas de bloc markdown).
Respecte strictement la structure demandée. Chaque fragment doit être unique, évocateur et donner envie d'en savoir plus.`;
}

function buildUserPrompt(
  count: number,
  keywords: string | undefined,
  appliesTo: string | undefined,
  genre: string | undefined,
  context: Awaited<ReturnType<typeof buildContext>>
): string {
  const genreValues = genre ? normalizeGenreValues(genre) : [];
  const contextLines: string[] = [];
  if (context.univers) contextLines.push(`Univers thématique : ${context.univers}`);
  if (context.culture) contextLines.push(`Culture : ${context.culture}${context.cultureDesc ? ` — ${context.cultureDesc}` : ""}`);
  if (context.categorie) contextLines.push(`Catégorie : ${context.categorie}`);
  if (appliesTo) contextLines.push(`S'applique à : ${appliesTo}`);
  if (genreValues.length > 0) contextLines.push(`Genre : ${genreValues[0]}`);
  if (keywords) contextLines.push(`Mots-clés / thème demandé : ${keywords}`);

  const inspirationBlock = context.existingFragments.length > 0
    ? `\nFragments déjà existants dans cet univers (inspire-toi du ton, ne les recopie pas) :\n${context.existingFragments.map((t: string) => `  - ${t}`).join("\n")}\n`
    : "";

  const keywordsInstruction = keywords
    ? `\nIMPORTANT — instruction sur les mots-clés "${keywords}" :
Si ces mots-clés désignent un sujet, un personnage ou un objet précis, TOUS les ${count} fragments générés doivent explorer des variations ou des angles différents autour de ce même sujet précis — pas des fragments vaguement liés ou qui se contentent de le mentionner en passant.
Si les mots-clés décrivent plutôt un thème ou une ambiance générale, génère des fragments variés inspirés de ce thème.\n`
    : "";

  return `Génère ${count} fragments d'histoire (accroches narratives courtes, 1-2 phrases chacune).

${contextLines.length > 0 ? `Contexte :\n${contextLines.map(l => `  - ${l}`).join("\n")}\n` : ""}${inspirationBlock}${keywordsInstruction}
Retourne UNIQUEMENT un objet JSON avec cette structure exacte :
{
  "items": [
    {
      "texte": "On raconte que les pierres de la citadelle chuchotent le nom des traîtres au crépuscule.",
      "appliesTo": "npc"
    }
  ]
}

Règles importantes :
- Exactement ${count} fragments dans le tableau items.
- Chaque fragment doit être DISTINCT des autres en ton et en contenu.
- Chaque fragment doit être court (1-2 phrases), évocateur et donner une accroche narrative.
- "appliesTo" doit être l'une de ces valeurs : "npc", "lieu", "objet", "intrigue", "univers".
- Ne retourne AUCUN texte en dehors du JSON.`;
}

// ── Controller ────────────────────────────────────────────────────────────────

export const generateFragmentsHistoire = async (req: Request, res: Response) => {
  const parsed = z
    .object({
      count: countQuerySchema,
      universId: optionalIdQuerySchema,
      cultureId: optionalIdQuerySchema,
      categorieId: optionalIdQuerySchema,
      genre: optionalStringQuerySchema,
      appliesTo: optionalStringQuerySchema,
      seed: optionalStringQuerySchema,
      keywords: optionalStringQuerySchema,
    })
    .safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: "Paramètres invalides", issues: parsed.error.issues });
  }

  const { count, universId, cultureId, categorieId, genre, appliesTo, seed, keywords } = parsed.data;
  const effectiveSeed = seed ?? `fragments-${Date.now()}`;
  const appliesToValues = normalizeAppliesToValues(appliesTo);

  try {
    const client = getClient();
    const model = getModel();
    const context = await buildContext({ cultureId, categorieId, universId });

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(Math.min(count, 30), keywords, appliesTo, genre, context) },
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
      texte: String(it.texte ?? ""),
      appliesTo: it.appliesTo ? String(it.appliesTo) : (appliesToValues?.[0] ?? null),
      genre: genre ?? null,
      cultureId: cultureId ?? null,
      categorieId: categorieId ?? null,
    }));

    return res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: {
        universId: universId ?? null,
        cultureId: cultureId ?? null,
        categorieId: categorieId ?? null,
        genre: genre ?? null,
        appliesTo: appliesTo ?? null,
        keywords: keywords ?? null,
      },
      items,
      warning: items.length === 0 ? "Aucun fragment généré." : undefined,
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