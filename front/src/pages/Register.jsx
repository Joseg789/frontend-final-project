import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

function Register() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        data,
      );
      toast.success("Usuario Registrado correctamente");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
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
