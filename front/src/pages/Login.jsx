import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        data,
      );
      toast.success("Inicio de Sesion Correcto");

      // ejemplo: guardar token
      // localStorage.setItem("token", response.data.token);
      const usuario =
        response.data.role === "admin"
          ? { email: data.email, isAdmin: true }
          : {
              email: response.data.user.email,
              id: response.data.user.id,
              isAdmin: false,
            };
      localStorage.setItem("usuario", usuario);
      navigate("/");
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
