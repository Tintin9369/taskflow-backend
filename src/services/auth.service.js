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

  console.log("Email reçu: ", email);
  console.log("password reçu: ", password);
  console.log("User trouvé: ", rows);
  
  

  if (rows.length === 0) {
    throw new Error("User not found");
  }

  const user = rows[0];

  console.log("Password en clair: ", password);
  console.log("Hash BDD: ", user.password_hash);
  
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if(!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return {
    id: user.id,
    email: user.email
  };
}
