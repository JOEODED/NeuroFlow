import { useEffect, useState } from "react";
import client from "../api/client";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";

export default function OnboardingTrails() {
  const { user } = useAuth();
  const [trails, setTrails] = useState<any[]>([]);
  const [mine, setMine] = useState<any[]>([]);
  const [progressByAssignment, setProgressByAssignment] = useState<Record<number, any>>({});

  async function loadAll() {
    const [t, m] = await Promise.all([client.get("/trails"), client.get("/trails/mine")]);
    setTrails(t.data);
    setMine(m.data);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function openProgress(assignmentId: number) {
    const { data } = await client.get(`/trails/assignments/${assignmentId}`);
    setProgressByAssignment((prev) => ({ ...prev, [assignmentId]: data }));
  }

  async function toggleStep(assignmentId: number, stepId: number, completed: boolean) {
    await client.patch(`/trails/assignments/${assignmentId}/steps/${stepId}`, { completed });
    openProgress(assignmentId);
    loadAll();
  }

  return (
    <div className="pl-72 pr-4 py-4">
      <Sidebar />
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-white">Onboarding trails</h1>
        <p className="text-sm text-slate-400 mt-1">Role-adaptive, step-by-step paths tied to real graph nodes.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h2 className="font-display text-sm font-semibold text-white mb-4">My trails</h2>
          <div className="space-y-3">
            {mine.map((a: any) => {
              const detail = progressByAssignment[a.assignment_id];
              return (
                <div key={a.assignment_id} className="rounded-xl border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">{a.title}</p>
                      <p className="text-xs text-slate-400">{a.role}</p>
                    </div>
                    <button
                      onClick={() => openProgress(a.assignment_id)}
                      className="text-xs text-cyan"
                    >
                      {detail ? "Refresh" : "View steps"}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Status: {a.status.replace("_", " ")}</p>

                  {detail && (
                    <div className="mt-3 space-y-1.5">
                      {detail.steps.map((s: any) => (
                        <label key={s.id} className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            checked={!!s.completed}
                            onChange={(e) => toggleStep(a.assignment_id, s.id, e.target.checked)}
                          />
                          <span className={s.completed ? "line-through text-slate-500" : ""}>{s.title}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {mine.length === 0 && <p className="text-sm text-slate-500">No trails assigned to you yet.</p>}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="font-display text-sm font-semibold text-white mb-4">All trails{user?.role !== "employee" ? " (org-wide)" : ""}</h2>
          <div className="space-y-3">
            {trails.map((t: any) => (
              <div key={t.id} className="rounded-xl border border-white/10 p-4">
                <p className="text-sm text-white">{t.title}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
                {t.description && <p className="mt-1 text-xs text-slate-400">{t.description}</p>}
              </div>
            ))}
            {trails.length === 0 && <p className="text-sm text-slate-500">No trails created yet.</p>}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
