import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import CartIcon from "./icons/CartIcon";
import SearchIcon from "./icons/SearchIcon";

function Navbar({ admin = false }) {
  const [searchInput, setSearchInput] = useState("");
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();

  const adminLinks = ["productos", "admin/Editar", "crear", "admin"];

  const userLinks = [
    "productos",
    "categoria/camisetas",
    "categoria/pantalones",
    "categoria/zapatos",
    "categoria/accesorios",
    "hombre",
    "mujer",
  ];

  //  elegimos qué links usar
  const currentLinks = admin ? adminLinks : userLinks;

  // Función búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      navigate(`/search/${encodeURIComponent(query)}`); // redirige a la página de resultados encodeURIComponent para manejar caracteres especiales
      setSearchInput("");
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/" onClick={() => setActiveLink("")}>
          <Logo className="logo" />
        </Link>
      </div>

      {/* Links */}
      <div className="navbar-links">
        {currentLinks.map((l) => (
          <Link
            key={l}
            className={` links ${activeLink === l ? "active" : ""}`}
            to={`/${l.toLowerCase()}`}
            onClick={() => setActiveLink(l)}
          >
            {l.split("/").slice(-1)[0].charAt(0).toUpperCase() +
              l.split("/").slice(-1)[0].slice(1)}{" "}
            {l === "admin" ? "Dashboard" : ""}
            {/* Capitaliza el último segmento del path */}
          </Link>
        ))}
      </div>

      {/* Search */}
      <div className="search-navbar">
        <form className="search-input-nav" onSubmit={handleSearch}>
          <input
            type="text"
            name="searchInput"
            placeholder="Buscar..."
            className="input-plain"
            value={searchInput}
            style={{ color: "white" }}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="button-search-nav">
            <SearchIcon />
          </button>
        </form>
      </div>

      {/* Acciones */}
      <div className="navbar-actions">
        {admin ? (
          <form
            action="https://backend-final-project-h156.onrender.com/auth/logout"
            method="POST"
          >
            <input type="submit" className="links btn-logout" value="Logout" />
          </form>
        ) : (
          <Link className="links" to="/login">
            Login
          </Link>
        )}
      </div>

      {/* Carrito */}
      <Link to="/cart" className="cart-icon">
        <CartIcon />
      </Link>
    </nav>
  );
}

export default Navbar;
