import { createContext, useContext, useState, ReactNode } from "react";
import client from "../api/client";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  department?: string;
  is_senior?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role?: string; department?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("neuroflow_user");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email: string, password: string) {
    const { data } = await client.post("/auth/login", { email, password });
    localStorage.setItem("neuroflow_token", data.token);
    localStorage.setItem("neuroflow_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(payload: any) {
    const { data } = await client.post("/auth/register", payload);
    localStorage.setItem("neuroflow_token", data.token);
    localStorage.setItem("neuroflow_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("neuroflow_token");
    localStorage.removeItem("neuroflow_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
