import { Plus } from "lucide-react";
import { useCart } from "../context/cart/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "../App.module.css";

function Product({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      className={styles.productCard}
      onClick={() => navigate(`/producto/${product._id}`)}
    >
      <img src={product.imagen || ""} alt={`Imagen de ${product.nombre}`} />
      <div className={styles.cardBody}>
        <span className={styles.cardCategoria}>{product.categoria ?? ""}</span>
        <h2 className={styles.cardNombre}>{product.nombre}</h2>
        <p className={styles.cardDescripcion}>{product.descripcion}</p>
        <p className={styles.cardDescripcion}>{product.genero}</p>
        <p className={styles.cardTalla}>Talla: {product.talla}</p>
        <p className={styles.cardPrecio}>{product.precio}€</p>
        <button
          className={styles.cardBtn}
          onClick={handleAddToCart}
          onMouseEnter={() => setTitle("Add to Cart")}
          onMouseOut={() => setTitle("")}
          aria-label={`Agregar ${product.nombre} al carrito`}
        >
          {title || <Plus size={14} />}
        </button>
      </div>
    </div>
  );
}

export default Product;
