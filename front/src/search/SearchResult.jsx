import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Product from "../components/Product";
import { useProducts } from "../context/ProductsContext";
import styles from "../App.module.css";

function SearchResults() {
  const { query } = useParams();
  const { products, getProducts } = useProducts();

  useEffect(() => {
    getProducts();
  }, []);

  const searchTerm = query ? query.toLowerCase().trim() : "";

  const filteredProducts = !searchTerm
    ? products
    : products.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(searchTerm) ||
          p.categoria?.toLowerCase().includes(searchTerm) ||
          p.descripcion?.toLowerCase().includes(searchTerm) ||
          p.talla?.toLowerCase().includes(searchTerm) ||
          p.genero?.toLowerCase().includes(searchTerm),
      );

  return (
    <div className="container">
      {/* Header */}
      <div className={styles.toolbar}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>
          {searchTerm ? (
            <>
              Resultados para: <em>"{query}"</em>
            </>
          ) : (
            "¿Qué estás buscando?"
          )}
          <span className={styles.toolbarLeft} style={{ marginLeft: 8 }}>
            ({filteredProducts.length} producto
            {filteredProducts.length !== 1 ? "s" : ""})
          </span>
        </h2>
      </div>

      {/* Resultados */}
      {filteredProducts.length > 0 ? (
        <div className={styles.containerProducts}>
          {filteredProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <>
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              No se encontraron productos para "{query}"
            </p>
          </div>

          {/* Sugerencias */}
          <div className={styles.toolbar} style={{ marginTop: "2rem" }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>
              Te puede interesar
            </h2>
          </div>
          <div className={styles.containerProducts}>
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchResults;
