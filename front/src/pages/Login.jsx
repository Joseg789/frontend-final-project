import { Link } from "react-router-dom";

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Aquí puedes agregar lógica para autenticar al usuario
  };

  return (
    <div className="login-container">
      <h2>Accede a tu cuenta</h2>
      <form className="login-form" onSubmit={handleSubmit}></form>
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />

      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" required />

      <button type="submit">Iniciar sesion</button>
      <Link
        to="/forgot-password"
        style={{ marginTop: "10px", textDecoration: "none", color: "black" }}
      >
        <p>¿Olvidaste tu contraseña?</p>
      </Link>
      <p style={{ marginTop: "20px" }}>
        ¿No tienes una cuenta?{" "}
        <Link to="/register" style={{ textDecoration: "none", color: "black" }}>
          Regístrate
        </Link>
      </p>
    </div>
  );
}
export default Login;
