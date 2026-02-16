import { Router } from 'express';
import { adminPingController, meController } from '../controllers/authControllers';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', requireAuth, meController);
router.get('/admin/ping', requireAuth, requireAdmin, adminPingController);

export default router;