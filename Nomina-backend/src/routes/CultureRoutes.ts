import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";
import {
  getCultures,
  getCultureById,
  createCulture,
  updateCulture,
  deleteCulture,
  totalCulture,
} from "../controllers/CultureController";

const router = Router();

router.get("/total", totalCulture);
router.get("/", getCultures);
router.get("/:id", getCultureById);
// CRUD admin: écritures protégées
router.post("/", requireAuth, requireAdmin, createCulture);
router.put("/:id", requireAuth, requireAdmin, updateCulture);
router.delete("/:id", requireAuth, requireAdmin, deleteCulture);

export default router;