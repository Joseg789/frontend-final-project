import { useState } from "react";
import { toast } from "sonner";
import { useProducts } from "../context/ProductsContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

const TALLAS = ["S", "M", "L", "XL"];
const CATEGORIAS = ["Camisetas", "Pantalones", "Accesorios", "Zapatos"];
const GENEROS = ["Hombre", "Mujer"];

export default function ProductForm() {
  const { products, setProducts } = useProducts();
  const navigate = useNavigate();

  const [talla, setTalla] = useState("");
  const [categoria, setCategoria] = useState("");
  const [genero, setGenero] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!talla) return toast.error("Selecciona una talla");
    if (!categoria) return toast.error("Selecciona una categoría");
    if (!genero) return toast.error("Selecciona un género");

    const formData = new FormData(e.target);
    formData.set("talla", talla);
    formData.set("categoria", categoria);
    formData.set("genero", genero);

    try {
      setLoading(true);
      const response = await api.post("products", formData);
      const newProduct = response.data.data;
      setProducts([...products, newProduct]);
      toast.success("Producto creado correctamente");
      localStorage.removeItem("products"); //invalidamos el cache para recargar los productos
      e.target.reset();
      setTalla("");
      setCategoria("");
      setGenero("");
      setPreview(null);
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error al crear el producto",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>
        Crear Un Nuevo Producto
      </h2>

      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" name="nombre" placeholder="nombre" required />
        <input
          type="number"
          name="precio"
          placeholder="precio"
          step="0.01"
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="descripcion"
          required
        />

        {/* Género */}
        <div className="botones-grupo">
          <span className="grupo-label">Genero:</span>
          {GENEROS.map((g) => (
            <button
              key={g}
              type="button"
              className={`toggle-btn ${genero === g ? "active" : ""}`}
              onClick={() => setGenero(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Tallas */}
        <div className="botones-grupo">
          <span className="grupo-label">Talla:</span>
          {TALLAS.map((t) => (
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

        {/* Categorías */}
        <div className="botones-grupo">
          <span className="grupo-label">Categoría:</span>
          {CATEGORIAS.map((c) => (
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

        {/* Imagen */}
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleImgChange}
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              borderRadius: 8,
              marginTop: 8,
              border: "0.5px solid #e0e0e0",
            }}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Enviar"}
        </button>
      </form>
    </>
  );
}
