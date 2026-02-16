import type { Request, Response } from 'express';
import prisma from '../utils/prisma';

// GET - lister tous les concepts
export const getConcepts = async (_req: Request, res: Response) => {
  try {
    const concepts = await prisma.concept.findMany({
      include: {
        categorie: true,
      },
      orderBy: { id: 'asc' },
    });
    res.json(concepts);
  } catch (error) {
    console.error('Erreur getConcepts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET - récupérer un concept par id (avec la catégorie)
export const getConceptById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const concept = await prisma.concept.findUnique({
      where: { id },
      include: {
        categorie: true,
      },
    });
    if (!concept) return res.status(404).json({ error: 'Concept non trouvé' });
    res.json(concept);
  } catch (error) {
    console.error('Erreur getConceptById:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST - créer un nouveau concept
export const createConcept = async (req: Request, res: Response) => {
  try {
    const { valeur, type, mood, keywords, categorieId } = req.body as {
      valeur?: string;
      type?: string | null;
      mood?: string | null;
      keywords?: string | null;
      categorieId?: number | string | null;
    };

    // valeur est requis selon le schema Prisma
    if (!valeur || typeof valeur !== 'string') {
      return res.status(400).json({ error: 'Le champ "valeur" est requis et doit être une chaîne' });
    }

    const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;

    const newConcept = await prisma.concept.create({
      data: {
        valeur,
        type: type ?? null,
        mood: mood ?? null,
        keywords: keywords ?? null,
        categorieId: categorieIdNum,
      },
    });

    res.status(201).json(newConcept);
  } catch (error) {
    console.error('Erreur createConcept:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// PUT - modifier un concept par son id
export const updateConcept = async (req: Request, res: Response) => {
  try {
    const { valeur, type, mood, keywords, categorieId } = req.body as {
      valeur?: string | null;
      type?: string | null;
      mood?: string | null;
      keywords?: string | null;
      categorieId?: number | string | null;
    };

    const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;

    const updated = await prisma.concept.update({
      where: { id: Number(req.params.id) },
      data: {
        valeur: valeur ?? undefined,
        type: type ?? null,
        mood: mood ?? null,
        keywords: keywords ?? null,
        categorieId: categorieId === undefined ? undefined : categorieIdNum,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Erreur updateConcept:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE - supprimer un concept
export const deleteConcept = async (req: Request, res: Response) => {
  try {
    await prisma.concept.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    console.error('Erreur deleteConcept:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Aggregation - obtenir le nombre total de concepts
export const totalConcepts = async (_req: Request, res: Response) => {
  try {
    const count = await prisma.concept.count();
    res.json({ total: count });
  } catch (error) {
    console.error('Erreur totalConcepts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};