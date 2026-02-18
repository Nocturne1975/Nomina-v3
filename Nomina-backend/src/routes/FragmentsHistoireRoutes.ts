import { Router } from 'express';
import {getFragmentsHistoire, getFragmentHistoireById, createFragmentHistoire, updateFragmentHistoire, deleteFragmentHistoire, totalFragmentsHistoire,} from '../controllers/FragmentsHistoireController';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getFragmentsHistoire);
// définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', totalFragmentsHistoire);
router.get('/:id', getFragmentHistoireById);
router.post('/', requireAuth, requireAdmin, createFragmentHistoire);
router.put('/:id', requireAuth, requireAdmin, updateFragmentHistoire);
router.delete('/:id', requireAuth, requireAdmin, deleteFragmentHistoire);

export default router;