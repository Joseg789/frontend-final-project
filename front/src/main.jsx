import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import RouterApp from "./routes/RouterApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductsProvider>
      <RouterApp></RouterApp>
    </ProductsProvider>
  </StrictMode>,
);
