import Spinner from "../components/icons/Spinner";
import { useAuth } from "../context/auth/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, esAdmin = false }) {
  const { user, loading } = useAuth();

  //  espera a que se verifique el token antes de redirigir
  if (loading) {
    return <Spinner />;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (esAdmin && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
