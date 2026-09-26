import { useEffect, useState } from "react";
import client from "../api/client";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ActivityTicker from "../components/ActivityTicker";
import GlassCard from "../components/GlassCard";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    client.get("/dashboard").then((res) => setData(res.data));
  }, []);

  const ticker = (data?.recentNodes || []).map((n: any) => ({
    id: n.id,
    text: `${n.title} — ${n.status === "gap" ? "flagged as a knowledge gap" : `updated, now ${n.status}`}`,
  }));

  return (
    <div className="pl-72 pr-4 py-4">
      <Sidebar />
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-slate-400 mt-1">What's happening across the org's knowledge graph right now.</p>
      </header>

      {!data ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Graph nodes" value={data.nodeCounts.total} />
            <StatCard label="Knowledge gaps" value={data.nodeCounts.knowledge_gaps || 0} accent="purple" />
            <StatCard label="Onboarding in progress" value={data.trailCounts.in_progress || 0} />
            <StatCard label="Pending memory surveys" value={data.pendingSurveys || 0} accent="purple" />
          </div>

          <GlassCard className="mt-6 p-6">
            <h2 className="font-display text-sm font-semibold text-white mb-4">Recently touched nodes</h2>
            <div className="space-y-2">
              {data.recentNodes.map((n: any) => (
                <div key={n.id} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-2.5">
                  <div>
                    <p className="text-sm text-white">{n.title}</p>
                    <p className="text-xs text-slate-400">{n.type}</p>
                  </div>
                  <span
                    className={`text-xs ${
                      n.status === "gap" ? "text-[#FF5D73]" : n.status === "dormant" ? "text-slate-400" : "text-cyan"
                    }`}
                  >
                    {n.status}
                  </span>
                </div>
              ))}
              {data.recentNodes.length === 0 && (
                <p className="text-sm text-slate-500">No nodes yet — add your first one in the Knowledge Graph tab.</p>
              )}
            </div>
          </GlassCard>
        </>
      )}

      <ActivityTicker items={ticker} />
    </div>
  );
}
