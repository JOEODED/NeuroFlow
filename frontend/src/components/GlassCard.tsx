import { ReactNode } from "react";

export default function GlassCard({
  children, className = "", glow = "cyan",
}: { children: ReactNode; className?: string; glow?: "cyan" | "purple" | "none" }) {
  const glowClass = glow === "cyan" ? "glow-cyan" : glow === "purple" ? "glow-purple" : "";
  return (
    <div className={`glass rounded-2xl ${glowClass} ${className}`}>
      {children}
    </div>
  );
}
