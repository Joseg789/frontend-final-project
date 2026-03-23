import axios from "axios";
import { useProducts } from "../context/ProductsContext";
function ProductForm() {
  const { products, setProducts } = useProducts();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      //enviar datos
      const response = await axios.post(
        "http://localhost:4000/products", //url del backend
        formData, //datos de mi formulario
      );
      const newProduct = response.data.data;
      setProducts([...products, newProduct]);
      e.target.reset();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <input type="text" name="nombre" placeholder="nombre" required />
      <input type="text" name="precio" placeholder="precio" required />
      <input
        type="text"
        name="descripcion"
        placeholder="descripcion"
        required
      />
      <input type="text" name="talla" placeholder="talla" required />
      <input type="text" name="categoria" placeholder="categoria" required />
      <input type="file" name="imagen" />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default ProductForm;
