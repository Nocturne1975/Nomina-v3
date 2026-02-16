import { Router } from 'express';
import {getNomPersonnages, getNomPersonnageById, createNomPersonnage, updateNomPersonnage, deleteNomPersonnage, totalNomPersonnage} from '../controllers/NomPersonnageController';

const router = Router();

router.get('/', getNomPersonnages);
// Important: définir /total avant /:id sinon "total" sera capturé par le paramètre :id
router.get('/total', totalNomPersonnage);
router.get('/:id', getNomPersonnageById);
router.post('/', createNomPersonnage);
router.put('/:id', updateNomPersonnage);
router.delete('/:id', deleteNomPersonnage);

export default router;