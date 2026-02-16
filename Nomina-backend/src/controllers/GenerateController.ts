import type { Request, Response } from "express";
import { z } from "zod";
import { generateNpcIdeas } from "../services/generation/npcGenerator";
import prisma from "../utils/prisma";
import { createRng } from "../services/generation/rng";

function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

function splitKeywords(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;|]/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}

const countQuerySchema = z.coerce.number().int().min(1).max(200).default(10);
const optionalIdQuerySchema = z.coerce.number().int().optional();
const optionalStringQuerySchema = z
  .string()
  .transform((s) => s.trim())
  .optional()
  .transform((s) => (s && s.length > 0 ? s : undefined));

export const generateNpcs = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        cultureId: optionalIdQuerySchema,
        categorieId: optionalIdQuerySchema,
        genre: optionalStringQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, cultureId, categorieId, genre, seed } = parsed.data;

    const result = await generateNpcIdeas({ count, cultureId, categorieId, genre, seed });
    res.json(result);
  } catch (error) {
    console.error("Erreur generateNpcs:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

function normalizeGenreValues(input: string): string[] {
  const raw = input.trim();
  if (!raw) return [];
  const lc = raw.toLowerCase();

  const m = new Set<string>();
  const add = (s: string) => {
    if (s && s.trim()) m.add(s);
  };

  // Ajout des variantes courantes (la BD peut contenir "M"/"F"/"NB" OU des libellés).
  if (["m", "masculin", "male", "homme"].includes(lc)) {
    ["M", "m", "Masculin", "masculin", "Male", "male", "Homme", "homme"].forEach(add);
  } else if (["f", "féminin", "feminin", "female", "femme"].includes(lc)) {
    ["F", "f", "Féminin", "féminin", "Feminin", "feminin", "Female", "female", "Femme", "femme"].forEach(add);
  } else if (["nb", "non-binaire", "non binaire", "nonbinaire", "neutre", "neutral", "neutre."].includes(lc)) {
    [
      "NB",
      "nb",
      "Non-binaire",
      "non-binaire",
      "Non binaire",
      "non binaire",
      "Nonbinaire",
      "nonbinaire",
      "Neutre",
      "neutre",
      "Neutral",
      "neutral",
    ].forEach(add);
  } else {
    // Si c'est une valeur custom (ex: "androgyne"), on la garde telle quelle.
    add(raw);
  }

  return Array.from(m);
}

function buildGenreWhere(input?: string): { in: string[] } | undefined {
  if (input === undefined) return undefined;
  const values = normalizeGenreValues(input);
  return values.length > 0 ? { in: values } : undefined;
}

function toTitleCase(input: string): string {
  const s = input.trim();
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateRealisticConceptIdeas(params: {
  count: number;
  seed?: string;
  topic: string;
  categorieId?: number;
  rng: ReturnType<typeof createRng>;
}) {
  const { count, seed, topic, categorieId, rng } = params;
  const effectiveSeed = seed ?? rng.seed;

  const normalizedTopic = topic.trim();
  const topicLabel = toTitleCase(normalizedTopic);

  const angles = [
    "durabilité",
    "confort",
    "performance",
    "style",
    "innovation",
    "accessibilité",
    "personnalisation",
    "éthique",
    "prix malin",
    "communauté",
  ];

  const formats = [
    "challenge UGC",
    "expérience retail",
    "campagne social-first",
    "partenariat influence",
    "activation événementielle",
    "mini-série vidéo",
    "test AR / try-on",
    "programme d'ambassadeurs",
    "stunt PR",
    "produit-service (abonnement)",
  ];

  const audiences = [
    "étudiants",
    "jeunes actifs",
    "sportifs",
    "parents",
    "professionnels",
    "urbains",
    "randonneurs",
    "créatifs",
    "fans de mode",
  ];

  const channels = [
    "TikTok",
    "Instagram",
    "YouTube Shorts",
    "affichage (OOH)",
    "podcasts",
    "newsletter",
    "pop-up store",
    "partenariats locaux",
    "événements",
    "site + landing",
  ];

  const deliverables = [
    "3 vidéos courtes (15–30s)",
    "1 landing page",
    "1 kit influence",
    "1 plan media",
    "1 concept visuel (key visual)",
    "1 slogan + variantes",
    "1 mécanique UGC",
    "1 activation terrain",
  ];

  const verbs = ["réinventer", "simplifier", "réduire", "améliorer", "déclencher", "transformer", "réconcilier"];
  const benefits = [
    "le quotidien",
    "la mobilité",
    "la confiance",
    "la liberté",
    "le bien-être",
    "la créativité",
    "l'engagement",
  ];

  const items = Array.from({ length: Math.min(count, 50) }).map((_, i) => {
    const angle = pick(angles, rng.next);
    const format = pick(formats, rng.next);
    const audience = pick(audiences, rng.next);
    const primaryChannel = pick(channels, rng.next);
    const verb = pick(verbs, rng.next);
    const benefit = pick(benefits, rng.next);

    const title = `${topicLabel} — ${toTitleCase(angle)}`;
    const insight = `Les gens veulent ${verb} ${benefit} sans sacrifier ${angle}.`;
    const hook = `Accroche: et si vos ${normalizedTopic} prouvaient (en 10 secondes) la différence ?`;
    const elevatorPitch =
      `Concept ${format} pour ${topicLabel}, centré sur ${angle}, ciblant ${audience}. ` +
      `On déclenche l'essai via ${primaryChannel}, puis on convertit avec une promesse simple et mesurable.`;

    const slogans = [
      `${topicLabel}. ${toTitleCase(angle)} qui se voit.`,
      `Marchez plus loin, pensez ${toTitleCase(angle)}.`,
      `${toTitleCase(angle)} sans compromis.`,
    ];

    const kpis = [
      "Taux de visionnage (VTR)",
      "CTR vers la landing",
      "Taux d'ajout au panier",
      "Coût par lead",
      "UGC créés",
      "Trafic en boutique",
    ];

    return {
      id: `prompt-${i + 1}`,
      valeur: title,
      type: "Concept réaliste (brief)" as const,
      mood: "innovant" as const,
      keywords: [normalizedTopic, angle, audience, primaryChannel].join(", "),
      categorieId: categorieId ?? null,
      elevatorPitch,
      insight,
      hook,
      channels: [primaryChannel, pick(channels, rng.next), pick(channels, rng.next)].filter(Boolean),
      deliverables: [pick(deliverables, rng.next), pick(deliverables, rng.next), pick(deliverables, rng.next)],
      slogans,
      kpis: [pick(kpis, rng.next), pick(kpis, rng.next), pick(kpis, rng.next)],
    };
  });

  return {
    seed: effectiveSeed,
    count: items.length,
    filters: { categorieId: categorieId ?? null, topic: normalizedTopic },
    items,
  };
}


function sampleWithoutReplacement<T>(arr: T[], k: number, rnd: () => number): T[] {
  const copy = arr.slice();
  const out: T[] = [];
  for (let i = 0; i < k && copy.length > 0; i++) {
    const idx = Math.floor(rnd() * copy.length);
    out.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return out;
}

// GET /generate/nom-personnages
export const generateNomPersonnages = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        cultureId: optionalIdQuerySchema,
        universId: optionalIdQuerySchema,
        categorieId: optionalIdQuerySchema,
        titreId: optionalIdQuerySchema,
        genre: optionalStringQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, cultureId, universId, categorieId, titreId, genre, seed } = parsed.data;

    let effectiveCultureId = cultureId;
    let effectiveCategorieId = categorieId;
    let effectiveGenre = genre;
    let selectedTitre: {
      id: number;
      valeur: string;
      genre: string | null;
      cultureId: number | null;
      categorieId: number | null;
      categorieUniversId: number | null;
    } | null = null;

    if (titreId !== undefined) {
      const t = await prisma.titre.findUnique({
        where: { id: titreId },
        select: {
          id: true,
          valeur: true,
          genre: true,
          cultureId: true,
          categorieId: true,
          categorie: { select: { universId: true } },
        },
      });

      if (!t) {
        return res.status(404).json({ error: "Titre introuvable" });
      }

      selectedTitre = {
        id: t.id,
        valeur: t.valeur,
        genre: t.genre ?? null,
        cultureId: t.cultureId ?? null,
        categorieId: t.categorieId ?? null,
        categorieUniversId: t.categorie?.universId ?? null,
      };

      // Compatibilités strictes si l'utilisateur a déjà choisi un filtre.
      if (effectiveCultureId !== undefined && selectedTitre.cultureId !== null && effectiveCultureId !== selectedTitre.cultureId) {
        return res.status(400).json({ error: "Titre incompatible avec la culture sélectionnée" });
      }
      if (effectiveCategorieId !== undefined && selectedTitre.categorieId !== null && effectiveCategorieId !== selectedTitre.categorieId) {
        return res.status(400).json({ error: "Titre incompatible avec la catégorie sélectionnée" });
      }
      if (universId !== undefined && selectedTitre.categorieUniversId !== null && universId !== selectedTitre.categorieUniversId) {
        return res.status(400).json({ error: "Titre incompatible avec l'univers sélectionné" });
      }
      if (effectiveGenre !== undefined && selectedTitre.genre !== null) {
        const want = new Set(normalizeGenreValues(effectiveGenre));
        const have = new Set(normalizeGenreValues(selectedTitre.genre));
        const ok = Array.from(have).some((v) => want.has(v));
        if (!ok) {
          return res.status(400).json({ error: "Titre incompatible avec le genre sélectionné" });
        }
      }

      // Defaults: si le titre porte déjà des contraintes, on s'aligne.
      if (effectiveCultureId === undefined && selectedTitre.cultureId !== null) effectiveCultureId = selectedTitre.cultureId;
      if (effectiveCategorieId === undefined && selectedTitre.categorieId !== null) effectiveCategorieId = selectedTitre.categorieId;
      if (effectiveGenre === undefined && selectedTitre.genre !== null) effectiveGenre = selectedTitre.genre;
    }

    const generated = await generateNpcIdeas({
      count,
      cultureId: effectiveCultureId,
      categorieId: effectiveCategorieId,
      universId,
      genre: effectiveGenre,
      seed,
    });

    const toMiniBio = (text: string | undefined): string | null => {
      if (!text) return null;
      const trimmed = text.trim();
      if (!trimmed) return null;

      // Mini-bio: 3–5 phrases max, mais on évite les pavés.
      const parts = trimmed
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const maxSentences = 5;
      const maxChars = 420;

      const out: string[] = [];
      for (const sentence of parts.slice(0, maxSentences)) {
        const candidate = [...out, sentence].join(" ");
        if (candidate.length > maxChars) break;
        out.push(sentence);
      }

      const take = out.join(" ").trim();
      return take.length > 0 ? take : null;
    };

    const items = Array.isArray((generated as any).items)
      ? (generated as any).items.map((it: any) => ({
          nameId: it.nameId ?? null,
          name: it.name ?? null,
          displayName:
            selectedTitre && it.name
              ? `${selectedTitre.valeur} ${it.name}`
              : (it.name ?? null),
          titreId: selectedTitre?.id ?? null,
          titreValeur: selectedTitre?.valeur ?? null,
          genre: it.genre ?? null,
          cultureId: it.cultureId ?? null,
          categorieId: it.categorieId ?? null,
          miniBio: toMiniBio(it.backstory),
        }))
      : [];

    res.json({
      seed: (generated as any).seed,
      count: items.length,
      filters: {
        ...((generated as any).filters ?? {
          cultureId: effectiveCultureId ?? null,
          categorieId: effectiveCategorieId ?? null,
          genre: effectiveGenre ?? null,
        }),
        universId: universId ?? null,
        titreId: selectedTitre?.id ?? (titreId ?? null),
      },
      items,
      warning: (generated as any).warning,
    });
  } catch (error) {
    console.error("Erreur generateNomPersonnages:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /generate/lieux
export const generateLieux = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        categorieId: optionalIdQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, categorieId, seed } = parsed.data;

    const rng = createRng(seed);
    const effectiveSeed = seed ?? rng.seed;

    const rows = await prisma.lieux.findMany({
      where: {
        categorieId,
      },
      select: { id: true, value: true, type: true, categorieId: true },
      orderBy: { id: "asc" },
    });

    const items = sampleWithoutReplacement(rows, Math.min(count, rows.length), rng.next).map((l) => ({
      id: l.id,
      value: l.value,
      type: l.type ?? null,
      categorieId: l.categorieId ?? null,
    }));

    res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { categorieId: categorieId ?? null },
      items,
      warning: rows.length === 0 ? "Aucun Lieu ne match les filtres." : undefined,
    });
  } catch (error) {
    console.error("Erreur generateLieux:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /generate/fragments-histoire
export const generateFragmentsHistoire = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        cultureId: optionalIdQuerySchema,
        categorieId: optionalIdQuerySchema,
        genre: optionalStringQuerySchema,
        appliesTo: optionalStringQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, cultureId, categorieId, genre, appliesTo, seed } = parsed.data;

    const rng = createRng(seed);
    const effectiveSeed = seed ?? rng.seed;

    const rows = await prisma.fragmentsHistoire.findMany({
      where: {
        cultureId,
        categorieId,
        genre: buildGenreWhere(genre),
        appliesTo,
      },
      select: { id: true, texte: true, appliesTo: true, genre: true, cultureId: true, categorieId: true },
      orderBy: { id: "asc" },
    });

    const items = sampleWithoutReplacement(rows, Math.min(count, rows.length), rng.next).map((f) => ({
      id: f.id,
      texte: f.texte,
      appliesTo: f.appliesTo ?? null,
      genre: f.genre ?? null,
      cultureId: f.cultureId ?? null,
      categorieId: f.categorieId ?? null,
    }));

    res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: {
        cultureId: cultureId ?? null,
        categorieId: categorieId ?? null,
        genre: genre ?? null,
        appliesTo: appliesTo ?? null,
      },
      items,
      warning: rows.length === 0 ? "Aucun Fragment d'histoire ne match les filtres." : undefined,
    });
  } catch (error) {
    console.error("Erreur generateFragmentsHistoire:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /generate/titres
export const generateTitres = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        cultureId: optionalIdQuerySchema,
        categorieId: optionalIdQuerySchema,
        genre: optionalStringQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, cultureId, categorieId, genre, seed } = parsed.data;

    const rng = createRng(seed);
    const effectiveSeed = seed ?? rng.seed;

    const rows = await prisma.titre.findMany({
      where: {
        cultureId,
        categorieId,
        genre: buildGenreWhere(genre),
      },
      select: { id: true, valeur: true, type: true, genre: true, cultureId: true, categorieId: true },
      orderBy: { id: "asc" },
    });

    const items = sampleWithoutReplacement(rows, Math.min(count, rows.length), rng.next).map((t) => ({
      id: t.id,
      valeur: t.valeur,
      type: t.type ?? null,
      genre: t.genre ?? null,
      cultureId: t.cultureId ?? null,
      categorieId: t.categorieId ?? null,
    }));

    res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { cultureId: cultureId ?? null, categorieId: categorieId ?? null, genre: genre ?? null },
      items,
      warning: rows.length === 0 ? "Aucun Titre ne match les filtres." : undefined,
    });
  } catch (error) {
    console.error("Erreur generateTitres:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /generate/concepts
export const generateConcepts = async (req: Request, res: Response) => {
  try {
    const parsed = z
      .object({
        count: countQuerySchema,
        categorieId: optionalIdQuerySchema,
        conceptId: optionalIdQuerySchema,
        topic: optionalStringQuerySchema,
        seed: optionalStringQuerySchema,
      })
      .safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Paramètres invalides",
        issues: parsed.error.issues,
      });
    }

    const { count, categorieId, conceptId, topic, seed } = parsed.data;

    const requestedCategorieId = categorieId ?? null;

    const rng = createRng(seed);
    const effectiveSeed = seed ?? rng.seed;

    // Mode "brief" réaliste sur un sujet (ex: pub → chaussures)
    if (topic && topic.length > 0) {
      const generated = generateRealisticConceptIdeas({
        count,
        seed,
        topic,
        categorieId: requestedCategorieId ?? undefined,
        rng,
      });

      return res.json({
        ...generated,
        warning: requestedCategorieId ? undefined : "Astuce: sélectionnez une catégorie pour organiser vos concepts.",
      });
    }

    let usedFallback = false;

    let rows = await prisma.concept.findMany({
      where: {
        ...(requestedCategorieId ? { categorieId: requestedCategorieId } : {}),
        ...(conceptId ? { id: conceptId } : {}),
      },
      select: {
        id: true,
        valeur: true,
        type: true,
        mood: true,
        keywords: true,
        categorieId: true,
      },
      orderBy: { id: "asc" },
    });

    // Si la catégorie n'a aucun concept, on retombe sur tous les concepts pour éviter un "0 résultat" frustrant.
    // (On ne fait PAS de fallback si conceptId est fourni: dans ce cas, c'est une sélection explicite.)
    if (!conceptId && requestedCategorieId && rows.length === 0) {
      usedFallback = true;
      rows = await prisma.concept.findMany({
        select: {
          id: true,
          valeur: true,
          type: true,
          mood: true,
          keywords: true,
          categorieId: true,
        },
        orderBy: { id: "asc" },
      });
    }

    const items = sampleWithoutReplacement(rows, Math.min(count, rows.length), rng.next).map((c) => {
      const mood = c.mood ?? pick(["mystérieux", "épique", "sombre", "onirique", "tendu", "lumineux"], rng.next);
      const kws = splitKeywords(c.keywords);
      const k1 = kws[0] ?? pick(["secret", "quête", "rituel", "héritage", "frontière", "anomalie"], rng.next);
      const k2 = kws[1] ?? pick(["alliance", "trahison", "mémoire", "artefact", "serment", "mensonge"], rng.next);
      const k3 = kws[2] ?? pick(["prix", "conséquence", "danger", "révélation", "dilemme", "menace"], rng.next);

      const elevatorPitch = `« ${c.valeur} » est une idée ${mood} centrée sur ${k1} et ${k2}. Elle sert de moteur narratif et ouvre des arcs de quête, de conflit et de révélation.`;
      const twist = `Twist : ${k2} n'est qu'un écran — la véritable cause implique ${k3}.`;
      const hook = `Accroche : quand ${k1} refait surface, vos personnages doivent choisir entre préserver l'ordre ou dévoiler la vérité.`;
      const questions = [
        `Qui contrôle « ${c.valeur} » et pourquoi ?`,
        `Quel est le prix exact de ${k1} dans votre univers ?`,
      ];

      return {
        id: c.id,
        valeur: c.valeur,
        type: c.type ?? null,
        mood,
        keywords: c.keywords ?? null,
        categorieId: c.categorieId ?? null,

        // Champs "créatifs" (non persistés) pour enrichir la génération.
        elevatorPitch,
        twist,
        hook,
        questions,
      };
    });

    res.json({
      seed: effectiveSeed,
      count: items.length,
      filters: { categorieId: categorieId ?? null, conceptId: conceptId ?? null, topic: null },
      items,
      warning:
        rows.length === 0
          ? "Aucun Concept ne match les filtres."
          : usedFallback
            ? "Aucun Concept dans cette catégorie : génération faite sur l'ensemble des concepts."
            : undefined,
    });
  } catch (error) {
    console.error("Erreur generateConcepts:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

