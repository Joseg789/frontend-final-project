import { useAuth } from "../context/auth/AuthContext";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children, esAdmin = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (esAdmin && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
