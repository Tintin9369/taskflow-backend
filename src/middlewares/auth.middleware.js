import jwt from "jsonwebtoken";


export function auth(req, res, next) {
  const header = req.headers["authorization"];
  const string_format = "Bearer ";

  if (!header || !header.startsWith(string_format)) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  console.log("le header est au bon format");
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }
}
