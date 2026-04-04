import { useParams } from "react-router-dom";
import Product from "../components/Product";
import { useProducts } from "../context/ProductsContext";

function SearchResults() {
  const { query } = useParams(); //consulta
  const { products } = useProducts();
  const searchTerm = query ? query.toLowerCase().trim() : "noTerm";

  const filteredProducts =
    searchTerm === "noTerm"
      ? products
      : products.filter(
          (p) =>
            p.nombre.toLowerCase().includes(searchTerm) ||
            p.categoria.toLowerCase().includes(searchTerm) ||
            p.descripcion.toLowerCase().includes(searchTerm) ||
            p.talla.toLowerCase().includes(searchTerm) ||
            p.genero.toLowerCase().includes(searchTerm),
        );

  return (
    <div className="container">
      <h2>
        {searchTerm ? `Resultados para: "${query}"` : "¿Qué estás buscando?"}
      </h2>
      <div className="container-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <Product product={product} />
            </div>
          ))
        ) : (
          <>
            <p>No se encontraron productos.</p>
            <h2>Te Puede interesar</h2>
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <Product product={product} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
