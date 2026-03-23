import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "./SearchIcon";
import { useState } from "react";

function Navbar({ admin = false }) {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    //quitar espacios
    const query = searchInput;
    if (query) {
      navigate(`/search/${encodeURIComponent(query)}`); // redirige a la página de resultados
      setSearchInput("");
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link className="links" to={admin ? "/dashboard" : "/"}>
          MiTienda
        </Link>
      </div>

      {/* Links de navegación */}
      <div className="navbar-links">
        {admin ? (
          <>
            <Link className="links" to="/dashboard">
              Productos
            </Link>
            <Link className="links" to="/dashboard/categoria/camisetas">
              Camisetas
            </Link>
            <Link className="links" to="/dashboard/categoria/pantalones">
              Pantalones
            </Link>
            <Link className="links" to="/dashboard/categoria/zapatos">
              Zapatos
            </Link>
            <Link className="links" to="/dashboard/categoria/accesorios">
              Accesorios
            </Link>
            <Link className="links navbar-btn" to="/dashboard/new">
              Crear Producto
            </Link>
            <Link className="links" to="/dashboard">
              Admin
            </Link>
          </>
        ) : (
          <>
            <Link className="links" to="/">
              Productos
            </Link>
            <Link className="links" to="/categoria/camisetas">
              Camisetas
            </Link>
            <Link className="links" to="/categoria/pantalones">
              Pantalones
            </Link>
            <Link className="links" to="/categoria/zapatos">
              Zapatos
            </Link>
            <Link className="links" to="/categoria/accesorios">
              Accesorios
            </Link>
          </>
        )}
      </div>

      {/* Search */}
      <div className="search">
        <form className="search-input" onSubmit={handleSearch}>
          <input
            type="text"
            name="searchInput"
            placeholder="Buscar..."
            className="input-plain"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">
            <SearchIcon className="search-icon" />
          </button>
        </form>
        <p>___________________</p>
      </div>

      {/* Acciones: Login / Logout */}
      <div className="navbar-actions">
        {admin ? (
          <form action="/logout" method="POST">
            <input type="submit" className="links btn-logout" value="Logout" />
          </form>
        ) : (
          <Link className="links" to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
