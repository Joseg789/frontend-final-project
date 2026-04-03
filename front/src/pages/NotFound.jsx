// pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h1
        style={{ fontSize: 80, fontWeight: 500, letterSpacing: -2, margin: 0 }}
      >
        404
      </h1>
      <p style={{ fontSize: 16, color: "#888", marginTop: "1rem" }}>
        Página no encontrada
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: "2rem",
          padding: "10px 24px",
          background: "#2C2C2A",
          color: "#fff",
          borderRadius: 8,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
