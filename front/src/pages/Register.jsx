import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api";

function Register() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await api.post("auth/register", data);
      toast.success("Usuario Registrado correctamente");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Error en Registro de Usuario por favor intente de nuevo");
    }
  };

  return (
    <div className="login-container">
      <h2>Unete a Nuestra Comunidad</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Registrar</button>
      </form>

      <Link to="/login">
        <p>¿ya tienes cuenta? Iniciar sesion</p>
      </Link>
    </div>
  );
}

export default Register;
