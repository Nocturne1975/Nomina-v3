import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';

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

const extractBearerToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = extractBearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authorization manquante' });

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    console.error('CLERK_SECRET_KEY non défini');
    return res.status(500).json({
      error:
        'Configuration serveur manquante: CLERK_SECRET_KEY non défini (configure Nomina-backend/.env puis redémarre le serveur)',
    });
  }

  try {
    const { payload } = await verifyToken(token, { secretKey });
    const p = payload as { sub?: unknown; sid?: unknown };
    const userId = typeof p.sub === 'string' ? p.sub : null;
    if (!userId) return res.status(401).json({ error: 'Token invalide' });

    req.auth = {
      userId,
      sessionId: typeof p.sid === 'string' ? p.sid : undefined,
    };
    next();
  } catch (err) {
    console.error('Clerk token verification failed:', err);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const adminUserIds = getAdminUserIds();
  if (adminUserIds.length === 0) {
    return res
      .status(500)
      .json({ error: 'ADMIN_CLERK_USER_IDS (ou ADMIN_CLERK_USER_ID) non défini' });
  }

  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ error: 'Non authentifié' });
  if (!adminUserIds.includes(userId)) return res.status(403).json({ error: 'Accès refusé' });

  next();
};