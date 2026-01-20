import { getAllTasksService } from "../services/tasks.service.js";

export async function getAllTasks(req, res) {
  try {
    const tasks = await getAllTasksService();
    res.status(200).json(tasks);
    
  } catch (error) {
    res.status(500).json({ message: "Failed request"});
  }
}
