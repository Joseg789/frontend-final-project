import { useState, useEffect } from "react";
import { useAuth } from "../context/auth/AuthContext";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import api from "../api";

const API_URL = import.meta.env.VITE_API_URL_BACKEND2;

const NAV_ITEMS = [
  { id: "datos", label: "Mis datos" },
  { id: "pedidos", label: "Mis pedidos" },
  { id: "direcciones", label: "Direcciones" },
  { id: "wishlist", label: "Lista de deseos" },
  { id: "seguridad", label: "Seguridad" },
];

const WISHLIST = [
  {
    nombre: "Fleece Summit Pro",
    precio: "149,95€",
    img: "https://images.unsplash.com/photo-1611417833111-284ac6508488?w=500&auto=format&fit=crop&q=60",
  },
  {
    nombre: "Pantalón Softshell",
    precio: "119,00€",
    img: "https://images.unsplash.com/photo-1734519241406-a84e29bbffc8?w=500&auto=format&fit=crop&q=60",
  },
  {
    nombre: "Gorro Merino",
    precio: "39,95€",
    img: "https://images.unsplash.com/photo-1644611390368-6b948e96dbea?w=500&auto=format&fit=crop&q=60",
  },
];

const statusClass = {
  entregado: styles.statusDelivered,
  enviado: styles.statusTransit,
  pendiente: styles.statusTransit,
  procesando: styles.statusTransit,
  cancelado: styles.statusCancelled,
};

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("datos");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null); // orden seleccionada para modal
  const navigate = useNavigate();

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "AM";

  useEffect(() => {
    if (activeSection !== "pedidos") return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("orders/me");
        setOrders(res.data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeSection]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.headerInfo}>
          <h1>{user?.email || "Usuario"}</h1>
          <p>{user?.email}</p>
          <span className={styles.badge}>Member</span>
        </div>
      </div>

      {/* Layout */}
      <div className={styles.grid}>
        {/* Sidebar */}
        <nav className={styles.sidebar}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`${styles.navItem} ${activeSection === item.id ? styles.navItemActive : ""}`}
            >
              {item.label}
            </div>
          ))}
          <div className={styles.navDivider} />
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
              <path d="M11 11l3-3-3-3" />
              <path d="M14 8H6" />
            </svg>
            Cerrar sesión
          </button>
        </nav>

        {/* Contenido */}
        <div>
          {/* Datos personales */}
          {activeSection === "datos" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>Información personal</p>
              <div className={styles.fieldRow}>
                <Field label="Nombre" defaultValue="Jose Gregorio" />
                <Field label="Apellidos" defaultValue="Sanchez" />
              </div>
              <div className={styles.fieldRow}>
                <Field
                  label="Email"
                  defaultValue={user?.email || ""}
                  type="email"
                />
                <Field
                  label="Teléfono"
                  defaultValue="+34 612 345 678"
                  type="tel"
                />
              </div>
              <div className={styles.fieldRow}>
                <Field label="Fecha de nacimiento" defaultValue="15/04/1990" />
                <Field label="Género" defaultValue="Hombre" />
              </div>
              <SaveButton />
            </div>
          )}

          {/* Pedidos */}
          {activeSection === "pedidos" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>Historial de pedidos</p>
              {loading ? (
                <p className={styles.empty}>Cargando pedidos...</p>
              ) : orders.length === 0 ? (
                <p className={styles.empty}>No tienes pedidos aún</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className={styles.orderRow}
                    onClick={() => setSelected(order)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.orderImgPlaceholder} />
                    <div className={styles.orderInfo}>
                      <p>
                        {order.items?.[0]?.nombre || "Pedido"}
                        {order.items?.length > 1
                          ? ` +${order.items.length - 1} Productos`
                          : ""}
                      </p>
                      <span>
                        Pedido #{order._id?.slice(-6).toUpperCase()} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                    <span
                      className={`${styles.statusBase} ${statusClass[order.estado] || styles.statusTransit}`}
                    >
                      {order.estado}
                    </span>
                    <div className={styles.orderPrice}>
                      {(order.total || 0).toFixed(2)}€
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Direcciones */}
          {activeSection === "direcciones" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>Mis direcciones</p>
              <div className={styles.addrGrid}>
                <div className={`${styles.addrCard} ${styles.addrCardDefault}`}>
                  <p className={styles.addrName}>Jose Sanchez</p>
                  <p className={styles.addrText}>
                    Calle Mayor 24, 3º B<br />
                    28013 Madrid
                    <br />
                    España
                  </p>
                  <p className={styles.addrDefaultLabel}>
                    · Dirección principal
                  </p>
                </div>
                <div className={styles.addrCard}>
                  <p className={styles.addrName}>Oficina</p>
                  <p className={styles.addrText}>
                    Paseo de la Castellana 89
                    <br />
                    28046 Madrid
                    <br />
                    España
                  </p>
                </div>
                <div className={styles.addBtn}>+ Añadir dirección</div>
              </div>
            </div>
          )}

          {/* Wishlist */}
          {activeSection === "wishlist" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>Lista de deseos</p>
              <div className={styles.wishGrid}>
                {WISHLIST.map((item) => (
                  <div key={item.nombre} className={styles.wishCard}>
                    <img
                      src={item.img}
                      alt={item.nombre}
                      className={styles.wishImg}
                    />
                    <div className={styles.wishInfo}>
                      <p className={styles.wishName}>{item.nombre}</p>
                      <p className={styles.wishPrice}>{item.precio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seguridad */}
          {activeSection === "seguridad" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>Seguridad</p>
              <div className={styles.fieldRow}>
                <Field
                  label="Contraseña actual"
                  type="password"
                  defaultValue="••••••••"
                />
                <div />
              </div>
              <div className={styles.fieldRow}>
                <Field
                  label="Nueva contraseña"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                />
                <Field
                  label="Confirmar contraseña"
                  type="password"
                  placeholder="Repite la contraseña"
                />
              </div>
              <SaveButton label="Actualizar contraseña" />
            </div>
          )}
        </div>
      </div>

      {/* Modal detalle pedido */}
      {selected && (
        <OrderModal order={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function OrderModal({ order, onClose }) {
  const shipping = (order.total || 0) >= 50 ? 0 : 4.99;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>
              Pedido #{order._id?.slice(-6).toUpperCase()}
            </h3>
            <p className={styles.modalDate}>
              {new Date(order.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button onClick={onClose} className={styles.modalClose}>
            <X size={18} />
          </button>
        </div>

        {/* Estado */}
        <div className={styles.modalSection}>
          <p className={styles.modalSectionTitle}>Estado</p>
          <span
            className={`${styles.statusBase} ${
              order.estado === "entregado"
                ? styles.statusDelivered
                : order.estado === "cancelado"
                  ? styles.statusCancelled
                  : styles.statusTransit
            }`}
          >
            {order.estado || "pendiente"}
          </span>
        </div>

        {/* Productos */}
        <div className={styles.modalSection}>
          <p className={styles.modalSectionTitle}>
            Productos ({order.items?.length || 0})
          </p>
          {order.items?.length === 0 ? (
            <p className={styles.empty}>Sin productos</p>
          ) : (
            order.items?.map((item, i) => (
              <div key={i} className={styles.modalItemRow}>
                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className={styles.modalItemImg}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className={styles.modalItemInfo}>
                  <p className={styles.modalItemName}>{item.nombre}</p>
                  {item.categoria && (
                    <p className={styles.modalItemMeta}>{item.categoria}</p>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p className={styles.modalItemPrice}>
                    {(item.precio * item.quantity).toFixed(2)}€
                  </p>
                  <p className={styles.modalItemMeta}>
                    x{item.quantity} · {item.precio.toFixed(2)}€/ud
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dirección */}
        {order.direccion?.calle && (
          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Dirección de envío</p>
            <p className={styles.modalAddr}>
              {order.direccion.calle}
              <br />
              {order.direccion.codigoPostal} {order.direccion.ciudad}
              <br />
              {order.direccion.pais}
            </p>
          </div>
        )}

        {/* Resumen de precio */}
        <div className={styles.modalSection}>
          <p className={styles.modalSectionTitle}>Resumen</p>
          <div className={styles.modalTotalRow}>
            <span>Subtotal</span>
            <span>{(order.total || 0).toFixed(2)}€</span>
          </div>
          <div className={styles.modalTotalRow}>
            <span>Envío</span>
            <span style={{ color: shipping === 0 ? "#3B6D11" : "#111" }}>
              {shipping === 0 ? "Gratis" : "4,99€"}
            </span>
          </div>
          <div className={styles.modalDivider} />
          <div className={`${styles.modalTotalRow} ${styles.modalTotalFinal}`}>
            <span>Total</span>
            <span>{((order.total || 0) + shipping).toFixed(2)}€</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, type = "text", placeholder }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}

function SaveButton({ label = "Guardar cambios" }) {
  return <button className={styles.saveBtn}>{label}</button>;
}
