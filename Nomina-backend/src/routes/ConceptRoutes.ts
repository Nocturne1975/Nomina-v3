import { Router } from 'express';
import {getConcepts, getConceptById, createConcept, updateConcept, deleteConcept, totalConcepts} from '../controllers/ConceptController';

const router = Router();

router.get('/', getConcepts);
// définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', totalConcepts);
router.get('/:id', getConceptById);
router.post('/', createConcept);
router.put('/:id', updateConcept);
router.delete('/:id', deleteConcept);

export default router;