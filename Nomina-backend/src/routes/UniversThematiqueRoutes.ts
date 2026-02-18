import { Router } from "express";
import {
	getUniversThematiques,
	getUniversThematiquesAdmin,
	getUniversThematiqueById,
	createUniversThematique,
	updateUniversThematique,
	deleteUniversThematique,
} from "../controllers/UniversThematiqueController";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/", getUniversThematiques);
router.get("/all", getUniversThematiquesAdmin);
router.get("/:id", getUniversThematiqueById);

router.post("/", requireAuth, requireAdmin, createUniversThematique);
router.put("/:id", requireAuth, requireAdmin, updateUniversThematique);
router.delete("/:id", requireAuth, requireAdmin, deleteUniversThematique);

export default router;