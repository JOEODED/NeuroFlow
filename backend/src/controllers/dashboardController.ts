import { Response } from "express";
import pool from "../config/db";
import { AuthedRequest } from "../middleware/auth";

export async function dashboard(_req: AuthedRequest, res: Response) {
  const [[nodeCounts]]: any = await pool.query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'active') AS active,
       SUM(status = 'dormant') AS dormant,
       SUM(status = 'gap') AS knowledge_gaps
     FROM nodes`
  );
  const [[trailCounts]]: any = await pool.query(
    `SELECT
       COUNT(*) AS total_assignments,
       SUM(status = 'completed') AS completed,
       SUM(status = 'in_progress') AS in_progress,
       SUM(status = 'not_started') AS not_started
     FROM trail_assignments`
  );
  const [[surveyCounts]]: any = await pool.query(
    `SELECT COUNT(*) AS pending FROM surveys WHERE status = 'pending'`
  );
  const [recentNodes]: any = await pool.query(
    `SELECT id, title, type, status, updated_at FROM nodes ORDER BY updated_at DESC LIMIT 8`
  );

  res.json({ nodeCounts, trailCounts, pendingSurveys: surveyCounts.pending, recentNodes });
}
