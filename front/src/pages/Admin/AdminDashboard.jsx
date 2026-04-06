import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import AdminLayout from "./AdminLayout";
import { StatsCards } from "./StatsCards";
import { TrafficSources } from "./TrafficSources";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { RecentActivity } from "./RecentActivity";
import Chart from "./Chart";
import "./adminStyles.css";
import api from "../../api";

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

export default function AdminDashboard() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const isHome = pathname === "/admin";
  const nombre = user?.email?.split("@")[0] || "Admin";

  useEffect(() => {
    if (!isHome) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("orders");
        setOrders(res.data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isHome]);

  // — Ventas mensuales —
  const salesData = MONTHS.map((label, i) => ({
    label,
    value: orders.filter((o) => new Date(o.createdAt).getMonth() === i).length,
  }));

  // — Ingresos por categoría —
  const categoryMap = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const cat = item.categoria || "Otros";
      if (!categoryMap[cat]) categoryMap[cat] = 0;
      categoryMap[cat] += (item.precio || 0) * (item.quantity || 1);
    });
  });
  const revenueData = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value: parseFloat(value.toFixed(2)) }));

  // — Ganancias por género —
  const genMap = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const gen = item.genero || "Unisex";
      if (!genMap[gen]) genMap[gen] = 0;
      genMap[gen] += (item.precio || 0) * (item.quantity || 1);
    });
  });
  const genData = Object.entries(genMap)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value: parseFloat(value.toFixed(2)) }));

  return (
    <AdminLayout>
      {!isHome ? (
        <div className="dashboard-header">
          <Outlet />
        </div>
      ) : (
        <div className="dashboard-container">
          <div className="dashboard-welcome">
            <h1 className="dashboard-title">Bienvenido {nombre}</h1>
            <p className="dashboard-subtitle">
              Aquí está lo que está sucediendo con tu negocio hoy.
            </p>
          </div>

          <StatsCards />

          {loading ? (
            <p style={{ fontSize: 14, color: "#888", padding: "2rem 0" }}>
              Cargando datos...
            </p>
          ) : (
            <div className="dashboard-grid">
              <div className="dashboard-main">
                <TrafficSources />
                <PerformanceMetrics />

                {revenueData.length > 0 && (
                  <div className="card-admin">
                    <Chart title="Ingresos por Categoría" data={revenueData} />
                  </div>
                )}

                {genData.length > 0 && (
                  <div className="card-admin">
                    <Chart title="Ganancias por Género" data={genData} />
                  </div>
                )}
              </div>

              <div className="dashboard-sidebar">
                <RecentActivity />
                <div className="card-admin">
                  <Chart title="Pedidos por Mes" data={salesData} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
