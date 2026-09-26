import { Router } from "express";
import { route, addExpertise } from "../controllers/expertiseController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/route", route);
router.post("/", addExpertise);

export default router;
