import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";

const API_URL = import.meta.env.VITE_API_URL_BACKEND2;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await axios.post(`${API_URL}auth/login`, data, {
        withCredentials: true,
      });

      const usuario =
        response.data.role === "admin"
          ? { email: data.email, role: "admin" }
          : {
              email: response.data.user.email,
              id: response.data.user.id,
              role: "user",
            };

      login(usuario); //guardo
      toast.success("Inicio de sesión correcto");
      if (usuario.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Accede a tu cuenta</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>

      <p>
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </p>

      <p>
        ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
}

export default Login;
