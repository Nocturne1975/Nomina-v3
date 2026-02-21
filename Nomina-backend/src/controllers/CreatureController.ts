import type { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getCreatures = async (_req: Request, res: Response) => {
  try {
    const creatures = await prisma.creature.findMany({
      include: {
        categorie: true,
        culture: true,
        personnage: true,
      },
      orderBy: { id: 'asc' },
    });
    res.json(creatures);
  } catch (error) {
    console.error('Erreur getCreatures:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getCreatureById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const creature = await prisma.creature.findUnique({
      where: { id },
      include: {
        categorie: true,
        culture: true,
        personnage: true,
      },
    });

    if (!creature) return res.status(404).json({ error: 'Creature non trouvée' });

    res.json(creature);
  } catch (error) {
    console.error('Erreur getCreatureById:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const createCreature = async (req: Request, res: Response) => {
  try {
    const { valeur, type, description, personnageId, cultureId, categorieId } = req.body as {
      valeur?: string;
      type?: string | null;
      description?: string | null;
      personnageId?: number | string | null;
      cultureId?: number | string | null;
      categorieId?: number | string | null;
    };

    if (!valeur || typeof valeur !== 'string') {
      return res.status(400).json({ error: 'Le champ "valeur" est requis et doit être une chaîne' });
    }

    const personnageIdNum = personnageId !== undefined && personnageId !== null ? Number(personnageId) : null;
    const cultureIdNum = cultureId !== undefined && cultureId !== null ? Number(cultureId) : null;
    const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;

    const newCreature = await prisma.creature.create({
      data: {
        valeur,
        type: type ?? null,
        description: description ?? null,
        personnageId: personnageIdNum,
        cultureId: cultureIdNum,
        categorieId: categorieIdNum,
      },
    });

    res.status(201).json(newCreature);
  } catch (error) {
    console.error('Erreur createCreature:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updateCreature = async (req: Request, res: Response) => {
  try {
    const { valeur, type, description, personnageId, cultureId, categorieId } = req.body as {
      valeur?: string | null;
      type?: string | null;
      description?: string | null;
      personnageId?: number | string | null;
      cultureId?: number | string | null;
      categorieId?: number | string | null;
    };

    const personnageIdNum = personnageId !== undefined && personnageId !== null ? Number(personnageId) : null;
    const cultureIdNum = cultureId !== undefined && cultureId !== null ? Number(cultureId) : null;
    const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;

    const updated = await prisma.creature.update({
      where: { id: Number(req.params.id) },
      data: {
        valeur: valeur ?? undefined,
        type: type ?? null,
        description: description ?? null,
        personnageId: personnageId === undefined ? undefined : personnageIdNum,
        cultureId: cultureId === undefined ? undefined : cultureIdNum,
        categorieId: categorieId === undefined ? undefined : categorieIdNum,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Erreur updateCreature:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteCreature = async (req: Request, res: Response) => {
  try {
    await prisma.creature.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    console.error('Erreur deleteCreature:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const totalCreatures = async (_req: Request, res: Response) => {
  try {
    const count = await prisma.creature.count();
    res.json({ total: count });
  } catch (error) {
    console.error('Erreur totalCreatures:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
