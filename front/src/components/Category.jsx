import { useParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import Product from "./Product";

function Category() {
  const { category } = useParams();
  const { products } = useProducts();
  const categoryCap = category[0].toUpperCase() + category.slice(1); //capitalice
  const filtredProducts = products.filter(
    (prod) => prod.categoria === categoryCap,
  );
  return (
    <>
      <div className="container">
        <div className="container-products">
          {filtredProducts &&
            filtredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <Product product={product} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Category;
