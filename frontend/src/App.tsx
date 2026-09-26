import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GraphView from "./pages/GraphView";
import OnboardingTrails from "./pages/OnboardingTrails";
import ExpertiseRouting from "./pages/ExpertiseRouting";
import TribalKnowledge from "./pages/TribalKnowledge";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/graph" element={<PrivateRoute><GraphView /></PrivateRoute>} />
      <Route path="/onboarding" element={<PrivateRoute><OnboardingTrails /></PrivateRoute>} />
      <Route path="/routing" element={<PrivateRoute><ExpertiseRouting /></PrivateRoute>} />
      <Route path="/tribal-knowledge" element={<PrivateRoute><TribalKnowledge /></PrivateRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
