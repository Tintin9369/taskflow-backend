import { db } from "../database/connection.js";

export async function isParticipant(req, res, next) {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  try {
    const [rows] = await db.execute(
      `SELECT 1 
       FROM task_users
       WHERE (user_id = ?)  AND (task_id = ?)
       LIMIT 1`,
      [userId, taskId]
    );

    if (rows.length === 0) {
      return res.status(403).send({ error: "Forbidden" });
    }
    next();
  } catch (error) {
    console.error(error);    
    res.status(500).send({ error: "Internal Server Error" });
  }
}
