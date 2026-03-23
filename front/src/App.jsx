import { useEffect } from "react";
import { useProducts } from "./context/ProductsContext";
import Product from "./components/Product";
import ProductForm from "./components/ProductForm";
function App() {
  const { getProducts, products } = useProducts();

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      <div className="container">
        <div className="container-products">
          {products &&
            products.map((product) => (
              <div key={product._id} className="product-card">
                <Product product={product} />
              </div>
            ))}
        </div>
        <ProductForm />
      </div>
    </>
  );
}

export default App;
