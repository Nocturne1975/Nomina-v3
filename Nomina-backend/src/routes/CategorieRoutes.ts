import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";
import {
  getCategories,
  getCategorieById,
  createCategorie,
  updateCategorie,
  deleteCategorie,
  totalCategorie,
} from "../controllers/CategorieController";

const router = Router();

router.get("/total", totalCategorie);
router.get("/", getCategories);
router.get("/:id", getCategorieById);
router.post("/", requireAuth, requireAdmin, createCategorie);
router.put("/:id", requireAuth, requireAdmin, updateCategorie);
router.delete("/:id", requireAuth, requireAdmin, deleteCategorie);

export default router;
