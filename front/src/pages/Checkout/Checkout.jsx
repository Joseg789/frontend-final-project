import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart/CartContext";
import { useAuth } from "../../context/auth/AuthContext";
import { toast } from "sonner";
import axios from "axios";
import styles from "./Checkout.module.css";

const API_URL = import.meta.env.VITE_API_URL_BACKEND2;

const EMPTY_ADDR = {
  calle: "",
  ciudad: "",
  codigoPostal: "",
  pais: "España",
};

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [addr, setAddr] = useState(EMPTY_ADDR);
  const [loading, setLoading] = useState(false);

  // ✅ redirige en useEffect, no durante el render
  useEffect(() => {
    if (!cartItems.length) {
      navigate("/checkout/success");
    }
  }, [cartItems.length]);

  if (!cartItems.length) return null;

  const shipping = cartTotal >= 50 ? 0 : 4.99;
  const finalTotal = (cartTotal + shipping).toFixed(2);

  const handleOrder = async () => {
    if (!addr.calle || !addr.ciudad || !addr.codigoPostal) {
      return toast.error("Rellena todos los campos de dirección");
    }
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}orders`,
        {
          items: cartItems.map((item) => ({
            producto: item._id,
            nombre: item.nombre,
            precio: item.precio,
            quantity: item.quantity,
            imagen: item.imagen,
            categoria: item.categoria,
            genero: item.genero,
          })),
          total: parseFloat(finalTotal),
          direccion: addr,
        },
        { withCredentials: true },
      );
      clearCart();
      toast.success("¡Pedido realizado correctamente!");
      navigate("/checkout/success");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al procesar el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.grid}>
        {/* Dirección */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Dirección de envío</p>

          <div className={styles.fieldRow}>
            <Field
              label="Calle y número"
              value={addr.calle}
              onChange={(v) => setAddr({ ...addr, calle: v })}
              placeholder="Calle Mayor 24, 3º B"
            />
          </div>
          <div className={styles.fieldRow}>
            <Field
              label="Ciudad"
              value={addr.ciudad}
              onChange={(v) => setAddr({ ...addr, ciudad: v })}
              placeholder="Madrid"
            />
            <Field
              label="Código postal"
              value={addr.codigoPostal}
              onChange={(v) => setAddr({ ...addr, codigoPostal: v })}
              placeholder="28013"
            />
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>País</label>
              <select
                value={addr.pais}
                onChange={(e) => setAddr({ ...addr, pais: e.target.value })}
              >
                <option value="España">España</option>
                <option value="México">México</option>
                <option value="Argentina">Argentina</option>
                <option value="Colombia">Colombia</option>
              </select>
            </div>
          </div>

          <p className={styles.sectionTitle} style={{ marginTop: "1.5rem" }}>
            Método de pago
          </p>
          <div className={styles.paymentDemo}>
            <span className={styles.paymentIcon}>💳</span>
            <div>
              <p className={styles.paymentLabel}>Pago simulado</p>
              <p className={styles.paymentDesc}>
                En este entorno de demo los pagos no son reales
              </p>
            </div>
            <span className={styles.paymentBadge}>Demo</span>
          </div>
        </div>

        {/* Resumen */}
        <div className={styles.summary}>
          <p className={styles.sectionTitle}>Resumen del pedido</p>

          {cartItems.map((item) => (
            <div key={item._id} className={styles.itemRow}>
              <img
                src={item.imagen}
                alt={item.nombre}
                className={styles.itemImg}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.nombre}</p>
                <p className={styles.itemQty}>x{item.quantity}</p>
              </div>
              <p className={styles.itemPrice}>
                {(item.precio * item.quantity).toFixed(2)}€
              </p>
            </div>
          ))}

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>{cartTotal.toFixed(2)}€</span>
          </div>
          <div className={styles.totalRow}>
            <span>Envío</span>
            <span className={shipping === 0 ? styles.free : ""}>
              {shipping === 0 ? "Gratis" : "4,99€"}
            </span>
          </div>

          <div className={styles.divider} />

          <div className={`${styles.totalRow} ${styles.totalFinal}`}>
            <span>Total</span>
            <span>{finalTotal}€</span>
          </div>

          <button
            onClick={handleOrder}
            disabled={loading}
            className={styles.btnOrder}
          >
            {loading ? "Procesando..." : "Confirmar pedido"}
          </button>

          <p className={styles.hint}>
            Al confirmar aceptas los términos y condiciones
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
