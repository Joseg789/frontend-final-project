import { useState, createContext, useContext, useCallback } from "react";
import api from "../api";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const cached = localStorage.getItem("products");
    return cached ? JSON.parse(cached) : [];
  });

  const getProducts = useCallback(async () => {
    if (products.length > 0) return; // ya cargados — no llama a la API

    try {
      const response = await api.get("products");
      const data = response.data.data || response.data; // ✅ axios ya parsea
      setProducts(data);
      localStorage.setItem("products", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  }, [products.length]);

  const updateProduct = async (id, formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await api.put(`products/${id}`, formData, {
      headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {},
    });
    const updated = res.data.data || res.data;
    setProducts((prev) => {
      const newProducts = prev.map((p) =>
        p._id === id ? { ...p, ...updated } : p,
      );
      localStorage.setItem("products", JSON.stringify(newProducts));
      return newProducts;
    });
    return updated;
  };

  const deleteProduct = async (id) => {
    await api.delete(`products/${id}`);
    setProducts((prev) => {
      const newProducts = prev.filter((p) => p._id !== id);
      localStorage.setItem("products", JSON.stringify(newProducts));
      return newProducts;
    });
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        getProducts,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
