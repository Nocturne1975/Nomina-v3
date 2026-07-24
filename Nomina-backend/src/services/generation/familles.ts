import type { Request, Response } from "express";
import { z } from "zod";
import OpenAI from "openai";
import prisma from "../../utils/prisma";
import {
  countQuerySchema,
  optionalIdQuerySchema,
  optionalStringQuerySchema,
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
  const [culture, categorie, sampleNoms] = await Promise.all([
    options.cultureId
      ? prisma.culture.findUnique({ where: { id: options.cultureId }, select: { name: true, description: true } })
      : null,
    options.categorieId
      ? prisma.categorie.findUnique({ where: { id: options.categorieId }, select: { name: true } })
      : null,
    prisma.nomFamille.findMany({
      where: {
        ...(options.cultureId ? { cultureId: options.cultureId } : {}),
        ...(options.categorieId ? { categorieId: options.categorieId } : {}),
      },
      select: { valeur: true },
      take: 10,
    }),
  ]);

  return {
    culture: culture?.name ?? null,
    cultureDesc: culture?.description ?? null,
    categorie: categorie?.name ?? null,
    existingNoms: sampleNoms.map((n: { valeur: string | null }) => n.valeur).filter(Boolean) as string[],
  };
}

// ── Prompts ───────────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `Tu es un générateur de noms de famille fictifs pour jeux de rôle, romans et univers fictifs.
Tu génères du contenu en français.
Tu dois TOUJOURS répondre avec du JSON valide et rien d'autre (pas de texte avant ou après, pas de bloc markdown).
Respecte strictement la structure demandée. Chaque nom doit être unique, prononçable et cohérent avec le contexte culturel donné.`;
}

function buildUserPrompt(
  count: number,
  keywords: string | undefined,
  context: Awaited<ReturnType<typeof buildContext>>
): string {
  const contextLines: string[] = [];
  if (context.culture) contextLines.push(`Culture : ${context.culture}${context.cultureDesc ? ` — ${context.cultureDesc}` : ""}`);
  if (context.categorie) contextLines.push(`Catégorie : ${context.categorie}`);
  if (keywords) contextLines.push(`Mots-clés / style demandé : ${keywords}`);

  const inspirationBlock = context.existingNoms.length > 0
    ? `\nNoms de famille déjà existants dans cette culture (inspire-toi du style sonore, ne les recopie pas) :\n${context.existingNoms.map((n: string) => `  - ${n}`).join("\n")}\n`
    : "";

  return `Génère ${count} noms de famille fictifs.

${contextLines.length > 0 ? `Contexte :\n${contextLines.map(l => `  - ${l}`).join("\n")}\n` : ""}${inspirationBlock}
Retourne UNIQUEMENT un objet JSON avec cette structure exacte :
{
  "items": ["Solcrest", "Dumontier", "Vasseur"]
}

Règles importantes :
- Exactement ${count} noms de famille dans le tableau items.
- Chaque nom doit être DISTINCT des autres et cohérent avec le style culturel demandé.
- Ne retourne AUCUN texte en dehors du JSON.`;
}

// ── Controller ────────────────────────────────────────────────────────────────

export const generateNomFamille = async (req: Request, res: Response) => {
  const parsed = z
    .object({
      count: countQuerySchema,
      cultureId: optionalIdQuerySchema,
      categorieId: optionalIdQuerySchema,
      seed: optionalStringQuerySchema,
      keywords: optionalStringQuerySchema,
    })
    .safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: "Paramètres invalides", issues: parsed.error.issues });
  }

  const { count, cultureId, categorieId, seed, keywords } = parsed.data;
  const effectiveSeed = seed ?? `familles-${Date.now()}`;

  try {
    const client = getClient();
    const model = getModel();
    const context = await buildContext({ cultureId, categorieId });

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(Math.min(count, 50), keywords, context) },
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
    const items = rawItems.map((valeur: unknown) => ({
      valeur: String(valeur),
      cultureId: cultureId ?? null,
      categorieId: categorieId ?? null,
    }));

    return res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { cultureId: cultureId ?? null, categorieId: categorieId ?? null, keywords: keywords ?? null },
      items,
      warning: items.length === 0 ? "Aucun nom de famille généré." : undefined,
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