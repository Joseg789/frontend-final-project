import { useState, useEffect } from "react";
import axios from "axios";
import {
  ShoppingBag,
  Users,
  AlertTriangle,
  AlertCircle,
  Info,
  Settings,
  CheckCheck,
  Trash2,
  Check,
  Bell,
} from "lucide-react";
import styles from "./Notifications.module.css";

const API_URL = import.meta.env.VITE_API_URL_BACKEND2;

// tipos de notificación
const TYPES = {
  order: {
    icon: ShoppingBag,
    iconClass: styles.iconOrder,
    badge: styles.badgeOrder,
    label: "Pedido",
  },
  user: {
    icon: Users,
    iconClass: styles.iconUser,
    badge: styles.badgeUser,
    label: "Usuario",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: styles.iconWarning,
    badge: styles.badgeWarning,
    label: "Alerta",
  },
  error: {
    icon: AlertCircle,
    iconClass: styles.iconError,
    badge: styles.badgeError,
    label: "Error",
  },
  info: {
    icon: Info,
    iconClass: styles.iconInfo,
    badge: styles.badgeInfo,
    label: "Info",
  },
  system: {
    icon: Settings,
    iconClass: styles.iconSystem,
    badge: styles.badgeSystem,
    label: "Sistema",
  },
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "Ahora mismo";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
  return `Hace ${Math.floor(diff / 86400)}d`;
};

// genera notificaciones a partir de órdenes y usuarios reales
const buildNotifications = (orders, users) => {
  const notifs = [];

  // órdenes recientes
  [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .forEach((order) => {
      if (order.estado === "pendiente") {
        notifs.push({
          id: `order-${order._id}`,
          type: "order",
          title: "Nuevo pedido recibido",
          message: `Pedido #${order._id?.slice(-6).toUpperCase()} de ${order.user?.email || "cliente"} por ${(order.total || 0).toFixed(2)}€`,
          date: order.createdAt,
          read: false,
        });
      }
      if (order.estado === "cancelado") {
        notifs.push({
          id: `cancel-${order._id}`,
          type: "warning",
          title: "Pedido cancelado",
          message: `El pedido #${order._id?.slice(-6).toUpperCase()} ha sido cancelado`,
          date: order.createdAt,
          read: false,
        });
      }
    });

  // usuarios recientes
  [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
    .forEach((user) => {
      notifs.push({
        id: `user-${user._id}`,
        type: "user",
        title: "Nuevo usuario registrado",
        message: `${user.email} se ha registrado en la plataforma`,
        date: user.createdAt,
        read: true,
      });
    });

  // notificaciones del sistema estáticas
  notifs.push(
    {
      id: "sys-1",
      type: "system",
      title: "Backup completado",
      message:
        "El backup automático de la base de datos se completó correctamente",
      date: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: true,
    },
    {
      id: "sys-2",
      type: "info",
      title: "Actualización disponible",
      message: "Hay una nueva versión del panel de administración disponible",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
  );

  return notifs.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export default function Notifications() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("todas");
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, usersRes] = await Promise.all([
          axios.get(`${API_URL}orders`, { withCredentials: true }),
          axios.get(`${API_URL}auth/users`, { withCredentials: true }),
        ]);
        setOrders(ordersRes.data);
        setUsers(usersRes.data);
        setNotifs(buildNotifications(ordersRes.data, usersRes.data));
      } catch {
        // si falla el backend usamos notificaciones de demo
        setNotifs(buildNotifications([], []));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filtered = notifs.filter((n) => {
    if (tab === "todas") return true;
    if (tab === "noLeidas") return !n.read;
    return n.type === tab;
  });

  const markAsRead = (id) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotif = (id) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  const deleteAll = () => {
    setNotifs([]);
  };

  const TABS = [
    { id: "todas", label: "Todas" },
    { id: "noLeidas", label: "No leídas", count: unreadCount },
    { id: "order", label: "Pedidos" },
    { id: "user", label: "Usuarios" },
    { id: "warning", label: "Alertas" },
    { id: "system", label: "Sistema" },
  ];

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Notificaciones {unreadCount > 0 && `(${unreadCount})`}</h2>
        <div className={styles.headerActions}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className={styles.btnMarkAll}>
              <CheckCheck size={14} /> Marcar todas como leídas
            </button>
          )}
          {notifs.length > 0 && (
            <button onClick={deleteAll} className={styles.btnMarkAll}>
              <Trash2 size={14} /> Limpiar todo
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className={styles.tabs}
        style={{ marginBottom: "1.25rem", flexWrap: "wrap" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
          >
            {t.label}
            {t.count > 0 && <span className={styles.tabBadge}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className={styles.empty}>Cargando notificaciones...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Bell size={20} />
          </div>
          No hay notificaciones
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((notif) => {
            const typeConfig = TYPES[notif.type] || TYPES.info;
            const Icon = typeConfig.icon;
            return (
              <div
                key={notif.id}
                className={`${styles.notifCard} ${!notif.read ? styles.unread : ""}`}
              >
                {/* Icono */}
                <div className={`${styles.iconWrap} ${typeConfig.iconClass}`}>
                  <Icon size={16} />
                </div>

                {/* Contenido */}
                <div className={styles.content}>
                  <div className={styles.contentTop}>
                    <p className={styles.title}>{notif.title}</p>
                    <span className={styles.time}>{timeAgo(notif.date)}</span>
                  </div>
                  <p className={styles.message}>{notif.message}</p>
                  <div className={styles.meta}>
                    <span className={`${styles.badge} ${typeConfig.badge}`}>
                      {typeConfig.label}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className={styles.notifActions}>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className={styles.btnIcon}
                      title="Marcar como leída"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(notif.id)}
                    className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Punto no leído */}
                {!notif.read && <div className={styles.unreadDot} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {!loading && notifs.length > 0 && (
        <div className={styles.footer}>
          <p className={styles.footerCount}>
            {filtered.length} notificacion{filtered.length !== 1 ? "es" : ""}
            {tab === "noLeidas" && ` sin leer`}
          </p>
        </div>
      )}
    </div>
  );
}
