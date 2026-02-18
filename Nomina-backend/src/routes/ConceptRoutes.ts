import { Router } from 'express';
import {getConcepts, getConceptById, createConcept, updateConcept, deleteConcept, totalConcepts} from '../controllers/ConceptController';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getConcepts);
// définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', totalConcepts);
router.get('/:id', getConceptById);
router.post('/', requireAuth, requireAdmin, createConcept);
router.put('/:id', requireAuth, requireAdmin, updateConcept);
router.delete('/:id', requireAuth, requireAdmin, deleteConcept);

export default router;