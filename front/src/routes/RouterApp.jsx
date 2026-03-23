import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import Navbar from "../components/Navbar";
import SearchResults from "../search/SearchResult";
import { useProducts } from "../context/ProductsContext";

function RouterApp() {
  const { products } = useProducts();
  return (
    <Router>
      <Navbar admin={false} />
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route
          path="/search/:query"
          element={<SearchResults products={products} />}
        />
      </Routes>
    </Router>
  );
}

export default RouterApp;
