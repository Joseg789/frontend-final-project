import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import Navbar from "../components/Navbar";
import SearchResults from "../search/SearchResult";
import { useProducts } from "../context/ProductsContext";
import Nosotros from "../components/Nosotros";
import Category from "../components/Category";
import Hombre from "../pages/Hombre";
import Mujer from "../pages/Mujer";
import Admin from "../pages/Admin";
import Logout from "../pages/Logout";
import Login from "../pages/Login";
import ProductForm from "../components/ProductForm";
import Home from "../pages/Home";

function RouterApp() {
  const { products } = useProducts();
  return (
    <Router>
      <Navbar admin={true} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/productos" element={<App />}></Route>
        <Route
          path="/search/:query"
          element={<SearchResults products={products} />}
        />
        <Route
          path="/camisetas"
          element={<Category category={"camisetas"} />}
        ></Route>
        <Route
          path="/pantalones"
          element={<Category category={"pantalones"} />}
        ></Route>
        <Route
          path="/zapatos"
          element={<Category category={"zapatos"} />}
        ></Route>
        <Route
          path="/accesorios"
          element={<Category category={"accesorios"} />}
        ></Route>
        <Route path="/hombre" element={<Hombre />}></Route>
        <Route path="/mujer" element={<Mujer />}></Route>
        <Route path="/nosotros" element={<Nosotros />}></Route>
        <Route path="/login" element={<Login />}></Route>
        {/* rutas protegidas con auth */}
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/crear" element={<ProductForm />}></Route>
      </Routes>
    </Router>
  );
}

export default RouterApp;
