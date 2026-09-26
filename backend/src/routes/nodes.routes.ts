import { Router } from "express";
import { listNodes, getNode, createNode, updateNode, deleteNode } from "../controllers/nodesController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/", listNodes);
router.get("/:id", getNode);
router.post("/", createNode);
router.put("/:id", updateNode);
router.delete("/:id", deleteNode);

export default router;
