import { Router } from 'express';
import {
  getCreatures,
  getCreatureById,
  createCreature,
  updateCreature,
  deleteCreature,
  totalCreatures,
} from '../controllers/CreatureController';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCreatures);
router.get('/total', totalCreatures);
router.get('/:id', getCreatureById);
router.post('/', requireAuth, requireAdmin, createCreature);
router.put('/:id', requireAuth, requireAdmin, updateCreature);
router.delete('/:id', requireAuth, requireAdmin, deleteCreature);

export default router;
