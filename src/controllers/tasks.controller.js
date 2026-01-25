import { getAllTasksService } from "../services/tasks.service.js";
import { getParticipantsByTaskIdService } from "../services/tasks.service.js";
import { createTaskService } from "../services/tasks.service.js";

export async function getAllTasks(req, res) {
  try {
    const tasks = await getAllTasksService();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed request" });
  }
}

export async function getParticipants(req, res) {

  const { taskId } = req.params;

  try {
    const participants = await getParticipantsByTaskIdService(taskId);
    res.status(200).json(participants);
  } catch (error) {
    if(error.message === "TASK_NOT_FOUND") {
      return res.status(404).json({ message: "Task not found" })
    }
    res.status(500).json({ message: "Failed request"});
  }
}

export async function createNewTask(req, res) {

  const { title, description } = req.body;
  const { id: userId } = req.user;

  console.log("USER FROM TOKEN 👉", req.user);

  if(!title || !description) {
    return res.status(400).json({ message: "Bad request"});
  }

  try {    
    const newTask = await createTaskService(title, description, userId);
    return res.status(201).json(newTask);
   
  } catch (error) {
    res.status(500).json({ message: "Failed request"});

  }
}

