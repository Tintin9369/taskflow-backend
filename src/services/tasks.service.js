import { db } from '../database/connection.js'

export async function getAllTasksService() {
    const [rows] = await db.execute(`
        SELECT tasks.id AS taskId, tasks.title, tasks.description, tasks.is_done, tasks.created_at AS createdAt, users.id AS creatorId, users.email AS creatorEmail
        FROM tasks 
        INNER JOIN users
        ON tasks.creator_id = users.id`
    );
    return rows;
}

export async function getParticipantsByTaskIdService(taskId) {
    const [participants] = await db.execute(`
        SELECT users.id, users.email, task_users.role
        FROM task_users 
        INNER JOIN users ON task_users.user_id = users.id
        WHERE task_users.task_id = ?`,
        [taskId]
    );
    return participants;
}
