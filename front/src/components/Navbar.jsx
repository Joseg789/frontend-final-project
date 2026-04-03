import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import CartIcon from "./icons/CartIcon";
import SearchIcon from "./icons/SearchIcon";
import { useAuth } from "../context/auth/AuthContext";

const adminLinks = ["productos", "admin/editar", "admin/crear", "admin"];
const userLinks = [
  "productos",
  "categoria/camisetas",
  "categoria/pantalones",
  "categoria/zapatos",
  "categoria/accesorios",
  "hombre",
  "mujer",
];

const getLabel = (path) => {
  const segment = path.split("/").at(-1);
  return segment.charAt(0).toUpperCase() + segment.slice(1);
};

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchInput, setSearchInput] = useState("");

  const currentLinks = user?.role === "admin" ? adminLinks : userLinks;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      navigate(`/search/${encodeURIComponent(query)}`);
      setSearchInput("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <Logo className="logo" />
        </Link>
      </div>

      {/* Links */}
      <div className="navbar-links">
        {currentLinks.map((l) => (
          <Link
            key={l}
            className={`links ${pathname === `/${l}` ? "active" : ""}`}
            to={`/${l.toLowerCase()}`}
          >
            {getLabel(l)} {l === "admin" ? "Dashboard" : ""}
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
        {user ? (
          <button className="links btn-logout" onClick={handleLogout}>
            Logout
          </button>
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
