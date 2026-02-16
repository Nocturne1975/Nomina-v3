import type { Request, Response } from "express";
import prisma from "../utils/prisma";

// Lister les univers thématiques pour le dropdown "Univers Thématique"
export const getUniversThematiques = async (_req: Request, res: Response) => {
  try {
        const univers = await prisma.universThematique.findMany({
          select: { id: true, name: true },
          orderBy: { id: "asc" },
        });

        const cleaned = univers
          .map((u) => ({ ...u, name: u.name.trim() }))
          .filter((u) => u.name.length > 0 && u.name.toLowerCase() !== "tous");

        res.json(cleaned);
    } catch (error) {
    console.error("Erreur getUniversThematiques:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};