import { Router } from "express";
import { getUniversThematiques } from "../controllers/UniversThematiqueController";

const router = Router();
router.get("/", getUniversThematiques);

export default router;