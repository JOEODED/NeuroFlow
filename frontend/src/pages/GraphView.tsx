import { useEffect, useState } from "react";
import client from "../api/client";
import Sidebar from "../components/Sidebar";
import GraphCanvas from "../components/GraphCanvas";
import KnowledgeClusterPanel from "../components/KnowledgeClusterPanel";
import GlassCard from "../components/GlassCard";

export default function GraphView() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "concept", title: "", description: "", status: "active" });

  async function loadGraph() {
    const { data } = await client.get("/nodes");
    setNodes(data.nodes);
    setEdges(data.edges);
  }

  useEffect(() => {
    loadGraph();
  }, []);

  async function handleNodeClick(id: number) {
    const { data } = await client.get(`/nodes/${id}`);
    setSelected(data);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await client.post("/nodes", form);
    setForm({ type: "concept", title: "", description: "", status: "active" });
    setShowForm(false);
    loadGraph();
  }

  return (
    <div className="pl-72 pr-4 py-4 h-screen flex flex-col">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Knowledge graph</h1>
          <p className="text-sm text-slate-400 mt-1">Drag to explore. Click a node to open its cluster.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl border border-cyan/30 px-4 py-2 text-sm text-cyan hover:bg-cyan/10 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add node"}
        </button>
      </header>

      {showForm && (
        <GlassCard className="p-5 mb-4">
          <form onSubmit={handleCreate} className="grid md:grid-cols-4 gap-3">
            <select
              value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
            >
              <option value="department">Department</option>
              <option value="project">Project</option>
              <option value="concept">Concept</option>
              <option value="document">Document</option>
            </select>
            <input
              placeholder="Title" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white md:col-span-2"
            />
            <select
              value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
            >
              <option value="active">Active</option>
              <option value="dormant">Dormant</option>
              <option value="gap">Knowledge gap</option>
            </select>
            <textarea
              placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white md:col-span-3"
              rows={2}
            />
            <button type="submit" className="rounded-xl bg-cyan/90 text-obsidian font-medium text-sm hover:bg-cyan transition-colors">
              Save node
            </button>
          </form>
        </GlassCard>
      )}

      <div className="flex-1 relative">
        <GraphCanvas nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />
        {selected && (
          <KnowledgeClusterPanel
            node={selected.node}
            related={selected.related}
            experts={selected.experts}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}
