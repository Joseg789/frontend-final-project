import AdminLayout from "./AdminLayout";
import { StatsCards } from "./StatsCards";
import { TrafficSources } from "./TrafficSources";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { RecentActivity } from "./RecentActivity";
import "./adminStyles.css";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Chart from "./Chart";

const salesData = [
  { label: "Marzo", value: 150 },
  { label: "Enero", value: 120 },
  { label: "Febrero", value: 95 },
  { label: "Abril", value: 80 },
  { label: "Mayo", value: 80 },
  { label: "Junio", value: 85 },
];

const revenueData = [
  { label: "Zapatos", value: 5000 },
  { label: "Pantalones", value: 4100 },
  { label: "Camisetas", value: 3200 },
  { label: "Accesorios", value: 2800 },
];

const genData = [
  { label: "Hombres", value: 4100 },
  { label: "Unisex", value: 3800 },
  { label: "Mujeres", value: 3800 },
  { label: "Niños", value: 2900 },
];
const AdminDashboard = () => {
  const location = useLocation();

  return (
    <>
      <AdminLayout>
        {location.pathname !== "/admin" ? (
          <div className="dashboard-header">
            {/**outlet para las rutas anidadas se muestran aquí */}
            <Outlet />
          </div>
        ) : (
          <div className="dashboard-container">
            <div className="dashboard-welcome">
              <h1 className="dashboard-title">Bienvenido Jose</h1>
              <p className="dashboard-subtitle">
                Aquí está lo que está sucediendo con tu negocio hoy.
              </p>
            </div>
            <StatsCards />
            <div className="dashboard-grid">
              <div className="dashboard-main">
                <TrafficSources />
                <PerformanceMetrics />
                <div className="card-admin">
                  <Chart title={"Ingresos por Categoría"} data={revenueData} />
                </div>
                <div className="card-admin">
                  <Chart title={"Ganancias por Género"} data={genData} />
                </div>
              </div>
              <div className="dashboard-sidebar">
                <RecentActivity />
                <div>
                  <div className="card-admin">
                    <Chart title={"Ventas Mensuales"} data={salesData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
