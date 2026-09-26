import GlassCard from "./GlassCard";

export default function StatCard({
  label, value, accent = "cyan",
}: { label: string; value: string | number; accent?: "cyan" | "purple" }) {
  const color = accent === "cyan" ? "text-cyan" : "text-purple-300";
  return (
    <GlassCard glow={accent} className="p-5">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${color}`}>{value}</p>
    </GlassCard>
  );
}
