import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import Navbar from "../components/Navbar";
import SearchResults from "../search/SearchResult";
import { useProducts } from "../context/ProductsContext";
import Nosotros from "../components/Nosotros";
import Category from "../components/Category";
import Hombre from "../pages/Hombre";
import Mujer from "../pages/Mujer";
import Logout from "../pages/Logout";
import Login from "../pages/Login";
import ProductForm from "../components/ProductForm";
import Home from "../pages/Home";
import Analytics from "../pages/Admin/pages/Analitics";
import Users from "../pages/Admin/pages/Users";
import Orders from "../pages/Admin/pages/Orders";
import Reports from "../pages/Admin/pages/Reports";
import Notifications from "../pages/Admin/pages/Notifications";
import Settings from "../pages/Admin/pages/Settings";
import Help from "../pages/Admin/pages/Help";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Cart from "../pages/Cart";
import { Toaster } from "sonner";
import { color } from "framer-motion";

function RouterApp() {
  const { products } = useProducts();
  return (
    <>
      <Toaster position="top-right" duration={1500} closeButton richColors />
      <Router>
        <Navbar admin={false} />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/productos" element={<App />}></Route>
          <Route
            path="/search/:query"
            element={<SearchResults products={products} />}
          />
          <Route path="/categoria/:category" element={<Category />} />
          <Route path="/hombre" element={<Hombre />}></Route>
          <Route path="/mujer" element={<Mujer />}></Route>
          <Route path="/nosotros" element={<Nosotros />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          {/* rutas protegidas con auth */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute esAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="analytics" element={<Analytics />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route path="/crear" element={<ProductForm />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default RouterApp;
