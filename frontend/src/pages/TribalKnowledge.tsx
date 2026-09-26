import { useEffect, useState } from "react";
import client from "../api/client";
import Sidebar from "../components/Sidebar";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";

export default function TribalKnowledge() {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [response, setResponse] = useState<Record<number, string>>({});

  async function load() {
    const { data } = await client.get("/surveys");
    setSurveys(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(id: number) {
    if (!response[id]) return;
    await client.post(`/surveys/${id}/respond`, { response_text: response[id] });
    setResponse((prev) => ({ ...prev, [id]: "" }));
    load();
  }

  return (
    <div className="pl-72 pr-4 py-4">
      <Sidebar />
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-white">Tribal knowledge</h1>
        <p className="text-sm text-slate-400 mt-1">
          Micro-surveys that capture what {user?.is_senior ? "you know" : "senior staff know"} before it walks out the door.
        </p>
      </header>

      <div className="space-y-4 max-w-2xl">
        {surveys.map((s: any) => (
          <GlassCard key={s.id} className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">{s.target_name}</p>
            <p className="mt-1 text-sm text-white">{s.prompt}</p>

            {s.status === "answered" ? (
              <p className="mt-3 text-sm text-slate-300 rounded-xl bg-white/5 p-3">{s.response_text}</p>
            ) : (
              <div className="mt-3 flex gap-2">
                <input
                  placeholder="Answer in a sentence or two..."
                  value={response[s.id] || ""}
                  onChange={(e) => setResponse((prev) => ({ ...prev, [s.id]: e.target.value }))}
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                />
                <button
                  onClick={() => submit(s.id)}
                  className="rounded-xl bg-purple-500/90 text-white text-sm px-4 py-2 hover:bg-purple-500 transition-colors"
                >
                  Save
                </button>
              </div>
            )}
          </GlassCard>
        ))}
        {surveys.length === 0 && <p className="text-sm text-slate-500">No memory-capture prompts right now.</p>}
      </div>
    </div>
  );
}
