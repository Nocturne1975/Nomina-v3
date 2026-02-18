import type { Request, Response } from 'express';

const getAdminUserIds = (): string[] => {
    const csv = process.env.ADMIN_CLERK_USER_IDS;
    if (csv && csv.trim().length > 0) {
        return csv
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }

    const single = process.env.ADMIN_CLERK_USER_ID;
    return single && single.trim().length > 0 ? [single.trim()] : [];
};

export const meController = (req: Request, res: Response) => {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });

    const adminUserIds = getAdminUserIds();
    const isAdmin = adminUserIds.includes(userId);
    return res.json({ userId, isAdmin });
};

export const adminPingController = (_req: Request, res: Response) => {
    return res.json({ ok: true });
};