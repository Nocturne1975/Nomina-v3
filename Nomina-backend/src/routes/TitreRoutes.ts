import { Router } from 'express';
import {getTitres, getTitreById, createTitre, updateTitre, deleteTitre, totalTitres} from '../controllers/TitreController';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getTitres);
// définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', totalTitres);
router.get('/:id', getTitreById);
router.post('/', requireAuth, requireAdmin, createTitre);
router.put('/:id', requireAuth, requireAdmin, updateTitre);
router.delete('/:id', requireAuth, requireAdmin, deleteTitre);

export default router;