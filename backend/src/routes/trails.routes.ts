import { Router } from "express";
import {
  listTrails, createTrail, getTrail, assignTrail,
  myTrails, getAssignmentProgress, toggleStepProgress,
} from "../controllers/trailsController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/", listTrails);
router.post("/", createTrail);
router.get("/mine", myTrails);
router.get("/:id", getTrail);
router.post("/:id/assign", assignTrail);
router.get("/assignments/:id", getAssignmentProgress);
router.patch("/assignments/:id/steps/:stepId", toggleStepProgress);

export default router;
