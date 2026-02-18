import { Router } from "express";
import {
  generateNpcs,
  generateNomPersonnages,
  generateNomFamille,
  generateLieux,
  generateFragmentsHistoire,
  generateTitres,
  generateConcepts,
} from "../controllers/GenerateController";

const router = Router();

router.get("/npcs", generateNpcs);
router.get("/nom-personnages", generateNomPersonnages);
router.get("/prenoms", generateNomPersonnages);
router.get("/nom-famille", generateNomFamille);
router.get("/lieux", generateLieux);
router.get("/fragments-histoire", generateFragmentsHistoire);
router.get("/titres", generateTitres);
router.get("/concepts", generateConcepts);

export default router;