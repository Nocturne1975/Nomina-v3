import { Router } from 'express';
import {getLieux, getLieuById, createLieu, updateLieu, deleteLieu, totalLieux} from '../controllers/LieuxController';

const router = Router();

router.get('/', getLieux);
// Définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', totalLieux);
router.get('/:id', getLieuById);
router.post('/', createLieu);
router.put('/:id', updateLieu);
router.delete('/:id', deleteLieu);

export default router;