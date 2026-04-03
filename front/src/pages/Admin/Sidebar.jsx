import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Users as UsersIcon,
  ShoppingCart,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  ChevronLeft,
  Plus,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: UsersIcon, label: "Users", path: "/admin/users" },
  { icon: Plus, label: "Create Product", path: "/admin/crear" },
  { icon: ShoppingCart, label: "Ordenes", path: "/admin/orders" },
  { icon: FileText, label: "Reportes", path: "/admin/reports" },
  { icon: Bell, label: "Notificationes", path: "/admin/notifications" },
  { icon: Settings, label: "Ajustes", path: "/admin/settings" },
  { icon: HelpCircle, label: "Ayuda", path: "/admin/help" },
];

export const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-logo">AdminPro</span>}
        <button className="sidebar-toggle" onClick={onToggle}>
          <ChevronLeft
            className={`toggle-icon ${collapsed ? "rotated" : ""}`}
          />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <item.icon className="nav-icon" />
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
