import express from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { db } from "../data.js";
import { signToken } from "../middleware/auth.js";

export const authRouter = express.Router();

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

authRouter.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["student", "admin", "vendor"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const existing = db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  const user = {
    id: uuidv4(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
  };

  db.users.push(user);

  return res.status(201).json({
    token: signToken(user),
    user: sanitizeUser(user),
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((entry) => entry.email.toLowerCase() === email?.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.json({
    token: signToken(user),
    user: sanitizeUser(user),
  });
});
