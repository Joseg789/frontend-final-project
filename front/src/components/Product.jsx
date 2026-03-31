import { Plus } from "lucide-react";
import { toast } from "sonner";
function Product({ product }) {
  const handleAddToCart = () => {
    //alerta con sonner
    toast.success(`Agregado ${product.nombre} al carrito 🛒`);
  };
  return (
    <>
      <img src={product.imagen || null} alt={`Imagen de ${product.nombre}`} />
      <div className="card-body">
        <span className="card-categoria">{product.categoria ?? ""}</span>
        <h2 className="card-nombre">{product.nombre}</h2>
        <p className="card-descripcion">{product.descripcion}</p>
        <p className="card-descripcion">{product.genero}</p>
        <p className="card-talla">Talla: {product.talla}</p>
        <p className="card-precio">{product.precio}€</p>
        <button
          className="card-add-btn"
          onClick={handleAddToCart}
          aria-label={`Agregar ${product.nombre} al carrito`}
        >
          <Plus className="card-add" />
        </button>
      </div>
    </>
  );
}

export default Product;
