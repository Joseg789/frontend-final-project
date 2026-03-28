import axios from "axios";
import { useState } from "react";
import { useProducts } from "../context/ProductsContext";

function ProductForm() {
  const { products, setProducts } = useProducts();
  const [talla, setTalla] = useState("");
  const [categoria, setCategoria] = useState("");
  const [genero, SetGenero] = useState("");

  const tallas = ["S", "M", "L", "XL"];
  const categorias = ["Camisetas", "Pantalones", "Accesorios", "Zapatos"];
  const generos = ["Hombre", "Mujer"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.set("talla", talla); // agregamos la talla
    formData.set("categoria", categoria); // agregamos la categoría
    formData.set("genero", genero); // agregamos el genero

    try {
      const response = await axios.post(
        "http://localhost:4000/products",
        formData,
      );
      const newProduct = response.data.data;
      setProducts([...products, newProduct]);
      e.target.reset();
      setTalla("");
      setCategoria("");
      SetGenero("");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input type="text" name="nombre" placeholder="nombre" required />
      <input type="text" name="precio" placeholder="precio" required />
      <input
        type="text"
        name="descripcion"
        placeholder="descripcion"
        required
      />
      <div className="botones-grupo">
        <span className="grupo-label">Genero:</span>
        {generos.map((g) => (
          <button
            key={g}
            type="button"
            className={`toggle-btn ${genero === g ? "active" : ""}`}
            onClick={() => SetGenero(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Botones para Tallas */}
      <div className="botones-grupo">
        <span className="grupo-label">Talla:</span>
        {tallas.map((t) => (
          <button
            key={t}
            type="button"
            className={`toggle-btn ${talla === t ? "active" : ""}`}
            onClick={() => setTalla(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Botones para Categorías */}
      <div className="botones-grupo">
        <span className="grupo-label">Categoría:</span>
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            className={`toggle-btn ${categoria === c ? "active" : ""}`}
            onClick={() => setCategoria(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <input type="file" name="imagen" />

      <button type="submit">Enviar</button>
    </form>
  );
}

export default ProductForm;
