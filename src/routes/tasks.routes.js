import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getAllTasks } from "../controllers/tasks.controller.js";
import { getParticipants } from "../controllers/tasks.controller.js";
import { createNewTask } from "../controllers/tasks.controller.js";
import { updateTask } from "../controllers/tasks.controller.js"
import { deleteTask } from "../controllers/tasks.controller.js"


const router = Router();

router.get("/", auth, getAllTasks);
router.get("/:taskId/participants", auth, getParticipants);
router.post("/newTask", auth, createNewTask);
router.put("/:taskId", auth, updateTask);
router.delete("/:taskId", auth, deleteTask);

export default router;
