// pages/CheckoutSuccess.jsx
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccess() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <CheckCircle
        size={56}
        color="#3B6D11"
        style={{ margin: "0 auto 1.5rem" }}
      />
      <h1 style={{ fontSize: 28, fontWeight: 500, marginBottom: "0.75rem" }}>
        ¡Pedido confirmado!
      </h1>
      <p style={{ fontSize: 15, color: "#888", marginBottom: "2rem" }}>
        Hemos recibido tu pedido. Puedes seguir su estado en tu perfil.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link
          to="/profile"
          style={{
            padding: "10px 24px",
            background: "#2C2C2A",
            color: "#fff",
            borderRadius: 8,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Ver mis pedidos
        </Link>
        <Link
          to="/productos"
          style={{
            padding: "10px 24px",
            background: "transparent",
            color: "#555",
            border: "0.5px solid #e0e0e0",
            borderRadius: 8,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
