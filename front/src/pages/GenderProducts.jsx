import { useProducts } from "../context/ProductsContext";
import Product from "../components/Product";
import Gallery from "../components/Gallery";
function GenderProducts({ gender }) {
  const { products } = useProducts();
  const filteredProducts = products.filter(
    (product) => product.genero === gender,
  );

  return (
    <>
      {filteredProducts.length === 0 ? (
        <div className="container">
          <h2 style={{ textAlign: "center" }}>
            No hay productos disponibles para
            {gender === "mujer" ? " Mujer" : " Hombre"}
          </h2>

          <h3 style={{ textAlign: "center" }}>Explora nuestros productos</h3>

          <Gallery />
        </div>
      ) : (
        <div className="container">
          <h2>{gender === "mujer" ? "Mujer" : "Hombre"}</h2>
          <div className="container-products">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <Product product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default GenderProducts;
