import { getAllTasksService } from "../services/tasks.service.js";
import { getParticipantsByTaskIdService } from "../services/tasks.service.js";
import { createTaskService } from "../services/tasks.service.js";
import { updateTaskById } from "../services/tasks.service.js";
import { deleteTaskById } from "../services/tasks.service.js";

///////  LISTER TOUTES LES TASKS EN COURS  /////////////
export async function getAllTasks(req, res) {
  try {
    const tasks = await getAllTasksService();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed request" });
  }
}

///// CONNAÎTRE LA LISTE DES PARTICIPANTS D'UNE TASK //////////
export async function getParticipants(req, res) {
  const { taskId } = req.params;

  try {
    const participants = await getParticipantsByTaskIdService(taskId);
    res.status(200).json(participants);
  } catch (error) {
    if (error.message === "TASK_NOT_FOUND") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: "Failed request" });
  }
}

//////////// CREATION D'UNE NOUVELLE TASK //////////
export async function createNewTask(req, res) {
  const { title, description } = req.body;
  const { id: userId } = req.user;

  console.log("USER FROM TOKEN 👉", req.user);

  if (!title || !description) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const newTask = await createTaskService(title, description, userId);
    return res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Failed request" });
  }
}

//////////// MODIFICATION D'UNE TASK PAR ID  ////////
export async function updateTask(req, res) {
  const { id: userId } = req.user;
  const { taskId } = req.params;
  const { title, description, is_done } = req.body;

  try {
    const updatedTask = await updateTaskById(
      userId,
      taskId,
      title,
      description,
      is_done,
    );

    return res.status(200).json(updatedTask);
  } catch (error) {
    if (error.message === "TASK NOT FOUND") {
      return res.status(404).json({ message: "Task not found" });
    }
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    console.error(error);
    res.status(500).json({ message: "Failed request" });
  }
}

//////////// SUPPRESSION D'UNE TASK PAR ID  ////////
export async function deleteTask(req, res) {
  const { userId } = req.user.id;
  const { taskId } = req.params;

  console.log("REQ.PARAMS =", req.params);
  console.log("REQ.USER  =", req.user);

  console.log("userId =", userId);
  console.log("taskId =", taskId);

  try {
    await deleteTaskById(userId, taskId);

    return res.status(200).json({ message: "Task supprimée :" });
  } catch (error) {
    if (error.message === "TASK NOT FOUND") {
      return res.status(404).json({ message: "Task not found" });
    }
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Pas Admin: Forbidden" });
    }
    if (error.message === "INVALID TASK ID") {
      return res.status(400).json({ message: "Invalid TaskId" });
    }
    console.error(error);
    res.status(500).json({ message: "Failed request" });
  }
}
