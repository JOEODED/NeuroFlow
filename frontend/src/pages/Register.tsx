import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", role: "employee" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong creating your account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass glow-purple rounded-2xl p-10 max-w-md w-full">
        <h1 className="font-display text-xl font-semibold text-white">Create your account</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            placeholder="Full name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400/50"
          />
          <input
            type="email" placeholder="Email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400/50"
          />
          <input
            type="password" placeholder="Password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400/50"
          />
          <input
            placeholder="Department (optional)" value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400/50"
          />
          {error && <p className="text-xs text-[#FF5D73]">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-xl bg-purple-500/90 text-white font-medium py-2.5 text-sm hover:bg-purple-500 transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-xs text-slate-400">
          Already have an account? <Link to="/login" className="text-cyan">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
