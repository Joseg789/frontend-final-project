import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  MessageSquare,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../../context/auth/AuthContext";
import api from "../../api";

export const TopBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const initials = user?.email?.slice(0, 2).toUpperCase() || "AD";

  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const [ordersRes] = await Promise.all([api.get("orders")]);
        const orders = ordersRes.data;
        const pending = orders
          .filter((o) => o.estado === "pendiente")
          .slice(0, 5)
          .map((o) => ({
            id: o._id,
            title: "Nuevo pedido pendiente",
            message: `#${o._id?.slice(-6).toUpperCase()} — ${(o.total || 0).toFixed(2)}€`,
            date: o.createdAt,
            read: false,
          }));
        const cancelled = orders
          .filter((o) => o.estado === "cancelado")
          .slice(0, 3)
          .map((o) => ({
            id: `cancel-${o._id}`,
            title: "Pedido cancelado",
            message: `#${o._id?.slice(-6).toUpperCase()} ha sido cancelado`,
            date: o.createdAt,
            read: false,
          }));
        const all = [...pending, ...cancelled]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);
        setNotifs(all);
        setUnread(all.filter((n) => !n.read).length);
      } catch {
        setNotifs([]);
      }
    };
    fetchNotifs();
  }, []);

  // cerrar al click fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "Ahora";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search className="search-icon" />
        <input type="text" placeholder="Buscar..." className="search-input" />
      </div>

      <div className="topbar-actions">
        {/* Bell con dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button className="icon-button" onClick={handleOpen}>
            <Bell className="icon" />
            {unread > 0 && (
              <span
                className="notification-dot"
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#a32d2d",
                  display: "block",
                }}
              />
            )}
          </button>

          {open && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 300,
                background: "#fff",
                border: "0.5px solid #e0e0e0",
                borderRadius: 12,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                zIndex: 9999,
                overflow: "hidden",
              }}
            >
              {/* Header dropdown */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom: "0.5px solid #f0f0f0",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>
                  Notificaciones {unread > 0 && `(${unread})`}
                </span>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      fontSize: 11,
                      color: "#888",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Marcar todas leídas
                  </button>
                )}
              </div>

              {/* Lista */}
              {notifs.length === 0 ? (
                <p
                  style={{
                    fontSize: 13,
                    color: "#888",
                    textAlign: "center",
                    padding: "1.5rem",
                  }}
                >
                  Sin notificaciones
                </p>
              ) : (
                notifs.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "10px 16px",
                      background: n.read ? "#fff" : "#fafafa",
                      borderBottom: "0.5px solid #f5f5f5",
                      borderLeft: n.read ? "none" : "3px solid #2c2c2a",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#111",
                          margin: "0 0 2px",
                        }}
                      >
                        {n.title}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#888",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {n.message}
                      </p>
                    </div>
                    <span
                      style={{ fontSize: 11, color: "#bbb", flexShrink: 0 }}
                    >
                      {timeAgo(n.date)}
                    </span>
                  </div>
                ))
              )}

              {/* Footer */}
              <div
                onClick={() => {
                  navigate("/admin/notifications");
                  setOpen(false);
                }}
                style={{
                  padding: "10px 16px",
                  textAlign: "center",
                  fontSize: 12,
                  color: "#555",
                  cursor: "pointer",
                  borderTop: "0.5px solid #f0f0f0",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                Ver todas las notificaciones
              </div>
            </div>
          )}
        </div>

        <button className="icon-button">
          <MessageSquare className="icon" />
        </button>

        <button
          className="icon-button"
          onClick={() => navigate("/admin/settings")}
        >
          <SettingsIcon className="icon" />
        </button>

        <div
          className="avatar"
          title={user?.email}
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
};
