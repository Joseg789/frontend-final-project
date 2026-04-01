import { useState } from "react";
import CartItem from "./CartItem";
import "./cart.css";
import {
  Tag,
  Truck,
  ShieldCheck,
  CreditCard,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "../context/cart/CartContext";
import { toast } from "sonner";
import Hero from "../components/hero/Hero";

export default function Cart() {
  const { cartItems, cartTotal: subtotal, clearCart } = useCart();
  const [discount, setDiscount] = useState("");
  const [discountValue, setDiscountValue] = useState(0);

  const applyDiscount = () => {
    if (discount === "SAVE10") {
      setDiscountValue(0.1);
      toast.success("¡Descuento aplicado! 10% de descuento 🏷️");
    } else {
      setDiscountValue(0);
      toast.error("Código de descuento inválido ❌");
    }
  };

  const discountAmount = subtotal * discountValue;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal - discountAmount + shipping;

  return (
    <>
      {cartItems.length === 0 ? (
        <>
          <div className="empty-cart">
            <ShoppingCart size={48} />
            <h3 style={{ textAlign: "center" }}>Tu carrito está vacío</h3>
            <h2>Explora Nuestros Productos</h2>
          </div>

          <Hero />
        </>
      ) : (
        <>
          <div className="cart-container">
            <div className="cart-items">
              <h2
                style={{
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "10px",
                  marginBottom: "20px",
                }}
              >
                Carrito ({cartItems.length})
              </h2>

              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
              <button className="clear-btn" onClick={() => clearCart()}>
                <div className="clear-content-btn">
                  <Trash2 size={18} /> vaciar carrito
                </div>
              </button>
            </div>

            <div className="cart-summary">
              {/* DESCUENTO */}
              <h4>Usa tu código de descuento</h4>
              <div className="discount-box">
                <Tag size={18} />
                <input
                  type="text"
                  placeholder="Código descuento"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
                <button onClick={applyDiscount}>Aplicar</button>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{subtotal}€</span>
              </div>

              <div className="summary-row">
                <span>Descuento</span>
                <span>-{discountAmount.toFixed(2)}€</span>
              </div>

              <div className="summary-row">
                <span>
                  <Truck size={16} /> Envío
                </span>
                <span>{shipping === 0 ? "Gratis" : `${shipping}€`}</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <div>
                <h2>Resumen de pedido</h2>
                <h3> ({cartItems.length} Artículos)</h3>
              </div>

              {/* BOTONES */}
              <button className="checkout-btn">
                <CreditCard size={18} />
                Pagar
              </button>

              <button className="apple-btn">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg "
                  alt="Apple Pay"
                  className="apple-logo"
                />
                Pay
              </button>

              {/* SEGURIDAD */}
              <div className="secure-box">
                <ShieldCheck size={16} />
                Pago seguro garantizado
              </div>
            </div>
          </div>
        </>
      )}
      <div className="join-club">
        <h3>Unete a nuestro club</h3>
        <p>Disfruta de beneficios exclusivos y descuentos especiales.</p>
        <button className="join-btn">Unirse al club</button>
      </div>
    </>
  );
}
