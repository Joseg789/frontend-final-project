// ProductDetail.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  Heart,
  Share2,
  Shield,
  Truck,
  RefreshCw,
} from "lucide-react";
import { useCart } from "../context/cart/CartContext.jsx";
import { useProducts } from "../context/ProductsContext.jsx";
import styles from "./ProductDetail.module.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const product = products.find((p) => p._id === id);

  const [btnText, setBtnText] = useState("");
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <p>Producto no encontrado</p>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={16} /> Volver
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.nombre,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className={styles.wrap}>
      {/* Back */}
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <ArrowLeft size={16} /> Volver
      </button>

      <div className={styles.grid}>
        {/* Imagen */}
        <div className={styles.imgWrap}>
          <img
            src={product.imagen || ""}
            alt={`Imagen de ${product.nombre}`}
            className={styles.img}
          />
          <div className={styles.imgActions}>
            <button
              onClick={() => setWishlisted((p) => !p)}
              className={`${styles.imgBtn} ${wishlisted ? styles.imgBtnActive : ""}`}
              title="Añadir a favoritos"
            >
              <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className={styles.imgBtn}
              title="Compartir"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          {/* Categoría + nombre */}
          <span className="card-categoria">{product.categoria ?? ""}</span>
          <h1 className={styles.nombre}>{product.nombre}</h1>

          {/* Precio */}
          <p className={styles.precio}>{product.precio}€</p>

          {/* Descripción */}
          {product.descripcion && (
            <p className={styles.descripcion}>{product.descripcion}</p>
          )}

          <div className={styles.divider} />

          {/* Detalles */}
          <div className={styles.detalles}>
            {product.genero && (
              <div className={styles.detalleRow}>
                <span className={styles.detalleLabel}>Género</span>
                <span className={styles.detalleValue}>{product.genero}</span>
              </div>
            )}
            {product.talla && (
              <div className={styles.detalleRow}>
                <span className={styles.detalleLabel}>Talla</span>
                <span className={styles.tallaTag}>{product.talla}</span>
              </div>
            )}
            {product.categoria && (
              <div className={styles.detalleRow}>
                <span className={styles.detalleLabel}>Categoría</span>
                <span className={styles.detalleValue}>{product.categoria}</span>
              </div>
            )}
          </div>

          <div className={styles.divider} />

          {/* Botón añadir al carrito */}
          <button
            className={`card-btn ${styles.btnCart} ${added ? styles.btnCartAdded : ""}`}
            onClick={handleAddToCart}
            onMouseEnter={() => setBtnText("Add to Cart")}
            onMouseLeave={() => setBtnText("")}
            aria-label={`Agregar ${product.nombre} al carrito`}
          >
            {added ? "¡Añadido!" : btnText || <Plus />}
          </button>

          <div className={styles.divider} />

          {/* Garantías */}
          <div className={styles.garantias}>
            <div className={styles.garantiaItem}>
              <Truck size={16} className={styles.garantiaIcon} />
              <div>
                <p className={styles.garantiaTitulo}>Envío gratis +50€</p>
                <p className={styles.garantiaDesc}>
                  Entrega en 3-5 días hábiles
                </p>
              </div>
            </div>
            <div className={styles.garantiaItem}>
              <RefreshCw size={16} className={styles.garantiaIcon} />
              <div>
                <p className={styles.garantiaTitulo}>Devolución gratuita</p>
                <p className={styles.garantiaDesc}>30 días para devolver</p>
              </div>
            </div>
            <div className={styles.garantiaItem}>
              <Shield size={16} className={styles.garantiaIcon} />
              <div>
                <p className={styles.garantiaTitulo}>Compra segura</p>
                <p className={styles.garantiaDesc}>Pago cifrado SSL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
