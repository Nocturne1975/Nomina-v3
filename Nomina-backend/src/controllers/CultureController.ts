import type { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getCultureById = async (req: Request, res: Response) => {
  try {
    const culture = await prisma.culture.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        nomPersonnages: true,    
        fragmentsHistoire: true,
        titres: true,        
      },
    });
    if (!culture) return res.status(404).json({ error: 'Culture non trouvée' });
    res.json(culture);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST - creer une nouvelle culture
export const createCulture = async (req: Request, res: Response) => {
  try { const { name, description } = req.body as { name: string; description: string };
    const newCulture = await prisma.culture.create({
      data: { name, description },
    });
    res.status(201).json(newCulture);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// PUT - modifier la culture par son id
export const updateCulture  = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body as { name: string; description: string };
    const updatedCulture = await prisma.culture.update({
      where: { id: Number(req.params.id) },
      data: { name, description },
    });
    res.json(updatedCulture);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE - supprimer une culture
export const deleteCulture = async (req: Request, res: Response) => {
  try {
    await prisma.culture.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Aggregation - obtenir le nombre total de cultures
export const totalCulture = async (req: Request, res: Response) => {
  try { const count = await prisma.culture.count();
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Lister toutes les cultures pour le dropdown "Culture"
export const getCultures = async (_req: Request, res: Response) => {
  try {
    const cultures = await prisma.culture.findMany({ orderBy: { id: "asc" } });
    res.json(cultures);
  } catch (error) {
    console.error("Erreur getCultures:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};