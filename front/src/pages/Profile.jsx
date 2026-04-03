import { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { id: "datos", label: "Mis datos" },
  { id: "pedidos", label: "Mis pedidos" },
  { id: "direcciones", label: "Direcciones" },
  { id: "wishlist", label: "Lista de deseos" },
  { id: "seguridad", label: "Seguridad" },
];

const ORDERS = [
  {
    nombre: "Chaqueta Impermeable Trail",
    numero: "#48271",
    fecha: "12 mar 2025",
    estado: "Entregado",
    precio: "189,95€",
    entregado: true,
    img: "https://images.unsplash.com/photo-1721745848080-3ed6f21e7ba8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhcXVldGElMjBpbXBlcm1lYWJsZSUyMHRyYWlsfGVufDB8fDB8fHww",
  },
  {
    nombre: "Botas Trekking Summit",
    numero: "#48104",
    fecha: "28 feb 2025",
    estado: "En camino",
    precio: "229,00€",
    entregado: false,
    img: "https://images.unsplash.com/photo-1588585952982-9d062c9f39ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Qm90YXMlMjBUcmVra2luZ3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    nombre: "Mochila 30L Alpine",
    numero: "#47890",
    fecha: "5 ene 2025",
    estado: "Entregado",
    precio: "95,50€",
    entregado: true,
    img: "https://images.unsplash.com/photo-1509762774605-f07235a08f1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TW9jaGlsYXxlbnwwfHwwfHx8MA%3D%3D",
  },
];

const WISHLIST = [
  {
    nombre: "Fleece Summit Pro",
    precio: "149,95€",
    img: "https://images.unsplash.com/photo-1611417833111-284ac6508488?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmxlZWNlfGVufDB8fDB8fHww",
  },
  {
    nombre: "Pantalón Softshell",
    precio: "119,00€",
    img: "https://images.unsplash.com/photo-1734519241406-a84e29bbffc8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UGFudGFsJUMzJUIzbiUyMFNvZnRzaGVsbHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    nombre: "Gorro Merino",
    precio: "39,95€",
    img: "https://images.unsplash.com/photo-1644611390368-6b948e96dbea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z29ycm8lMjBtZXJpbm98ZW58MHx8MHx8fDA%3D",
  },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("datos");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "AM";

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

          {/* separador */}
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
              {ORDERS.map((order) => (
                <div key={order.numero} className={styles.orderRow}>
                  <img
                    src={order.img}
                    alt=" chaqueta"
                    className={styles.orderImg}
                  />
                  <div className={styles.orderInfo}>
                    <p>{order.nombre}</p>
                    <span>
                      Pedido {order.numero} · {order.fecha}
                    </span>
                  </div>
                  <span
                    className={
                      order.entregado
                        ? styles.statusDelivered
                        : styles.statusTransit
                    }
                  >
                    {order.estado}
                  </span>
                  <div className={styles.orderPrice}>{order.precio}</div>
                </div>
              ))}
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
