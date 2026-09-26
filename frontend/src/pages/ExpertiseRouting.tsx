import { useEffect, useState } from "react";
import client from "../api/client";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";

export default function ExpertiseRouting() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [nodeId, setNodeId] = useState<string>("");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    client.get("/nodes").then((res) => setNodes(res.data.nodes));
  }, []);

  async function findExperts() {
    if (!nodeId) return;
    setLoading(true);
    const { data } = await client.get(`/expertise/route?nodeId=${nodeId}`);
    setMatches(data.matches);
    setLoading(false);
  }

  return (
    <div className="pl-72 pr-4 py-4">
      <Sidebar />
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-white">Expertise routing</h1>
        <p className="text-sm text-slate-400 mt-1">Stuck on something? Find the colleague most likely to unblock you.</p>
      </header>

      <GlassCard className="p-5 max-w-xl">
        <label className="text-xs text-slate-400">What are you blocked on?</label>
        <div className="mt-2 flex gap-2">
          <select
            value={nodeId} onChange={(e) => setNodeId(e.target.value)}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
          >
            <option value="">Select a project, concept, or document...</option>
            {nodes.map((n: any) => (
              <option key={n.id} value={n.id}>{n.title} ({n.type})</option>
            ))}
          </select>
          <button
            onClick={findExperts}
            className="rounded-xl bg-cyan/90 text-obsidian font-medium px-4 py-2 text-sm hover:bg-cyan transition-colors"
          >
            {loading ? "Searching..." : "Route me"}
          </button>
        </div>
      </GlassCard>

      <div className="mt-6 space-y-2 max-w-xl">
        {matches.map((m: any, i: number) => (
          <GlassCard key={`${m.id}-${i}`} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-white">{m.name}</p>
              <p className="text-xs text-slate-400">{m.department} · knows {m.node_title}</p>
            </div>
            <div className="text-right">
              <p className={`text-xs ${m.level === "expert" ? "text-purple-300" : "text-slate-400"}`}>{m.level}</p>
              <p className="text-xs text-slate-500">{m.hops === 1 ? "direct match" : "related node"}</p>
            </div>
          </GlassCard>
        ))}
        {matches.length === 0 && nodeId && !loading && (
          <p className="text-sm text-slate-500">No one is tagged as knowing this yet — that's a knowledge gap worth flagging.</p>
        )}
      </div>
    </div>
  );
}
