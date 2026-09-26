import { Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db";
import { signToken } from "../utils/jwt";
import { AuthedRequest } from "../middleware/auth";

export async function register(req: AuthedRequest, res: Response) {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  const [existing]: any = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    return res.status(400).json({ error: "That email is already registered" });
  }
  const hash = await bcrypt.hash(password, 10);
  const [result]: any = await pool.query(
    "INSERT INTO users (name, email, password_hash, role, department) VALUES (?, ?, ?, ?, ?)",
    [name, email, hash, role || "employee", department || null]
  );
  const token = signToken({ id: result.insertId, role: role || "employee", name });
  res.status(201).json({ token, user: { id: result.insertId, name, email, role: role || "employee" } });
}

export async function login(req: AuthedRequest, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = signToken({ id: user.id, role: user.role, name: user.name });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, is_senior: !!user.is_senior },
  });
}

export async function me(req: AuthedRequest, res: Response) {
  const [rows]: any = await pool.query(
    "SELECT id, name, email, role, department, is_senior FROM users WHERE id = ?",
    [req.user!.id]
  );
  res.json(rows[0] || null);
}
