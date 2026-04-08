import { useState, useMemo, useEffect } from "react";
import { useProducts } from "../context/ProductsContext";
import Product from "../components/Product";
import Gallery from "../components/Gallery";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import styles from "../App.module.css";

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

  const toggleTalla = (t) =>
    setTallasSelected((p) =>
      p.includes(t) ? p.filter((x) => x !== t) : [...p, t],
    );
  const toggleCategoria = (c) =>
    setCategoriasSelected((p) =>
      p.includes(c) ? p.filter((x) => x !== c) : [...p, c],
    );

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

  const activeCount =
    tallasSelected.length +
    categoriasSelected.length +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const filtered = useMemo(() => {
    let result = products.filter(
      (p) => p.genero?.toLowerCase() === gender.toLowerCase(),
    );
    if (tallasSelected.length > 0)
      result = result.filter((p) => tallasSelected.includes(p.talla));
    if (categoriasSelected.length > 0)
      result = result.filter((p) => categoriasSelected.includes(p.categoria));
    if (priceMin !== "")
      result = result.filter((p) => p.precio >= parseFloat(priceMin));
    if (priceMax !== "")
      result = result.filter((p) => p.precio <= parseFloat(priceMax));

    switch (sortBy) {
      case "price-asc":
        return [...result].sort((a, b) => a.precio - b.precio);
      case "price-desc":
        return [...result].sort((a, b) => b.precio - a.precio);
      case "name-asc":
        return [...result].sort((a, b) => a.nombre.localeCompare(b.nombre));
      case "name-desc":
        return [...result].sort((a, b) => b.nombre.localeCompare(a.nombre));
      default:
        return result;
    }
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
      <div className={styles.toolbar}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>
          {label}
          <span className={styles.toolbarLeft} style={{ marginLeft: 8 }}>
            ({filtered.length} productos)
          </span>
        </h2>

        <div className={styles.toolbarRight}>
          {/* Ordenar */}
          <div className={styles.sortWrapper}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
            </select>
            <ChevronDown size={13} className={styles.sortIcon} />
          </div>

          {/* Toggle filtros */}
          <button
            onClick={() => setFiltersOpen((p) => !p)}
            className={`${styles.btnFilters} ${filtersOpen ? styles.btnFiltersActive : ""}`}
          >
            <SlidersHorizontal size={14} />
            Filtros
            {activeCount > 0 && (
              <span className={styles.filtersBadge}>{activeCount}</span>
            )}
          </button>

          {/* Limpiar */}
          {hasFilters && (
            <button onClick={clearFilters} className={styles.btnClear}>
              <X size={13} /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Panel filtros */}
      {filtersOpen && (
        <div
          className={styles.filtersPanel}
          style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          <FilterGroup label="Talla">
            {TALLAS.map((t) => (
              <FilterBtn
                key={t}
                label={t}
                active={tallasSelected.includes(t)}
                onClick={() => toggleTalla(t)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Categoría">
            {CATEGORIAS.map((c) => (
              <FilterBtn
                key={c}
                label={c}
                active={categoriasSelected.includes(c)}
                onClick={() => toggleCategoria(c)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Precio (€)">
            <div className={styles.priceRow}>
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className={styles.priceInput}
              />
              <span className={styles.priceSep}>—</span>
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className={styles.priceInput}
              />
            </div>
          </FilterGroup>
        </div>
      )}

      {/* Chips */}
      {hasFilters && (
        <div className={styles.chips}>
          {tallasSelected.map((t) => (
            <Chip
              key={t}
              label={`Talla: ${t}`}
              onRemove={() => toggleTalla(t)}
            />
          ))}
          {categoriasSelected.map((c) => (
            <Chip key={c} label={c} onRemove={() => toggleCategoria(c)} />
          ))}
          {priceMin && (
            <Chip
              label={`Min: ${priceMin}€`}
              onRemove={() => setPriceMin("")}
            />
          )}
          {priceMax && (
            <Chip
              label={`Max: ${priceMax}€`}
              onRemove={() => setPriceMax("")}
            />
          )}
          {sortBy !== "default" && (
            <Chip
              label={
                sortBy === "price-asc"
                  ? "Precio ↑"
                  : sortBy === "price-desc"
                    ? "Precio ↓"
                    : sortBy === "name-asc"
                      ? "A-Z"
                      : "Z-A"
              }
              onRemove={() => setSortBy("default")}
            />
          )}
        </div>
      )}

      {/* Productos */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            No hay productos con los filtros seleccionados
          </p>
          <button onClick={clearFilters} className={styles.btnResetFilters}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className={styles.containerProducts}>
          {filtered.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <p className={styles.filterGroupLabel}>{label}</p>
      <div className={styles.filterBtns}>{children}</div>
    </div>
  );
}

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${styles.filterBtn} ${active ? styles.filterBtnActive : ""}`}
    >
      {label}
    </button>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className={styles.chip} onClick={onRemove}>
      {label} <X size={11} />
    </span>
  );
}

export default GenderProducts;
