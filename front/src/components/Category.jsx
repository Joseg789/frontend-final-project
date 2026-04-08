import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import Product from "./Product";
import styles from "../App.module.css";

function Category() {
  const { category } = useParams();
  const { products, getProducts } = useProducts();

  useEffect(() => {
    getProducts();
  }, []);

  const categoryCap = category[0].toUpperCase() + category.slice(1);
  const filteredProducts = products.filter(
    (prod) => prod.categoria === categoryCap,
  );

  return (
    <div className="container">
      <h2 className={styles.categoryTitle}>
        {categoryCap}
        <span className={styles.categoryCount}>
          ({filteredProducts.length} productos)
        </span>
      </h2>

      {filteredProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            No hay productos en la categoría {categoryCap}
          </p>
        </div>
      ) : (
        <div className={styles.containerProducts}>
          {filteredProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Category;
