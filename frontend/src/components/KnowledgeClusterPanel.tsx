import GlassCard from "./GlassCard";

interface Props {
  node: any;
  related: any[];
  experts: any[];
  onClose: () => void;
}

const statusColor: Record<string, string> = {
  active: "text-cyan",
  dormant: "text-slate-400",
  gap: "text-[#FF5D73]",
};

export default function KnowledgeClusterPanel({ node, related, experts, onClose }: Props) {
  return (
    <GlassCard glow="cyan" className="fixed right-4 top-4 bottom-4 w-96 p-6 overflow-y-auto animate-[unfurl_0.25s_ease-out]">
      <style>{`
        @keyframes unfurl {
          from { opacity: 0; transform: translateX(12px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{node.type}</p>
          <h2 className="font-display text-xl font-semibold text-white mt-1">{node.title}</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
          Close
        </button>
      </div>

      <p className={`mt-2 text-xs font-medium ${statusColor[node.status]}`}>
        {node.status === "gap" ? "Knowledge gap" : node.status}
      </p>

      {node.description && <p className="mt-4 text-sm text-slate-300 leading-relaxed">{node.description}</p>}

      <div className="mt-6">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Connected nodes</p>
        {related.length === 0 && <p className="text-sm text-slate-500">No connections yet.</p>}
        <div className="space-y-2">
          {related.map((r: any) => (
            <div key={r.id} className="rounded-xl border border-white/10 px-3 py-2">
              <p className="text-sm text-white">{r.title}</p>
              <p className="text-xs text-slate-400">{r.relation_type.replace("_", " ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Who knows this</p>
        {experts.length === 0 && <p className="text-sm text-slate-500">No one is tagged as an expert here yet.</p>}
        <div className="space-y-2">
          {experts.map((e: any) => (
            <div key={e.id} className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2">
              <div>
                <p className="text-sm text-white">{e.name}</p>
                <p className="text-xs text-slate-400">{e.department}</p>
              </div>
              <span className={`text-xs ${e.level === "expert" ? "text-purple-300" : "text-slate-400"}`}>
                {e.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
