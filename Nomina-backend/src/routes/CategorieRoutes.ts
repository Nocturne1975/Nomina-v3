import { Router } from "express";
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
router.post("/", createCategorie);
router.put("/:id", updateCategorie);
router.delete("/:id", deleteCategorie);

export default router;
