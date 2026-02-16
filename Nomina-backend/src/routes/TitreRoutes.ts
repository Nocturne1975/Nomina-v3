import { Router } from 'express';
import {getTitres, getTitreById, createTitre, updateTitre, deleteTitre, totalTitres} from '../controllers/TitreController';

const router = Router();

router.get('/', getTitres);
// définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', totalTitres);
router.get('/:id', getTitreById);
router.post('/', createTitre);
router.put('/:id', updateTitre);
router.delete('/:id', deleteTitre);

export default router;