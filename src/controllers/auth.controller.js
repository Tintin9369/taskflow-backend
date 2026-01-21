import jwt from "jsonwebtoken";
import { verifyUserCredentials } from "../services/auth.service.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await verifyUserCredentials(email, password);

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });

  } catch (error) {
    res.status(401).json({ error: "Invalid credentials" });
  }
}
