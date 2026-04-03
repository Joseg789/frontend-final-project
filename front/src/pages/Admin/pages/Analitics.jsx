import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  ShoppingBag,
  Users,
  TrendingUp,
  PackageCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import styles from "./Analytics.module.css";

const API_URL = import.meta.env.VITE_API_URL_BACKEND2;
const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export default function Analytics() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("month");

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
      } catch {
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // — Métricas —
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const delivered = orders.filter((o) => o.estado === "entregado").length;
  const pending = orders.filter((o) => o.estado === "pendiente").length;
  const cancelled = orders.filter((o) => o.estado === "cancelado").length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // — Ingresos por mes —
  const revenueByMonth = MONTHS.map((mes, i) => ({
    mes,
    ingresos: orders
      .filter((o) => new Date(o.createdAt).getMonth() === i)
      .reduce((acc, o) => acc + (o.total || 0), 0),
  }));

  // — Pedidos por estado —
  const statusData = [
    { name: "Entregados", value: delivered, color: "#3B6D11" },
    { name: "Pendientes", value: pending, color: "#854F0B" },
    { name: "Cancelados", value: cancelled, color: "#a32d2d" },
  ];

  // — Top productos —
  const productMap = {};
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      if (!productMap[item.nombre]) productMap[item.nombre] = 0;
      productMap[item.nombre] += item.quantity || 1;
    });
  });
  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }));

  // — Pedidos recientes —
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  if (loading) return <div className={styles.loading}>Cargando datos...</div>;

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Analytics</h2>
        <div className={styles.rangeTabs}>
          {["week", "month", "year"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`${styles.rangeTab} ${range === r ? styles.rangeTabActive : ""}`}
            >
              {r === "week" ? "Semana" : r === "month" ? "Mes" : "Año"}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        <KpiCard
          icon={<TrendingUp size={18} />}
          label="Ingresos totales"
          value={`${totalRevenue.toFixed(2)}€`}
          trend={+12}
          color="green"
        />
        <KpiCard
          icon={<ShoppingBag size={18} />}
          label="Pedidos totales"
          value={totalOrders}
          trend={+8}
          color="blue"
        />
        <KpiCard
          icon={<Users size={18} />}
          label="Usuarios"
          value={totalUsers}
          trend={+5}
          color="purple"
        />
        <KpiCard
          icon={<PackageCheck size={18} />}
          label="Ticket medio"
          value={`${avgOrderValue.toFixed(2)}€`}
          trend={-2}
          color="amber"
        />
      </div>

      {/* Gráficos */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <p className={styles.chartTitle}>Ingresos por mes</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueByMonth}>
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 11, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v) => `${v}€`}
              />
              <Tooltip
                formatter={(v) => [`${v.toFixed(2)}€`, "Ingresos"]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "0.5px solid #e0e0e0",
                }}
              />
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="#2C2C2A"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <p className={styles.chartTitle}>Pedidos por estado</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} barSize={32}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "0.5px solid #e0e0e0",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fila inferior */}
      <div className={styles.bottomRow}>
        {/* Top productos */}
        <div className={styles.card}>
          <p className={styles.chartTitle}>Top productos</p>
          {topProducts.length === 0 ? (
            <p className={styles.empty}>Sin datos</p>
          ) : (
            topProducts.map((p, i) => {
              const max = topProducts[0].cantidad;
              return (
                <div key={p.nombre} className={styles.topRow}>
                  <span className={styles.topRank}>{i + 1}</span>
                  <div className={styles.topInfo}>
                    <div className={styles.topMeta}>
                      <span className={styles.topName}>{p.nombre}</span>
                      <span className={styles.topCount}>{p.cantidad} uds</span>
                    </div>
                    <div className={styles.progressBg}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${(p.cantidad / max) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pedidos recientes */}
        <div className={styles.card}>
          <p className={styles.chartTitle}>Pedidos recientes</p>
          {recentOrders.length === 0 ? (
            <p className={styles.empty}>Sin pedidos</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order._id} className={styles.orderRow}>
                <div className={styles.orderInfo}>
                  <span className={styles.orderId}>
                    #{order._id?.slice(-6).toUpperCase()}
                  </span>
                  <span className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <div className={styles.orderRight}>
                  <StatusBadge estado={order.estado} />
                  <span className={styles.orderTotal}>
                    {(order.total || 0).toFixed(2)}€
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, trend, color }) {
  const positive = trend >= 0;
  return (
    <div className={`${styles.kpiCard} ${styles[`kpi-${color}`]}`}>
      <div className={styles.kpiIcon}>{icon}</div>
      <div>
        <p className={styles.kpiLabel}>{label}</p>
        <p className={styles.kpiValue}>{value}</p>
      </div>
      <div
        className={`${styles.kpiTrend} ${positive ? styles.trendUp : styles.trendDown}`}
      >
        {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {Math.abs(trend)}%
      </div>
    </div>
  );
}

function StatusBadge({ estado }) {
  const map = {
    entregado: styles.statusDelivered,
    pendiente: styles.statusPending,
    cancelado: styles.statusCancelled,
  };
  return (
    <span
      className={`${styles.statusBadge} ${map[estado] || styles.statusPending}`}
    >
      {estado || "pendiente"}
    </span>
  );
}
