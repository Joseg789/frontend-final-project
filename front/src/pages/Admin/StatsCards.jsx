import { useEffect, useState } from "react";
import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import api from "../../api";

export const StatsCards = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          api.get("orders"),
          api.get("auth/users"),
        ]);
        setOrders(ordersRes.data);
        setUsers(usersRes.data);
      } catch {
        //  dashboard padre ya maneja errores
      }
    };
    fetchData();
  }, []);

  // — Métricas —
  const totalUsers = users.length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.estado === "entregado").length;
  const conversion =
    totalOrders > 0 ? ((delivered / totalOrders) * 100).toFixed(1) : "0.0";

  // — Comparativa mes anterior vs mes actual —
  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;

  const ordersThisMonth = orders.filter(
    (o) => new Date(o.createdAt).getMonth() === thisMonth,
  ).length;
  const ordersLastMonth = orders.filter(
    (o) => new Date(o.createdAt).getMonth() === lastMonth,
  ).length;
  const ordersDiff =
    ordersLastMonth > 0
      ? (((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100).toFixed(
          1,
        )
      : null;

  const revenueThisMonth = orders
    .filter((o) => new Date(o.createdAt).getMonth() === thisMonth)
    .reduce((acc, o) => acc + (o.total || 0), 0);
  const revenueLastMonth = orders
    .filter((o) => new Date(o.createdAt).getMonth() === lastMonth)
    .reduce((acc, o) => acc + (o.total || 0), 0);
  const revenueDiff =
    revenueLastMonth > 0
      ? (
          ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) *
          100
        ).toFixed(1)
      : null;

  const usersThisMonth = users.filter(
    (u) => new Date(u.createdAt).getMonth() === thisMonth,
  ).length;
  const usersLastMonth = users.filter(
    (u) => new Date(u.createdAt).getMonth() === lastMonth,
  ).length;
  const usersDiff =
    usersLastMonth > 0
      ? (((usersThisMonth - usersLastMonth) / usersLastMonth) * 100).toFixed(1)
      : null;

  const formatDiff = (diff) => {
    if (diff === null) return "Sin datos del mes anterior";
    const positive = parseFloat(diff) >= 0;
    return `${positive ? "+" : ""}${diff}% respecto al mes anterior`;
  };

  const stats = [
    {
      title: "Usuarios",
      value: totalUsers.toLocaleString("es-ES"),
      change: formatDiff(usersDiff),
      positive: usersDiff === null ? true : parseFloat(usersDiff) >= 0,
      icon: Users,
      iconClass: "icon-info",
    },
    {
      title: "Ingresos",
      value: `${totalRevenue.toFixed(2)}€`,
      change: formatDiff(revenueDiff),
      positive: revenueDiff === null ? true : parseFloat(revenueDiff) >= 0,
      icon: DollarSign,
      iconClass: "icon-success",
    },
    {
      title: "Pedidos",
      value: totalOrders.toLocaleString("es-ES"),
      change: formatDiff(ordersDiff),
      positive: ordersDiff === null ? true : parseFloat(ordersDiff) >= 0,
      icon: ShoppingCart,
      iconClass: "icon-warning",
    },
    {
      title: "Tasa de entrega",
      value: `${conversion}%`,
      change: `${delivered} pedidos entregados`,
      positive: true,
      icon: TrendingUp,
      iconClass: "icon-success",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.title} className="stat-card">
          <div className="stat-header">
            <div>
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
            <div className={`stat-icon-wrapper ${stat.iconClass}`}>
              <stat.icon className="stat-icon" />
            </div>
          </div>
          <p
            className={`stat-change ${stat.positive ? "positive" : "negative"}`}
          >
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
};
