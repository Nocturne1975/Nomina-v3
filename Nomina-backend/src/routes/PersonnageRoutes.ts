import { Router } from 'express';
import { getPersonnages, getPersonnageById, totalPersonnages } from '../controllers/PersonnageController';

const router = Router();

router.get('/', getPersonnages);
router.get('/total', totalPersonnages);
router.get('/:id', getPersonnageById);

export default router;
