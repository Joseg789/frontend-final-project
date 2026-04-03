import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import RouterApp from "./routes/RouterApp.jsx";
import { CartProvider } from "./context/cart/CartContext.jsx";
import { AuthProvider } from "./context/auth/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <RouterApp />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  </StrictMode>,
);
