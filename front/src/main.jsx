import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import RouterApp from "./routes/RouterApp.jsx";
import { CartProvider } from "./context/cart/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductsProvider>
      <CartProvider>
        <RouterApp />
      </CartProvider>
    </ProductsProvider>
  </StrictMode>,
);
