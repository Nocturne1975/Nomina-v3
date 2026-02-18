import { Router } from "express";
import {
  createNomFamille,
  deleteNomFamille,
  getNomFamilleById,
  getNomFamilles,
  totalNomFamille,
  updateNomFamille,
} from "../controllers/NomFamilleController";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getNomFamilles);
router.get("/total", totalNomFamille);
router.get("/:id", getNomFamilleById);

router.post("/", requireAuth, requireAdmin, createNomFamille);
router.put("/:id", requireAuth, requireAdmin, updateNomFamille);
router.delete("/:id", requireAuth, requireAdmin, deleteNomFamille);

export default router;
