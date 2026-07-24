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

async function buildContext(categorieId?: number) {
  const [categorie, sampleLieux] = await Promise.all([
    categorieId
      ? prisma.categorie.findUnique({ where: { id: categorieId }, select: { name: true } })
      : null,
    prisma.lieux.findMany({
      where: categorieId ? { categorieId } : {},
      select: { value: true, type: true },
      take: 8,
    }),
  ]);

  return {
    categorie: categorie?.name ?? null,
    existingLieux: sampleLieux.map((l: { value: string; type: string | null }) =>
      `${l.value}${l.type ? ` (${l.type})` : ""}`
    ),
  };
}

// ── Prompts ───────────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `Tu es un générateur de lieux fictifs pour jeux de rôle, romans et jeux vidéo.
Tu génères du contenu en français.
Tu dois TOUJOURS répondre avec du JSON valide et rien d'autre (pas de texte avant ou après, pas de bloc markdown).
Respecte strictement la structure demandée. Chaque lieu doit être unique et évocateur — évite de répéter les mêmes types ou structures de noms d'un lieu à l'autre.`;
}

function buildUserPrompt(
  count: number,
  keywords: string | undefined,
  context: Awaited<ReturnType<typeof buildContext>>
): string {
  const contextLines: string[] = [];
  if (context.categorie) contextLines.push(`Catégorie : ${context.categorie}`);
  if (keywords) contextLines.push(`Mots-clés / thème demandé : ${keywords}`);

  const inspirationBlock = context.existingLieux.length > 0
    ? `\nLieux déjà existants dans cet univers (inspire-toi du style, ne les recopie pas) :\n${context.existingLieux.map((l: string) => `  - ${l}`).join("\n")}\n`
    : "";

  const keywordsInstruction = keywords
    ? `\nIMPORTANT — instruction sur les mots-clés "${keywords}" :
Si ces mots-clés désignent un lieu précis (un nom propre, une description directe), alors TOUS les ${count} lieux générés doivent être des VARIATIONS de ce même lieu — autant d'interprétations différentes possibles (type différent, ambiance différente, histoire différente), mais en gardant le même nom ou une variante très proche du nom donné. L'utilisateur veut explorer plusieurs versions du même lieu pour choisir celle qui lui convient, pas une collection de lieux voisins ou liés.
Si les mots-clés décrivent plutôt un thème ou une ambiance générale (ex: "forêt", "désert glacé"), génère des lieux variés inspirés de ce thème sans cette contrainte.\n`
    : "";

  return `Génère ${count} lieux fictifs.

${contextLines.length > 0 ? `Contexte :\n${contextLines.map(l => `  - ${l}`).join("\n")}\n` : ""}${inspirationBlock}${keywordsInstruction}
Retourne UNIQUEMENT un objet JSON avec cette structure exacte :
{
  "items": [
    {
      "value": "Citadelle de Givre",
      "type": "Forteresse",
      "description": "Description courte (1-2 phrases) qui évoque l'ambiance, l'histoire ou la fonction du lieu."
    }
  ]
}

Règles importantes :
- Exactement ${count} lieux dans le tableau items.
- Chaque lieu doit être DISTINCT des autres en type et en ambiance.
- "type" doit être court (1-3 mots) : ex. Forteresse, Cité portuaire, Forêt maudite, Marché souterrain.
- Ne retourne AUCUN texte en dehors du JSON.`;
}

// ── Controller ────────────────────────────────────────────────────────────────

export const generateLieux = async (req: Request, res: Response) => {
  const parsed = z
    .object({
      count: countQuerySchema,
      categorieId: optionalIdQuerySchema,
      seed: optionalStringQuerySchema,
      keywords: optionalStringQuerySchema,
    })
    .safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: "Paramètres invalides", issues: parsed.error.issues });
  }

  const { count, categorieId, seed, keywords } = parsed.data;
  const effectiveSeed = seed ?? `lieux-${Date.now()}`;

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
      value: String(it.value ?? "Lieu inconnu"),
      type: it.type ? String(it.type) : null,
      description: it.description ? String(it.description) : null,
      categorieId: categorieId ?? null,
    }));

    return res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { categorieId: categorieId ?? null, keywords: keywords ?? null },
      items,
      warning: items.length === 0 ? "Aucun lieu généré." : undefined,
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