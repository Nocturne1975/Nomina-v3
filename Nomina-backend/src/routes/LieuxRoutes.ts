import { Router } from 'express';
import {getLieux, getLieuById, createLieu, updateLieu, deleteLieu, totalLieux} from '../controllers/LieuxController';
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get('/', getLieux);
// Définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', totalLieux);
router.get('/:id', getLieuById);
router.post('/', requireAuth, requireAdmin, createLieu);
router.put('/:id', requireAuth, requireAdmin, updateLieu);
router.delete('/:id', requireAuth, requireAdmin, deleteLieu);

export default router;