import { db } from "../database/connection.js";

export async function getAllTasksService() {
  const [rows] = await db.execute(`
        SELECT tasks.id AS taskId, tasks.title, tasks.description, tasks.is_done, tasks.created_at AS createdAt, users.id AS creatorId, users.email AS creatorEmail
        FROM tasks 
        INNER JOIN users
        ON tasks.creator_id = users.id`);
  return rows;
}

export async function getParticipantsByTaskIdService(taskId) {
  const [taskExist] = await db.execute(
    `   SELECT tasks.id
        FROM tasks
        WHERE tasks.id = ?`,
    [taskId],
  );

  if (taskExist.length === 0) {
    throw new Error("TASK_NOT_FOUND");
  } else {
    const [participants] = await db.execute(
      `
        SELECT users.id, users.email, task_users.role
        FROM task_users 
        INNER JOIN users ON task_users.user_id = users.id
        WHERE task_users.task_id = ?`,
      [taskId],
    );

    return participants;
  }
}

export async function createTaskService(title, description, userId) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Insert newTask into Tasks
    const [result] = await connection.execute(
      `
        INSERT INTO tasks (title, description, creator_id)
        VALUES(?, ?, ?)  `,
      [title, description, userId],
    );

    const taskId = result.insertId;

    await connection.execute(
      `
        INSERT INTO task_users (user_id, task_id, role)
        VALUES(?, ?, 'admin') `,
      [userId, taskId],
    );

    await connection.commit();

    return {
      id: taskId,
      title,
      description,
      creatorId: userId,
    };

  } catch (error) {
    console.error("Create Task Error: ", error);
    
    await connection.rollback();
    throw error;
  
  } finally {
    connection.release();
  }
}
