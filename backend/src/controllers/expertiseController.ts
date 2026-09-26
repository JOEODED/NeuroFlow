import { Response } from "express";
import pool from "../config/db";
import { AuthedRequest } from "../middleware/auth";

// Preemptive expertise routing: given a node (the blocker / topic),
// find people linked to that node or its direct neighbors, ranked by
// expertise level, so a stuck employee knows exactly who to ask.
export async function route(req: AuthedRequest, res: Response) {
  const { nodeId } = req.query;
  if (!nodeId) return res.status(400).json({ error: "nodeId is required" });

  const [direct]: any = await pool.query(
    `SELECT u.id, u.name, u.email, u.department, x.level, n.title AS node_title, 1 AS hops
     FROM expertise x
     JOIN users u ON u.id = x.user_id
     JOIN nodes n ON n.id = x.node_id
     WHERE x.node_id = ?`,
    [nodeId]
  );

  const [neighbors]: any = await pool.query(
    `SELECT u.id, u.name, u.email, u.department, x.level, n.title AS node_title, 2 AS hops
     FROM edges e
     JOIN expertise x ON x.node_id = (CASE WHEN e.source_node_id = ? THEN e.target_node_id ELSE e.source_node_id END)
     JOIN users u ON u.id = x.user_id
     JOIN nodes n ON n.id = x.node_id
     WHERE (e.source_node_id = ? OR e.target_node_id = ?)`,
    [nodeId, nodeId, nodeId]
  );

  const combined = [...direct, ...neighbors].sort((a, b) => {
    if (a.hops !== b.hops) return a.hops - b.hops;
    if (a.level === b.level) return 0;
    return a.level === "expert" ? -1 : 1;
  });

  // De-duplicate, keeping the best (closest, highest-level) match per person
  const seen = new Set<number>();
  const ranked = combined.filter((row: any) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });

  res.json({ matches: ranked });
}

export async function addExpertise(req: AuthedRequest, res: Response) {
  const { user_id, node_id, level } = req.body;
  if (!user_id || !node_id) return res.status(400).json({ error: "user_id and node_id are required" });
  await pool.query(
    `INSERT INTO expertise (user_id, node_id, level) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE level = VALUES(level)`,
    [user_id, node_id, level || "contributor"]
  );
  res.status(201).json({ success: true });
}
