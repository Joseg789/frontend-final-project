import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import Navbar from "../components/Navbar";
import SearchResults from "../search/SearchResult";
import Nosotros from "../components/Nosotros";
import Category from "../components/Category";
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
import GenderProducts from "../pages/GenderProducts";
import Footer from "../components/Footer";
import Register from "../pages/Register";
import { useAuth } from "../context/auth/AuthContext";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import CheckoutSuccess from "../pages/Checkout/CheckoutSuccess";
import Checkout from "../pages/Checkout/Checkout";
import ProductsDashboard from "../pages/Admin/pages/ProductsDashboard";
import Spinner from "../components/icons/Spinner";
import Contact from "../pages/Contact";
import Shipping from "../pages/Shipping";
import ProductDetail from "../components/ProductDetail";
function RouterApp() {
  const { loading } = useAuth();

  if (loading) return <Spinner />;

  return (
    <>
      <Toaster position="top-right" duration={1500} closeButton richColors />
      <Router>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<App />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/categoria/:category" element={<Category />} />
          <Route path="/hombre" element={<GenderProducts gender="hombre" />} />
          <Route path="/mujer" element={<GenderProducts gender="mujer" />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          {/* Rutas protegidas — usuario logueado */}
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          {/* CHECKOUT */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/success"
            element={
              <ProtectedRoute>
                <CheckoutSuccess />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas — solo admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute esAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/crear" element={<ProductForm />} />
            <Route path="/admin/products" element={<ProductsDashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="/admin/editar" element={<ProductForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default RouterApp;
