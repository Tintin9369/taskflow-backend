import bcrypt from "bcrypt";
import { db } from "../database/connection.js";

async function seed() {
  await db.execute("DELETE FROM task_users");
  await db.execute("DELETE FROM tasks");
  await db.execute("DELETE FROM users");

  const hash = await bcrypt.hash("passwordDeTest", 10);
  await db.execute(
    `INSERT INTO users (id, email, password_hash)
        VALUES (?, ?, ?)`,
    [1, "outsider@test.com", hash],
  );

  const hash1 = await bcrypt.hash("passwordDeTest1", 10);
  await db.execute(
    `INSERT INTO users (id, email, password_hash)
        VALUES (?, ?, ?)`,
    [2, "admin@test.com", hash1],
  );

  const hash2 = await bcrypt.hash("passwordDeTest2", 10);
  await db.execute(
    `INSERT INTO users (id, email, password_hash)
        VALUES (?, ?, ?)`,
    [3, "user@test.com", hash2],
  );
// ////////////////////////////////////////////////////
  await db.execute(
    `INSERT INTO tasks (id, title, is_done, creator_id)
        VALUES(?, ?, ?, ?)`,
    [1, "faire un compte rendu", false, 1]);

    await db.execute(
    `INSERT INTO tasks (id, title, is_done, creator_id)
        VALUES(?, ?, ?, ?)`,
    [2, "appeler le comptable", false, 2]);

    await db.execute(
    `INSERT INTO tasks (id, title, is_done, creator_id)
        VALUES(?, ?, ?, ?)`,
    [3, "creer une maquette Figma", true, 1]);

    await db.execute(
    `INSERT INTO tasks (id, title, is_done, creator_id)
        VALUES(?, ?, ?, ?)`,
    [4, "faire un point projet avec le client", true, 3]);
// ////////////////////////////////////////////////////
  await db.execute(
    `INSERT INTO task_users (user_id, task_id, role)
VALUES(?, ?, ?)`,
    [1, 1, "admin"]);

    await db.execute(
    `INSERT INTO task_users (user_id, task_id, role)
VALUES(?, ?, ?)`,
    [2, 1, "participant"]);

    await db.execute(
    `INSERT INTO task_users (user_id, task_id, role)
VALUES(?, ?, ?)`,
    [2, 2, "admin"]);

    await db.execute(
    `INSERT INTO task_users (user_id, task_id, role)
VALUES(?, ?, ?)`,
    [1, 3, "admin"]);

    await db.execute(
    `INSERT INTO task_users (user_id, task_id, role)
VALUES(?, ?, ?)`,
    [3, 4, "admin"]);

    await db.execute(
    `INSERT INTO task_users (user_id, task_id, role)
VALUES(?, ?, ?)`,
    [2, 4, "participant"]);

  console.log("Seed terminé ✅");
  process.exit();
}

seed();
