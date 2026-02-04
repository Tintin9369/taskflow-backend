import { db } from "../database/connection.js";

///////  LISTER TOUTES LES TASKS EN COURS  /////////////
export async function getAllTasksService() {
  const [rows] = await db.execute(`
        SELECT tasks.id AS taskId, tasks.title, tasks.description, tasks.is_done, tasks.created_at AS createdAt, users.id AS creatorId, users.email AS creatorEmail
        FROM tasks 
        INNER JOIN users
        ON tasks.creator_id = users.id`);
  return rows;
}

///// CONNAÎTRE LA LISTE DES PARTICIPANTS D'UNE TASK //////////
export async function getParticipantsByTaskIdService(taskId) {
  const [taskExist] = await db.execute(
    `   SELECT tasks.id
        FROM tasks
        WHERE tasks.id = ?`,
    [taskId],
  );

  if (taskExist.length === 0) {
    throw new Error("TASK NOT FOUND");
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

//////////// CREATION D'UNE NOUVELLE TASK //////////
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

//////////// MODIFICATION D'UNE TASK PAR ID  ////////
export async function updateTaskById(
  userId,
  taskId,
  title,
  description,
  is_done,
) {
  //vérifier que la Task existe en BDD
  const [taskRows] = await db.execute(
    `
  SELECT id
  FROM tasks
  WHERE id = ?
  `,
    [taskId],
  );

  if (taskRows.length === 0) {
    throw new Error("TASK NOT FOUND");
  }

  // vérifier que le User connecté a bien le role admin de la Task
  const [roleRows] = await db.execute(
    `
      SELECT role
      FROM task_users
      WHERE task_id = ?
      AND user_id = ?
      AND role = 'admin'
    `,
    [taskId, userId],
  );

  if (roleRows.length === 0) {
    throw new Error("FORBIDDEN");
  }

  // Mettre à jour la Task
  await db.execute(
    `
    UPDATE tasks
    SET title = ?, description = ?, is_done = ?
    WHERE id = ?
    `,
    [title, description, is_done, taskId],
  );

  const [updatedTask] = await db.execute(
    `
    SELECT id, title, description, is_done, creator_id
    FROM tasks
    WHERE id = ?
  `,
    [taskId],
  );

  return updatedTask[0];
}

//////////// SUPPRESSION D'UNE TASK PAR ID  ////////
export async function deleteTaskById(userId, taskId) {
  // Vérifier que le taskId est un nombre
  if (isNaN(taskId)) {
    throw new Error("INVALID TASK ID");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Vérifier que la Task existe
    const [taskExists] = await connection.execute(
      `
    SELECT id
    FROM tasks
    WHERE id = ?    
    `,
      [taskId]
    );

    if (taskExists.length === 0) {
      throw new Error("TASK NOT FOUND");
    }

    // Vérifier que le User est Admin de la Task
    const [taskAdmin] = await connection.execute(
      `
  SELECT role
  FROM task_users
  WHERE user_id = ?
  AND task_id = ?
  AND role = 'admin'
  `,
      [userId, taskId]
    );

    if (taskAdmin.length === 0) {
      throw new Error("FORBIDDEN");
    }

    // Suppression de la Task
    await connection.execute(
      `
      DELETE FROM tasks
      WHERE id = ?    
    `,
      [taskId]
    );
    await connection.commit();
    return { taskId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
