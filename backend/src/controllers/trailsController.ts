import { Response } from "express";
import pool from "../config/db";
import { AuthedRequest } from "../middleware/auth";

export async function listTrails(_req: AuthedRequest, res: Response) {
  const [trails]: any = await pool.query("SELECT * FROM onboarding_trails ORDER BY created_at DESC");
  res.json(trails);
}

export async function createTrail(req: AuthedRequest, res: Response) {
  const { role, title, description, steps } = req.body;
  if (!role || !title) return res.status(400).json({ error: "role and title are required" });
  const [result]: any = await pool.query(
    "INSERT INTO onboarding_trails (role, title, description, created_by) VALUES (?, ?, ?, ?)",
    [role, title, description || null, req.user!.id]
  );
  const trailId = result.insertId;
  if (Array.isArray(steps)) {
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      await pool.query(
        "INSERT INTO trail_steps (trail_id, node_id, step_order, title, notes) VALUES (?, ?, ?, ?, ?)",
        [trailId, s.node_id || null, i, s.title, s.notes || null]
      );
    }
  }
  res.status(201).json({ id: trailId });
}

export async function getTrail(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const [trailRows]: any = await pool.query("SELECT * FROM onboarding_trails WHERE id = ?", [id]);
  if (!trailRows[0]) return res.status(404).json({ error: "Trail not found" });
  const [steps]: any = await pool.query(
    "SELECT * FROM trail_steps WHERE trail_id = ? ORDER BY step_order ASC",
    [id]
  );
  res.json({ ...trailRows[0], steps });
}

export async function assignTrail(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id is required" });
  const [result]: any = await pool.query(
    "INSERT INTO trail_assignments (trail_id, user_id) VALUES (?, ?)",
    [id, user_id]
  );
  res.status(201).json({ id: result.insertId });
}

export async function myTrails(req: AuthedRequest, res: Response) {
  const [rows]: any = await pool.query(
    `SELECT a.id AS assignment_id, a.status, a.assigned_at, a.completed_at, t.id AS trail_id, t.title, t.role, t.description
     FROM trail_assignments a JOIN onboarding_trails t ON t.id = a.trail_id
     WHERE a.user_id = ? ORDER BY a.assigned_at DESC`,
    [req.user!.id]
  );
  res.json(rows);
}

export async function getAssignmentProgress(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const [assignmentRows]: any = await pool.query("SELECT * FROM trail_assignments WHERE id = ?", [id]);
  const assignment = assignmentRows[0];
  if (!assignment) return res.status(404).json({ error: "Assignment not found" });
  const [steps]: any = await pool.query(
    `SELECT s.*, COALESCE(p.completed, 0) AS completed
     FROM trail_steps s
     LEFT JOIN trail_step_progress p ON p.step_id = s.id AND p.assignment_id = ?
     WHERE s.trail_id = ? ORDER BY s.step_order ASC`,
    [id, assignment.trail_id]
  );
  res.json({ assignment, steps });
}

export async function toggleStepProgress(req: AuthedRequest, res: Response) {
  const { id, stepId } = req.params;
  const { completed } = req.body;
  await pool.query(
    `INSERT INTO trail_step_progress (assignment_id, step_id, completed, completed_at)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE completed = VALUES(completed), completed_at = VALUES(completed_at)`,
    [id, stepId, completed ? 1 : 0, completed ? new Date() : null]
  );

  const [remaining]: any = await pool.query(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN p.completed = 1 THEN 1 ELSE 0 END) AS done
     FROM trail_steps s
     LEFT JOIN trail_step_progress p ON p.step_id = s.id AND p.assignment_id = ?
     WHERE s.trail_id = (SELECT trail_id FROM trail_assignments WHERE id = ?)`,
    [id, id]
  );
  const { total, done } = remaining[0];
  const status = done == 0 ? "not_started" : done == total ? "completed" : "in_progress";
  await pool.query(
    "UPDATE trail_assignments SET status = ?, completed_at = ? WHERE id = ?",
    [status, status === "completed" ? new Date() : null, id]
  );
  res.json({ success: true, status });
}
