import { Router } from 'express';
import {getNomPersonnages, getNomPersonnageById, createNomPersonnage, updateNomPersonnage, deleteNomPersonnage, totalNomPersonnage} from '../controllers/NomPersonnageController';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getNomPersonnages);
// Important: définir /total avant /:id sinon "total" sera capturé par le paramètre :id
router.get('/total', totalNomPersonnage);
router.get('/:id', getNomPersonnageById);
router.post('/', requireAuth, requireAdmin, createNomPersonnage);
router.put('/:id', requireAuth, requireAdmin, updateNomPersonnage);
router.delete('/:id', requireAuth, requireAdmin, deleteNomPersonnage);

export default router;