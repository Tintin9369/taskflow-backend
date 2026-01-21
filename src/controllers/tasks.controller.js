import { getAllTasksService } from "../services/tasks.service.js";
import { getParticipantsByTaskIdService } from "../services/tasks.service.js";

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
    res.status(500).json({ message: "Failed request"});
  }
}
