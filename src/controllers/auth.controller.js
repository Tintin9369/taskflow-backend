import jwt from "jsonwebtoken";
import { verifyUserCredentials } from "../services/auth.service.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await verifyUserCredentials(email, password);

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
