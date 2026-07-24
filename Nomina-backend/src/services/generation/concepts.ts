import type { Request, Response } from "express";
import { z } from "zod";
import OpenAI from "openai";
import prisma from "../../utils/prisma";
import { createRng } from "../../services/generation/rng";
import {
  countQuerySchema,
  optionalIdQuerySchema,
  optionalStringQuerySchema,
  generateRealisticConceptIdeas,
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

async function buildContext(categorieId?: number) {
  const [categorie, sampleConcepts] = await Promise.all([
    categorieId
      ? prisma.categorie.findUnique({ where: { id: categorieId }, select: { name: true } })
      : null,
    prisma.concept.findMany({
      where: categorieId ? { categorieId } : {},
      select: { valeur: true, type: true },
      take: 8,
    }),
  ]);

  return {
    categorie: categorie?.name ?? null,
    existingConcepts: sampleConcepts.map((c: { valeur: string; type: string | null }) =>
      `${c.valeur}${c.type ? ` (${c.type})` : ""}`
    ),
  };
}

// ── Prompts (mode recherche/mots-clés) ────────────────────────────────────────

function buildSystemPrompt(): string {
  return `Tu es un générateur de concepts créatifs (idées narratives, thèmes, moteurs de quête) pour jeux de rôle, romans et univers fictifs.
Tu génères du contenu en français.
Tu dois TOUJOURS répondre avec du JSON valide et rien d'autre (pas de texte avant ou après, pas de bloc markdown).
Respecte strictement la structure demandée.`;
}

function buildUserPrompt(
  count: number,
  keywords: string | undefined,
  context: Awaited<ReturnType<typeof buildContext>>
): string {
  const contextLines: string[] = [];
  if (context.categorie) contextLines.push(`Catégorie : ${context.categorie}`);
  if (keywords) contextLines.push(`Mots-clés / thème demandé : ${keywords}`);

  const inspirationBlock = context.existingConcepts.length > 0
    ? `\nConcepts déjà existants dans cet univers (inspire-toi du style, ne les recopie pas) :\n${context.existingConcepts.map((c: string) => `  - ${c}`).join("\n")}\n`
    : "";

  const keywordsInstruction = keywords
    ? `\nIMPORTANT — instruction sur les mots-clés "${keywords}" :
TOUS les ${count} concepts générés doivent explorer des variations ou des angles différents directement liés à "${keywords}" — pas des concepts vaguement liés au thème général.\n`
    : "";

  return `Génère ${count} concepts créatifs (idées narratives ou moteurs de quête).

${contextLines.length > 0 ? `Contexte :\n${contextLines.map(l => `  - ${l}`).join("\n")}\n` : ""}${inspirationBlock}${keywordsInstruction}
Retourne UNIQUEMENT un objet JSON avec cette structure exacte :
{
  "items": [
    {
      "valeur": "Le Serment Brisé",
      "type": "Trahison",
      "mood": "sombre",
      "elevatorPitch": "Une phrase qui résume l'idée centrale et son potentiel narratif.",
      "twist": "Un retournement de situation possible lié au concept.",
      "hook": "Une accroche qui donne envie d'explorer ce concept."
    }
  ]
}

Règles importantes :
- Exactement ${count} concepts dans le tableau items.
- Chaque concept doit être DISTINCT des autres.
- Ne retourne AUCUN texte en dehors du JSON.`;
}

// ── Controller ────────────────────────────────────────────────────────────────

export const generateConcepts = async (req: Request, res: Response) => {
  const parsed = z
    .object({
      count: countQuerySchema,
      categorieId: optionalIdQuerySchema,
      conceptId: optionalIdQuerySchema,
      topic: optionalStringQuerySchema,
      seed: optionalStringQuerySchema,
      keywords: optionalStringQuerySchema,
    })
    .safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: "Paramètres invalides", issues: parsed.error.issues });
  }

  const { count, categorieId, conceptId, topic, seed, keywords } = parsed.data;
  const requestedCategorieId = categorieId ?? null;
  const rng = createRng(seed);
  const effectiveSeed = seed ?? rng.seed;

  // ── Mode "brief" réaliste sur un sujet — conservé tel quel, fonctionne bien ──
  if (topic && topic.length > 0) {
    const generated = generateRealisticConceptIdeas({ count, seed, topic, categorieId: requestedCategorieId ?? undefined, rng });
    return res.json({
      ...generated,
      warning: requestedCategorieId ? undefined : "Astuce: sélectionnez une catégorie pour organiser vos concepts.",
    });
  }

  // ── Mode recherche/génération IA (mots-clés ou catégorie seule) ──────────────
  try {
    const client = getClient();
    const model = getModel();
    const context = await buildContext(categorieId);

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(Math.min(count, 30), keywords, context) },
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
      valeur: String(it.valeur ?? "Concept inconnu"),
      type: it.type ? String(it.type) : null,
      mood: it.mood ? String(it.mood) : null,
      elevatorPitch: it.elevatorPitch ? String(it.elevatorPitch) : null,
      twist: it.twist ? String(it.twist) : null,
      hook: it.hook ? String(it.hook) : null,
      categorieId: requestedCategorieId,
    }));

    return res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { categorieId: requestedCategorieId, conceptId: conceptId ?? null, keywords: keywords ?? null },
      items,
      warning: items.length === 0 ? "Aucun concept généré." : undefined,
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