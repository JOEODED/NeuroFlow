import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong signing in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="grid md:grid-cols-2 max-w-4xl w-full gap-0 rounded-2xl overflow-hidden glass glow-cyan">
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-purple/20 to-cyan/10">
          <p className="font-display text-2xl font-semibold text-white">NeuroFlow</p>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            The knowledge your team already has, mapped, searchable, and never lost when someone leaves.
          </p>
        </div>
        <div className="p-10">
          <h1 className="font-display text-xl font-semibold text-white">Sign in</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs text-slate-400">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan/50"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan/50"
              />
            </div>
            {error && <p className="text-xs text-[#FF5D73]">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full rounded-xl bg-cyan/90 text-obsidian font-medium py-2.5 text-sm hover:bg-cyan transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-xs text-slate-400">
            New here? <Link to="/register" className="text-cyan">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
