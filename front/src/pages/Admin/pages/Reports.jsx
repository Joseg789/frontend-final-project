import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./Reports.module.css";

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
const COLORS = ["#3B6D11", "#854F0B", "#a32d2d", "#185FA5", "#534AB7"];
const FILLS = [
  styles.progressFillGreen,
  styles.progressFillAmber,
  styles.progressFillRed,
  styles.progressFillBlue,
  styles.progressFillPurple,
];

export default function Reports() {
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
        toast.error("Error al cargar los reportes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // — Métricas base —
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.estado === "entregado").length;
  const cancelled = orders.filter((o) => o.estado === "cancelado").length;
  const conversionRate =
    totalOrders > 0 ? ((delivered / totalOrders) * 100).toFixed(1) : 0;
  const cancellationRate =
    totalOrders > 0 ? ((cancelled / totalOrders) * 100).toFixed(1) : 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const revenuePerUser = users.length > 0 ? totalRevenue / users.length : 0;

  // — Ingresos por mes —
  const revenueByMonth = MONTHS.map((mes, i) => {
    const monthOrders = orders.filter(
      (o) => new Date(o.createdAt).getMonth() === i,
    );
    return {
      mes,
      ingresos: parseFloat(
        monthOrders.reduce((acc, o) => acc + (o.total || 0), 0).toFixed(2),
      ),
      pedidos: monthOrders.length,
    };
  });

  // — Pedidos por estado —
  const estadoMap = {};
  orders.forEach((o) => {
    estadoMap[o.estado] = (estadoMap[o.estado] || 0) + 1;
  });
  const estadoData = Object.entries(estadoMap).map(([name, value]) => ({
    name,
    value,
  }));

  // — Top productos —
  const productMap = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      if (!productMap[item.nombre])
        productMap[item.nombre] = { cantidad: 0, ingresos: 0 };
      productMap[item.nombre].cantidad += item.quantity || 1;
      productMap[item.nombre].ingresos +=
        (item.precio || 0) * (item.quantity || 1);
    });
  });
  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1].ingresos - a[1].ingresos)
    .slice(0, 5)
    .map(([nombre, data]) => ({ nombre, ...data }));

  // — Usuarios por mes —
  const usersByMonth = MONTHS.map((mes, i) => ({
    mes,
    usuarios: users.filter((u) => new Date(u.createdAt).getMonth() === i)
      .length,
  }));

  // — Exportar CSV —
  const exportCSV = () => {
    const rows = [
      ["Mes", "Ingresos", "Pedidos"],
      ...revenueByMonth.map((r) => [r.mes, r.ingresos, r.pedidos]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Reporte exportado");
  };

  if (loading)
    return <div className={styles.loading}>Cargando reportes...</div>;

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Reportes</h2>
        <div className={styles.headerActions}>
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
          <button onClick={exportCSV} className={styles.btnExport}>
            <Download size={14} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        <KpiCard
          label="Ingresos totales"
          value={`${totalRevenue.toFixed(2)}€`}
          sub={`${totalOrders} pedidos`}
          trend={+12}
        />
        <KpiCard
          label="Ticket medio"
          value={`${avgOrderValue.toFixed(2)}€`}
          sub="por pedido"
          trend={+4}
        />
        <KpiCard
          label="Tasa de entrega"
          value={`${conversionRate}%`}
          sub={`${delivered} entregados`}
          trend={+6}
        />
        <KpiCard
          label="Tasa de cancelación"
          value={`${cancellationRate}%`}
          sub={`${cancelled} cancelados`}
          trend={-2}
        />
      </div>

      {/* Ingresos por mes — área */}
      <div
        className={`${styles.chartCard} ${styles.full}`}
        style={{ marginBottom: "1.5rem" }}
      >
        <p className={styles.chartTitle}>Evolución de ingresos</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueByMonth}>
            <defs>
              <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2C2C2A" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2C2C2A" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              width={55}
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
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#2C2C2A"
              strokeWidth={2}
              fill="url(#gradIngresos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos secundarios */}
      <div className={styles.chartsRow}>
        {/* Pedidos por mes */}
        <div className={styles.chartCard}>
          <p className={styles.chartTitle}>Pedidos por mes</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByMonth} barSize={24}>
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
                width={25}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "0.5px solid #e0e0e0",
                }}
              />
              <Bar dataKey="pedidos" fill="#2C2C2A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por estado */}
        <div className={styles.chartCard}>
          <p className={styles.chartTitle}>Distribución por estado</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={estadoData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {estadoData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "0.5px solid #e0e0e0",
                }}
              />
              <Legend
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fila inferior */}
      <div className={styles.bottomRow}>
        {/* Top productos por ingresos */}
        <div className={styles.card}>
          <p className={styles.chartTitle}>Top productos</p>
          {topProducts.length === 0 ? (
            <p className={styles.empty}>Sin datos</p>
          ) : (
            topProducts.map((p, i) => {
              const max = topProducts[0].ingresos;
              return (
                <div key={p.nombre} className={styles.progressWrap}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressName}>{p.nombre}</span>
                    <span className={styles.progressValue}>
                      {p.ingresos.toFixed(0)}€
                    </span>
                  </div>
                  <div className={styles.progressBg}>
                    <div
                      className={`${styles.progressFill} ${FILLS[i % FILLS.length]}`}
                      style={{ width: `${(p.ingresos / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Resumen por estado */}
        <div className={styles.card}>
          <p className={styles.chartTitle}>Resumen estados</p>
          {estadoData.length === 0 ? (
            <p className={styles.empty}>Sin datos</p>
          ) : (
            estadoData.map((e, i) => (
              <div key={e.name} className={styles.statusRow}>
                <div
                  className={styles.statusDot}
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <div className={styles.statusInfo}>
                  <div className={styles.statusName}>
                    {e.name.charAt(0).toUpperCase() + e.name.slice(1)}
                  </div>
                  <div className={styles.statusCount}>{e.value} pedidos</div>
                </div>
                <span className={styles.statusPct}>
                  {totalOrders > 0
                    ? ((e.value / totalOrders) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            ))
          )}
        </div>

        {/* Métricas financieras */}
        <div className={styles.card}>
          <p className={styles.chartTitle}>Finanzas</p>
          <div className={styles.reportRow}>
            <span className={styles.reportLabel}>Ingresos totales</span>
            <span className={styles.reportValue}>
              {totalRevenue.toFixed(2)}€
            </span>
          </div>
          <div className={styles.reportRow}>
            <span className={styles.reportLabel}>Ticket medio</span>
            <span className={styles.reportValue}>
              {avgOrderValue.toFixed(2)}€
            </span>
          </div>
          <div className={styles.reportRow}>
            <span className={styles.reportLabel}>Ingreso por usuario</span>
            <span className={styles.reportValue}>
              {revenuePerUser.toFixed(2)}€
            </span>
          </div>
          <div className={styles.reportRow}>
            <span className={styles.reportLabel}>Total pedidos</span>
            <span className={styles.reportValue}>{totalOrders}</span>
          </div>
          <div className={styles.reportRow}>
            <span className={styles.reportLabel}>Tasa entrega</span>
            <span className={`${styles.badge} ${styles.badgeGreen}`}>
              {conversionRate}%
            </span>
          </div>
          <div className={styles.reportRow}>
            <span className={styles.reportLabel}>Tasa cancelación</span>
            <span className={`${styles.badge} ${styles.badgeRed}`}>
              {cancellationRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, trend }) {
  const positive = trend >= 0;
  return (
    <div className={styles.kpiCard}>
      <p className={styles.kpiLabel}>{label}</p>
      <p className={styles.kpiValue}>{value}</p>
      <p className={styles.kpiSub}>{sub}</p>
      <div
        className={`${styles.kpiTrend} ${positive ? styles.trendUp : styles.trendDown}`}
      >
        {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {Math.abs(trend)}% vs mes anterior
      </div>
    </div>
  );
}
