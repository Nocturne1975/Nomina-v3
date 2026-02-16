import type { Request, Response } from 'express';
import prisma from '../utils/prisma'

// const prisma = new PrismaClient();

//  GET - tous les users de ma base de donnees
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET - un user par son id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST - creer un nouveau user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, role, password } = req.body;
    const newUser = await prisma.user.create({
      data: { username, email, role, password },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// PUT - modifier un user par son id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { username, email, role },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE - supprimer un user par son
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Aggregation - obtenir le nombre total de users
export const totalUser = async (req: Request, res: Response) => {
  try{
    const count = await prisma.user.count();
    res.json({ total: count });
  } catch(error){
    res.status(500).json({message: 'Erreur serveur'})
  }
}