import { db } from "../database/connection.js";
import bcrypt from "bcrypt";

export async function verifyUserCredentials(email, password) {
  const [rows] = await db.execute(
    `
        SELECT id, email, password_hash 
        FROM users
        WHERE email = ?`,
    [email],
  );

  if (rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if(!isPasswordValid) {
    throw new Error("Invalid Credentials");
  }

  return {
    id: user.id,
    email: user.email
  };
}
