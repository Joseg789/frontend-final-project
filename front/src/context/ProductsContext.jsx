import { useState, createContext, useContext, useCallback } from "react";

export const ProductsContext = createContext();

const API_URL = import.meta.env.VITE_API_URL_BACKEND2;

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const cached = localStorage.getItem("products");
    return cached ? JSON.parse(cached) : [];
  });

  const getProducts = useCallback(async () => {
    if (products.length > 0) return; // ya cargados

    try {
      const response = await fetch(import.meta.env.VITE_API_URL_BACKEND);
      const { data } = await response.json();
      setProducts(data);
      localStorage.setItem("products", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  }, [products.length]);

  const updateProduct = async (id, formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await axios.put(`${API_URL}products/${id}`, formData, {
      withCredentials: true,
      headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {},
    });
    const updated = res.data.data || res.data;
    setProducts((prev) => {
      const newProducts = prev.map((p) =>
        p._id === id ? { ...p, ...updated } : p,
      );
      localStorage.setItem("products", JSON.stringify(newProducts)); // actualiza caché
      return newProducts;
    });
    return updated;
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}products/${id}`, { withCredentials: true });
    setProducts((prev) => {
      const newProducts = prev.filter((p) => p._id !== id);
      localStorage.setItem("products", JSON.stringify(newProducts)); // actualiza caché
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
