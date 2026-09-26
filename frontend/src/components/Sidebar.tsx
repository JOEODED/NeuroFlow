import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/graph", label: "Knowledge Graph" },
  { to: "/onboarding", label: "Onboarding Trails" },
  { to: "/routing", label: "Expertise Routing" },
  { to: "/tribal-knowledge", label: "Tribal Knowledge" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="glass glow-purple fixed left-4 top-4 bottom-4 w-64 rounded-2xl p-5 flex flex-col">
      <div className="mb-8">
        <p className="font-display text-xl font-semibold text-white">NeuroFlow</p>
        <p className="text-xs text-slate-400 mt-1">Institutional knowledge graph</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-white/5 text-cyan border border-cyan/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 pt-4">
        <p className="text-sm text-white">{user?.name}</p>
        <p className="text-xs text-slate-400">{user?.department || user?.role}</p>
        <button
          onClick={logout}
          className="mt-3 w-full rounded-xl border border-white/10 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
