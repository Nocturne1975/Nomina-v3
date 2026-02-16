import { Router } from "express";
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
router.post("/", createCulture);
router.put("/:id", updateCulture);
router.delete("/:id", deleteCulture);

export default router;