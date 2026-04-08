import { useState, useMemo, useEffect } from "react";
import { useProducts } from "../context/ProductsContext";
import Product from "../components/Product";
import Gallery from "../components/Gallery";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

const TALLAS = ["S", "M", "L", "XL", "XXL"];
const CATEGORIAS = [
  "Camisetas",
  "Pantalones",
  "Accesorios",
  "Zapatos",
  "Chaquetas",
];

function GenderProducts({ gender }) {
  const { products, getProducts } = useProducts();
  //  carga los productos si no están cargados
  useEffect(() => {
    getProducts();
  }, []);

  const [tallasSelected, setTallasSelected] = useState([]);
  const [categoriasSelected, setCategoriasSelected] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const label = gender.charAt(0).toUpperCase() + gender.slice(1);

  // — Toggle talla —
  const toggleTalla = (t) =>
    setTallasSelected((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  // — Toggle categoría —
  const toggleCategoria = (c) =>
    setCategoriasSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  // — Limpiar filtros —
  const clearFilters = () => {
    setTallasSelected([]);
    setCategoriasSelected([]);
    setSortBy("default");
    setPriceMin("");
    setPriceMax("");
  };

  const hasFilters =
    tallasSelected.length > 0 ||
    categoriasSelected.length > 0 ||
    priceMin !== "" ||
    priceMax !== "" ||
    sortBy !== "default";

  // — Filtrado y ordenación —
  const filtered = useMemo(() => {
    let result = products.filter(
      (p) => p.genero?.toLowerCase() === gender.toLowerCase(),
    );

    if (tallasSelected.length > 0) {
      result = result.filter((p) => tallasSelected.includes(p.talla));
    }

    if (categoriasSelected.length > 0) {
      result = result.filter((p) => categoriasSelected.includes(p.categoria));
    }

    if (priceMin !== "") {
      result = result.filter((p) => p.precio >= parseFloat(priceMin));
    }

    if (priceMax !== "") {
      result = result.filter((p) => p.precio <= parseFloat(priceMax));
    }

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.precio - b.precio);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.precio - a.precio);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "name-desc":
        result = [...result].sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    gender,
    tallasSelected,
    categoriasSelected,
    priceMin,
    priceMax,
    sortBy,
  ]);

  const baseProducts = products.filter(
    (p) => p.genero?.toLowerCase() === gender.toLowerCase(),
  );

  if (baseProducts.length === 0) {
    return (
      <div className="container">
        <h2 style={{ textAlign: "center" }}>
          No hay productos disponibles para {label}
        </h2>
        <h3 style={{ textAlign: "center" }}>Explora nuestros productos</h3>
        <Gallery />
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>
          {label}
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "#888",
              marginLeft: 8,
            }}
          >
            ({filtered.length} productos)
          </span>
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Ordenar */}
          <div style={{ position: "relative" }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                height: 36,
                border: "0.5px solid #e0e0e0",
                borderRadius: 8,
                padding: "0 32px 0 12px",
                fontSize: 13,
                background: "#fff",
                color: "#555",
                cursor: "pointer",
                appearance: "none",
              }}
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
            </select>
            <ChevronDown
              size={13}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#888",
              }}
            />
          </div>

          {/* Toggle filtros */}
          <button
            onClick={() => setFiltersOpen((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 36,
              padding: "0 14px",
              border: `0.5px solid ${filtersOpen ? "#2c2c2a" : "#e0e0e0"}`,
              borderRadius: 8,
              background: filtersOpen ? "#2c2c2a" : "#fff",
              color: filtersOpen ? "#fff" : "#555",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <SlidersHorizontal size={14} />
            Filtros
            {hasFilters && (
              <span
                style={{
                  background: "#a32d2d",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {tallasSelected.length +
                  categoriasSelected.length +
                  (priceMin ? 1 : 0) +
                  (priceMax ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Limpiar */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                height: 36,
                padding: "0 12px",
                border: "0.5px solid #f7c1c1",
                borderRadius: 8,
                background: "#fff",
                color: "#a32d2d",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <X size={13} /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Panel de filtros */}
      {filtersOpen && (
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e0e0e0",
            borderRadius: 12,
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Tallas */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#888",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                margin: "0 0 10px",
              }}
            >
              Talla
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TALLAS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTalla(t)}
                  style={{
                    padding: "5px 14px",
                    fontSize: 12,
                    border: "0.5px solid",
                    borderColor: tallasSelected.includes(t)
                      ? "#2c2c2a"
                      : "#e0e0e0",
                    borderRadius: 6,
                    background: tallasSelected.includes(t)
                      ? "#2c2c2a"
                      : "transparent",
                    color: tallasSelected.includes(t) ? "#fff" : "#555",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#888",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                margin: "0 0 10px",
              }}
            >
              Categoría
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIAS.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCategoria(c)}
                  style={{
                    padding: "5px 14px",
                    fontSize: 12,
                    border: "0.5px solid",
                    borderColor: categoriasSelected.includes(c)
                      ? "#2c2c2a"
                      : "#e0e0e0",
                    borderRadius: 6,
                    background: categoriasSelected.includes(c)
                      ? "#2c2c2a"
                      : "transparent",
                    color: categoriasSelected.includes(c) ? "#fff" : "#555",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de precio */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#888",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                margin: "0 0 10px",
              }}
            >
              Precio (€)
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                style={{
                  height: 34,
                  border: "0.5px solid #e0e0e0",
                  borderRadius: 6,
                  padding: "0 10px",
                  fontSize: 13,
                  width: "100%",
                  background: "#fafafa",
                  color: "#000",
                  boxSizing: "border-box",
                }}
              />
              <span style={{ color: "#888", fontSize: 12, flexShrink: 0 }}>
                —
              </span>
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                style={{
                  height: 34,
                  border: "0.5px solid #e0e0e0",
                  borderRadius: 6,
                  padding: "0 10px",
                  fontSize: 13,
                  width: "100%",
                  background: "#fafafa",
                  color: "#000",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chips de filtros activos */}
      {hasFilters && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: "1rem",
          }}
        >
          {tallasSelected.map((t) => (
            <span key={t} style={chipStyle} onClick={() => toggleTalla(t)}>
              Talla: {t} <X size={11} />
            </span>
          ))}
          {categoriasSelected.map((c) => (
            <span key={c} style={chipStyle} onClick={() => toggleCategoria(c)}>
              {c} <X size={11} />
            </span>
          ))}
          {priceMin && (
            <span style={chipStyle} onClick={() => setPriceMin("")}>
              Min: {priceMin}€ <X size={11} />
            </span>
          )}
          {priceMax && (
            <span style={chipStyle} onClick={() => setPriceMax("")}>
              Max: {priceMax}€ <X size={11} />
            </span>
          )}
          {sortBy !== "default" && (
            <span style={chipStyle} onClick={() => setSortBy("default")}>
              {sortBy === "price-asc"
                ? "Precio ↑"
                : sortBy === "price-desc"
                  ? "Precio ↓"
                  : sortBy === "name-asc"
                    ? "Nombre A-Z"
                    : "Nombre Z-A"}{" "}
              <X size={11} />
            </span>
          )}
        </div>
      )}

      {/* Productos */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p style={{ fontSize: 16, color: "#888" }}>
            No hay productos con los filtros seleccionados
          </p>
          <button
            onClick={clearFilters}
            style={{
              marginTop: 12,
              padding: "8px 20px",
              background: "#2c2c2a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="container-products">
          {filtered.map((product) => (
            <div key={product._id} className="product-card">
              <Product product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const chipStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "4px 10px",
  background: "#f5f5f5",
  color: "#555",
  borderRadius: 6,
  fontSize: 12,
  cursor: "pointer",
  border: "0.5px solid #e0e0e0",
  transition: "all 0.15s",
};

export default GenderProducts;
