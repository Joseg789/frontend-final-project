import { Trash2 } from "lucide-react";
import { useCart } from "../context/cart/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(item._id, newQuantity);
    }
  };

  return (
    <>
      <div className="item-details">
        <h4>{item.nombre}</h4>
        <h4>{item.precio}€</h4>
      </div>
      <div className="items-container">
        <div className="cart-item">
          <img src={item.imagen} alt={item.nombre} />
          <div className="quantity">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity === 1}
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity === 10}
            >
              +
            </button>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item._id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <div className="item-info">
          <div>
            <p style={{ textTransform: "uppercase" }}> {item.descripcion}</p>
            <p>Talla: {item.talla}</p>
          </div>
        </div>
      </div>
    </>
  );
}
