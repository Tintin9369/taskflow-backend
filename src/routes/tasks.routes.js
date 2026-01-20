import { Router } from "express";
import { getAllTasks } from "../controllers/tasks.controller.js";
import { auth } from "../middlewares/auth.middleware.js";


const router = Router();

router.get("/", auth, getAllTasks);

export default router;
