import { Response } from "express";
import pool from "../config/db";
import { AuthedRequest } from "../middleware/auth";

// Institutional memory preservation: short prompts sent to senior staff
// to capture unwritten "tribal knowledge" before they offboard. A response
// can be linked to a graph node so it becomes searchable institutional memory.
export async function listSurveys(req: AuthedRequest, res: Response) {
  const [rows]: any = await pool.query(
    `SELECT s.*, u.name AS target_name, r.response_text, r.linked_node_id
     FROM surveys s
     JOIN users u ON u.id = s.target_user_id
     LEFT JOIN survey_responses r ON r.survey_id = s.id
     WHERE s.target_user_id = ? OR ? IN ('admin','manager')
     ORDER BY s.created_at DESC`,
    [req.user!.id, req.user!.role]
  );
  res.json(rows);
}

export async function createSurvey(req: AuthedRequest, res: Response) {
  const { prompt, target_user_id } = req.body;
  if (!prompt || !target_user_id) {
    return res.status(400).json({ error: "prompt and target_user_id are required" });
  }
  const [result]: any = await pool.query(
    "INSERT INTO surveys (prompt, target_user_id) VALUES (?, ?)",
    [prompt, target_user_id]
  );
  res.status(201).json({ id: result.insertId });
}

export async function respondToSurvey(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const { response_text, linked_node_id } = req.body;
  if (!response_text) return res.status(400).json({ error: "response_text is required" });
  await pool.query(
    "INSERT INTO survey_responses (survey_id, response_text, linked_node_id) VALUES (?, ?, ?)",
    [id, response_text, linked_node_id || null]
  );
  await pool.query("UPDATE surveys SET status = 'answered' WHERE id = ?", [id]);
  res.status(201).json({ success: true });
}
