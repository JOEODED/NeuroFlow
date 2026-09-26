import { Router } from "express";
import { listSurveys, createSurvey, respondToSurvey } from "../controllers/surveysController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/", listSurveys);
router.post("/", createSurvey);
router.post("/:id/respond", respondToSurvey);

export default router;
