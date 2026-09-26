import { Response } from "express";
import pool from "../config/db";
import { AuthedRequest } from "../middleware/auth";

export async function createEdge(req: AuthedRequest, res: Response) {
  const { source_node_id, target_node_id, relation_type } = req.body;
  if (!source_node_id || !target_node_id) {
    return res.status(400).json({ error: "source_node_id and target_node_id are required" });
  }
  const [result]: any = await pool.query(
    "INSERT INTO edges (source_node_id, target_node_id, relation_type) VALUES (?, ?, ?)",
    [source_node_id, target_node_id, relation_type || "related_to"]
  );
  res.status(201).json({ id: result.insertId });
}

export async function deleteEdge(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  await pool.query("DELETE FROM edges WHERE id = ?", [id]);
  res.json({ success: true });
}
