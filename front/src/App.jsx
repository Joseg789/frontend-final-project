import { useEffect, useState, useMemo } from "react";
import { useProducts } from "./context/ProductsContext";
import Product from "./components/Product";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import styles from "./App.module.css";

const TALLAS = ["S", "M", "L", "XL", "XXL"];
const CATEGORIAS = [
  "Camisetas",
  "Pantalones",
  "Accesorios",
  "Zapatos",
  "Chaquetas",
];
const GENEROS = ["Hombre", "Mujer", "Unisex"];

function App() {
  const { getProducts, products } = useProducts();

  const [tallasSelected, setTallasSelected] = useState([]);
  const [categoriasSelected, setCategoriasSelected] = useState([]);
  const [generosSelected, setGenerosSelected] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const toggleTalla = (t) =>
    setTallasSelected((p) =>
      p.includes(t) ? p.filter((x) => x !== t) : [...p, t],
    );
  const toggleCategoria = (c) =>
    setCategoriasSelected((p) =>
      p.includes(c) ? p.filter((x) => x !== c) : [...p, c],
    );
  const toggleGenero = (g) =>
    setGenerosSelected((p) =>
      p.includes(g) ? p.filter((x) => x !== g) : [...p, g],
    );

  const clearFilters = () => {
    setTallasSelected([]);
    setCategoriasSelected([]);
    setGenerosSelected([]);
    setSortBy("default");
    setPriceMin("");
    setPriceMax("");
  };

  const hasFilters =
    tallasSelected.length > 0 ||
    categoriasSelected.length > 0 ||
    generosSelected.length > 0 ||
    priceMin !== "" ||
    priceMax !== "" ||
    sortBy !== "default";

  const activeCount =
    tallasSelected.length +
    categoriasSelected.length +
    generosSelected.length +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const filtered = useMemo(() => {
    let result = [...products];

    if (tallasSelected.length > 0)
      result = result.filter((p) => tallasSelected.includes(p.talla));
    if (categoriasSelected.length > 0)
      result = result.filter((p) => categoriasSelected.includes(p.categoria));
    if (generosSelected.length > 0)
      result = result.filter((p) =>
        generosSelected.some(
          (g) => g.toLowerCase() === p.genero?.toLowerCase(),
        ),
      );
    if (priceMin !== "")
      result = result.filter((p) => p.precio >= parseFloat(priceMin));
    if (priceMax !== "")
      result = result.filter((p) => p.precio <= parseFloat(priceMax));

    switch (sortBy) {
      case "price-asc":
        return result.sort((a, b) => a.precio - b.precio);
      case "price-desc":
        return result.sort((a, b) => b.precio - a.precio);
      case "name-asc":
        return result.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case "name-desc":
        return result.sort((a, b) => b.nombre.localeCompare(a.nombre));
      default:
        return result;
    }
  }, [
    products,
    tallasSelected,
    categoriasSelected,
    generosSelected,
    priceMin,
    priceMax,
    sortBy,
  ]);

  return (
    <div className="container">
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <p className={styles.toolbarLeft}>
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
        </p>
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
        <div className={styles.filtersPanel}>
          <FilterGroup label="Género">
            {GENEROS.map((g) => (
              <FilterBtn
                key={g}
                label={g}
                active={generosSelected.includes(g)}
                onClick={() => toggleGenero(g)}
              />
            ))}
          </FilterGroup>

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
          {generosSelected.map((g) => (
            <Chip key={g} label={g} onRemove={() => toggleGenero(g)} />
          ))}
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

export default App;
