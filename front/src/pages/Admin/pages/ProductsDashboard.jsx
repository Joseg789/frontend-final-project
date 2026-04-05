import { useState, useEffect } from "react";
import { useProducts } from "../../../context/ProductsContext";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, X, Package } from "lucide-react";
import styles from "./ProductsDashboard.module.css";

const CATEGORIAS = [
  "Camisetas",
  "Pantalones",
  "Zapatos",
  "Accesorios",
  "Chaquetas",
  "Otros",
];
const GENEROS = ["Hombre", "Mujer", "Unisex", "Niños"];
const TALLAS = ["XS", "S", "M", "L", "XL", "XXL", "Única"];

const EMPTY_FORM = {
  nombre: "",
  precio: "",
  descripcion: "",
  categoria: "Camisetas",
  genero: "Unisex",
  talla: "M",
  imagen: "",
};

export default function Products() {
  const { products, getProducts, updateProduct, deleteProduct } = useProducts();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await getProducts();
      setLoading(false);
    };
    load();
  }, []);

  // — Filtrado —
  const filtered = products.filter((p) => {
    const matchSearch =
      p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "todas" || p.categoria === filter;
    return matchSearch && matchFilter;
  });

  // — Modales —
  const openEdit = (product) => {
    setForm({
      nombre: product.nombre || "",
      precio: product.precio || "",
      descripcion: product.descripcion || "",
      categoria: product.categoria || "Camisetas",
      genero: product.genero || "Unisex",
      talla: product.talla || "M",
      imagen: product.imagen || "",
    });
    setImgPreview(product.imagen || "");
    setImgFile(null);
    setSelected(product);
    setModal("edit");
  };

  const openDelete = (product) => {
    setSelected(product);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(EMPTY_FORM);
    setImgFile(null);
    setImgPreview("");
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  // — Editar —
  const handleEdit = async () => {
    if (!form.nombre || !form.precio)
      return toast.error("Nombre y precio son obligatorios");

    try {
      setSaving(true);

      if (imgFile) {
        const formData = new FormData();
        formData.append("imagen", imgFile);
        formData.append("nombre", form.nombre);
        formData.append("precio", form.precio);
        formData.append("descripcion", form.descripcion);
        formData.append("categoria", form.categoria);
        formData.append("genero", form.genero);
        formData.append("talla", form.talla);
        await updateProduct(selected._id, formData);
      } else {
        await updateProduct(selected._id, {
          ...form,
          precio: parseFloat(form.precio),
        });
      }

      toast.success("Producto actualizado");
      closeModal();
      //  sin getProducts() — el contexto ya actualizó el estado
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  // — Eliminar —
  const handleDelete = async () => {
    try {
      setSaving(true);
      await deleteProduct(selected._id);
      toast.success("Producto eliminado");
      closeModal();
    } catch {
      toast.error("Error al eliminar producto");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className={styles.loading}>Cargando productos...</div>;

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Productos</h2>
        <button
          onClick={() => (window.location.href = "/admin/crear")}
          className={styles.btnPrimary}
        >
          <Plus size={15} /> Nuevo producto
        </button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="todas">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className={styles.productsList}>
        <div className={styles.listHeader}>
          <div />
          <div>Producto</div>
          <div>Categoría</div>
          <div>Género</div>
          <div>Talla</div>
          <div className={styles.thRight}>Precio</div>
          <div className={styles.thRight}>Acciones</div>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>No se encontraron productos</div>
        ) : (
          filtered.map((product) => (
            <div key={product._id} className={styles.productRow}>
              {product.imagen ? (
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className={styles.productThumb}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className={styles.productThumbPlaceholder}>
                  <Package size={20} />
                </div>
              )}
              <div className={styles.productRowInfo}>
                <p className={styles.productRowName}>{product.nombre}</p>
                {product.descripcion && (
                  <p className={styles.productRowDesc}>
                    {product.descripcion.slice(0, 60)}
                    {product.descripcion.length > 60 ? "..." : ""}
                  </p>
                )}
              </div>
              <span className={styles.productCategory}>
                {product.categoria || "—"}
              </span>
              <span className={styles.productMeta}>
                {product.genero || "—"}
              </span>
              <span className={styles.productMeta}>{product.talla || "—"}</span>
              <div className={styles.productRowPrice}>{product.precio}€</div>
              <div className={styles.productRowActions}>
                <button
                  onClick={() => openEdit(product)}
                  className={styles.btnIcon}
                  title="Editar"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => openDelete(product)}
                  className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <p className={styles.footer}>
        {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
        {filter !== "todas" && ` en ${filter}`}
      </p>

      {/* Modal editar */}
      {modal === "edit" && (
        <div className={styles.overlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>Editar producto</h3>
              <button onClick={closeModal} className={styles.modalClose}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label>Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Nombre del producto"
                />
              </div>
              <div className={styles.field}>
                <label>Precio (€)</label>
                <input
                  type="number"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className={styles.field}>
                <label>Categoría</label>
                <select
                  value={form.categoria}
                  onChange={(e) =>
                    setForm({ ...form, categoria: e.target.value })
                  }
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Género</label>
                <select
                  value={form.genero}
                  onChange={(e) => setForm({ ...form, genero: e.target.value })}
                >
                  {GENEROS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Talla</label>
                <select
                  value={form.talla}
                  onChange={(e) => setForm({ ...form, talla: e.target.value })}
                >
                  {TALLAS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label>Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  placeholder="Descripción del producto"
                />
              </div>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label>Cambiar imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImgChange}
                />
                {imgPreview && (
                  <img
                    src={imgPreview}
                    alt="Preview"
                    className={styles.imgPreview}
                  />
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.btnSecondary}>
                Cancelar
              </button>
              {/* button guardar */}
              <button
                onClick={handleEdit}
                disabled={saving}
                className={styles.btnPrimary}
              >
                {saving ? (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ animation: "spin 0.8s linear infinite" }}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {modal === "delete" && (
        <div className={styles.overlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>Eliminar producto</h3>
              <button onClick={closeModal} className={styles.modalClose}>
                <X size={18} />
              </button>
            </div>
            <p className={styles.modalText}>
              ¿Seguro que quieres eliminar <strong>{selected?.nombre}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.btnSecondary}>
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className={styles.btnDanger}
              >
                {saving ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
