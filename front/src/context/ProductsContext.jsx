import { useState, createContext, useContext } from "react";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]); //nuestro estado
  //FUNCIONES QUE MODIFICAN Y CAMBIAN NUESTRO ESTADO
  const getProducts = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL_BACKEND);
      const { data } = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };
  //OTRAS FUNCIONES
  return (
    <ProductsContext.Provider value={{ getProducts, setProducts, products }}>
      {children}
    </ProductsContext.Provider>
  );
};
//hook useProducts
export const useProducts = () => useContext(ProductsContext);
