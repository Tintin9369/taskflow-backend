import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getAllTasks } from "../controllers/tasks.controller.js";
import { getParticipants } from "../controllers/tasks.controller.js";

const router = Router();

router.get("/", auth, getAllTasks);
router.get("/:taskId/participants", auth, getParticipants);
export default router;
