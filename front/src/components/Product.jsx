import { Plus } from "lucide-react";
import { useCart } from "../context/cart/CartContext.jsx";
import { useState } from "react";
function Product({ product }) {
  const { addToCart } = useCart();
  const [title, setTitle] = useState("");
  const handleAddToCart = () => {
    addToCart(product);
  };
  return (
    <>
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
          //cuanddo haga hover que cambie el + por add
          onMouseEnter={() => setTitle("Add to Cart")}
          onMouseOut={() => setTitle("")}
          aria-label={`Agregar ${product.nombre} al carrito`}
        >
          {title || <Plus />}
        </button>
      </div>
    </>
  );
}

export default Product;
