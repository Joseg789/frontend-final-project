import { useState, useEffect } from "react";
import { UserPlus, ShoppingCart, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./adminStyles.css";

const timeAgo = (date) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "—";
  const diff = Math.floor((Date.now() - parsed.getTime()) / 1000);
  if (diff < 60) return "Ahora mismo";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
  return `Hace ${Math.floor(diff / 86400)}d`;
};

const buildActivities = (orders, users) => {
  const activities = [];

  // pedidos recientes
  [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .forEach((order) => {
      activities.push({
        icon: ShoppingCart,
        iconBgClass: "icon-success",
        title: "Nuevo pedido recibido",
        description: `Pedido #${order._id?.slice(-6).toUpperCase()} — ${(order.total || 0).toFixed(2)}€`,
        time: timeAgo(order.createdAt),
        date: new Date(order.createdAt),
      });
    });

  // usuarios recientes
  [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
    .forEach((user) => {
      activities.push({
        icon: UserPlus,
        iconBgClass: "icon-info",
        title: "Nuevo usuario registrado",
        description: user.email,
        time: timeAgo(user.createdAt),
        date: new Date(user.createdAt),
      });
    });

  // pedidos cancelados
  [...orders]
    .filter((o) => o.estado === "cancelado")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2)
    .forEach((order) => {
      activities.push({
        icon: AlertCircle,
        iconBgClass: "icon-destructive",
        title: "Pedido cancelado",
        description: `Pedido #${order._id?.slice(-6).toUpperCase()} cancelado`,
        time: timeAgo(order.createdAt),
        date: new Date(order.createdAt),
      });
    });

  // ordenar por fecha más reciente
  return activities.sort((a, b) => b.date - a.date).slice(0, 8);
};

export const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, usersRes] = await Promise.all([
          api.get("orders"),
          api.get("auth/users"),
        ]);
        setActivities(buildActivities(ordersRes.data, usersRes.data));
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="recent-activity-card">
      <h3 className="recent-activity-title">Actividad reciente</h3>

      <div className="activities-list">
        {loading ? (
          <p
            style={{
              fontSize: 13,
              color: "#888",
              padding: "1rem 0",
              textAlign: "center",
            }}
          >
            Cargando...
          </p>
        ) : activities.length === 0 ? (
          <p
            style={{
              fontSize: 13,
              color: "#888",
              padding: "1rem 0",
              textAlign: "center",
            }}
          >
            Sin actividad reciente
          </p>
        ) : (
          activities.map((a, i) => (
            <div key={i} className="activity-row">
              <div className={`activity-icon ${a.iconBgClass}`}>
                <a.icon className="icon-svg" />
              </div>
              <div className="activity-content">
                <p className="activity-title">{a.title}</p>
                <p className="activity-description">{a.description}</p>
                <p className="activity-time">{a.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        className="view-all-btn"
        onClick={() => navigate("/admin/notifications")}
      >
        Ver toda la actividad
      </button>
    </div>
  );
};
