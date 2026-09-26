import { Response } from "express";
import pool from "../config/db";
import { AuthedRequest } from "../middleware/auth";

export async function listNodes(_req: AuthedRequest, res: Response) {
  const [nodes]: any = await pool.query(
    `SELECT n.*, u.name AS owner_name FROM nodes n LEFT JOIN users u ON u.id = n.owner_id ORDER BY n.created_at DESC`
  );
  const [edges]: any = await pool.query("SELECT * FROM edges");
  res.json({ nodes, edges });
}

export async function getNode(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const [rows]: any = await pool.query(
    `SELECT n.*, u.name AS owner_name FROM nodes n LEFT JOIN users u ON u.id = n.owner_id WHERE n.id = ?`,
    [id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Node not found" });

  const [related]: any = await pool.query(
    `SELECT n.*, e.relation_type, e.source_node_id, e.target_node_id
     FROM edges e
     JOIN nodes n ON n.id = (CASE WHEN e.source_node_id = ? THEN e.target_node_id ELSE e.source_node_id END)
     WHERE e.source_node_id = ? OR e.target_node_id = ?`,
    [id, id, id]
  );
  const [experts]: any = await pool.query(
    `SELECT u.id, u.name, u.department, x.level FROM expertise x JOIN users u ON u.id = x.user_id WHERE x.node_id = ? ORDER BY x.level DESC`,
    [id]
  );
  res.json({ node: rows[0], related, experts });
}

export async function createNode(req: AuthedRequest, res: Response) {
  const { type, title, description, status, owner_id } = req.body;
  if (!type || !title) return res.status(400).json({ error: "type and title are required" });
  const [result]: any = await pool.query(
    "INSERT INTO nodes (type, title, description, status, owner_id) VALUES (?, ?, ?, ?, ?)",
    [type, title, description || null, status || "active", owner_id || req.user!.id]
  );
  res.status(201).json({ id: result.insertId });
}

export async function updateNode(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const { title, description, status, owner_id } = req.body;
  await pool.query(
    "UPDATE nodes SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status), owner_id = COALESCE(?, owner_id) WHERE id = ?",
    [title, description, status, owner_id, id]
  );
  res.json({ success: true });
}

export async function deleteNode(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  await pool.query("DELETE FROM nodes WHERE id = ?", [id]);
  res.json({ success: true });
}
