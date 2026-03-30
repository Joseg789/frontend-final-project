import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import CartIcon from "./icons/CartIcon";
import SearchIcon from "./icons/SearchIcon";

function Navbar({ admin = false }) {
  const [searchInput, setSearchInput] = useState("");
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();

  const adminLinks = [
    "Productos",
    "Camisetas",
    "Pantalones",
    "Zapatos",
    "Admin",
    "Crear",
    "Nosotros",
    "Accesorios",
  ];

  const userLinks = [
    "Productos",
    "Camisetas",
    "Pantalones",
    "Zapatos",
    "Nosotros",
    "Accesorios",
  ];

  //  elegimos qué links usar
  const currentLinks = admin ? adminLinks : userLinks;

  // Función búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      navigate(`/search/${encodeURIComponent(query)}`);
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
            {l}
          </Link>
        ))}
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
            style={{ color: "white" }}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="button-search">
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
      <CartIcon />
    </nav>
  );
}

export default Navbar;
