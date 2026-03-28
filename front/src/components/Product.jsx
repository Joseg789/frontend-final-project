function Product({ product }) {
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
      </div>
    </>
  );
}

export default Product;
