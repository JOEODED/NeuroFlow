import { Router } from "express";
import { createEdge, deleteEdge } from "../controllers/edgesController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.post("/", createEdge);
router.delete("/:id", deleteEdge);

export default router;
