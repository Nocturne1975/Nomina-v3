import { Router } from 'express';
import {getFragmentsHistoire, getFragmentHistoireById, createFragmentHistoire, updateFragmentHistoire, deleteFragmentHistoire, totalFragmentsHistoire,} from '../controllers/FragmentsHistoireController';

const router = Router();

router.get('/', getFragmentsHistoire);
// définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', totalFragmentsHistoire);
router.get('/:id', getFragmentHistoireById);
router.post('/', createFragmentHistoire);
router.put('/:id', updateFragmentHistoire);
router.delete('/:id', deleteFragmentHistoire);

export default router;