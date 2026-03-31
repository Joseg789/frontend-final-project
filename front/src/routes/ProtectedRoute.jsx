import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, esAdmin }) {
  const usuario = { isAdmin: true }; //JSON.parse(localStorage.getItem("usuario")); //TODO: obtener usuario de la sesion
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  //!replace evita que el usuario pueda volver a la ruta protegida usando el botón de atrás
  if (esAdmin && !usuario.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
