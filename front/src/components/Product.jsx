import { Plus } from "lucide-react";
import { useCart } from "../context/cart/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Product({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const handleAddToCart = (e) => {
    e.stopPropagation(); // evita navegar al hacer click en el botón
    addToCart(product);
  };

  return (
    <div
      onClick={() => navigate(`/producto/${product._id}`)}
      style={{ cursor: "pointer" }}
    >
      <img src={product.imagen || null} alt={`Imagen de ${product.nombre}`} />
      <div className="card-body">
        <span className="card-categoria">{product.categoria ?? ""}</span>
        <h2 className="card-nombre">{product.nombre}</h2>
        <p className="card-descripcion">{product.descripcion}</p>
        <p className="card-descripcion">{product.genero}</p>
        <p className="card-talla">Talla: {product.talla}</p>
        <p className="card-precio">{product.precio}€</p>
        <button
          className="card-btn"
          onClick={handleAddToCart}
          onMouseEnter={() => setTitle("Add to Cart")}
          onMouseOut={() => setTitle("")}
          aria-label={`Agregar ${product.nombre} al carrito`}
        >
          {title || <Plus />}
        </button>
      </div>
    </div>
  );
}

export default Product;
