import type { Request, Response } from 'express';

export const meController = (req: Request, res: Response) => {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });

    const isAdmin = Boolean(process.env.ADMIN_CLERK_USER_ID) && userId === process.env.ADMIN_CLERK_USER_ID;
    return res.json({ userId, isAdmin });
};

export const adminPingController = (_req: Request, res: Response) => {
    return res.json({ ok: true });
};