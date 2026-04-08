import { useState, useEffect } from "react";
import api from "../../../api";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, Search, X } from "lucide-react";
import styles from "./Orders.module.css";

const ESTADOS = [
  "pendiente",
  "procesando",
  "enviado",
  "entregado",
  "cancelado",
];

const EMPTY_FORM = {
  userEmail: "",
  estado: "pendiente",
  total: "",
  calle: "",
  ciudad: "",
  codigoPostal: "",
  pais: "España",
};

const statusClass = {
  pendiente: styles.statusPendiente,
  procesando: styles.statusProcesando,
  enviado: styles.statusEnviado,
  entregado: styles.statusEntregado,
  cancelado: styles.statusCancelado,
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, usersRes] = await Promise.all([
        api.get("orders"),
        api.get("auth/users"),
      ]);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch {
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const email = o.user?.email?.toLowerCase() || "";
    const id = o._id?.toLowerCase() || "";
    const query = search.toLowerCase();
    const matchSearch = email.includes(query) || id.includes(query);
    const matchFilter = filter === "todos" || o.estado === filter;
    return matchSearch && matchFilter;
  });

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("create");
  };
  const openEdit = (order) => {
    setForm({
      userEmail: order.user?.email || "",
      estado: order.estado || "pendiente",
      total: order.total || "",
      calle: order.direccion?.calle || "",
      ciudad: order.direccion?.ciudad || "",
      codigoPostal: order.direccion?.codigoPostal || "",
      pais: order.direccion?.pais || "España",
    });
    setSelected(order);
    setModal("edit");
  };
  const openDetail = (order) => {
    setSelected(order);
    setModal("detail");
  };
  const openDelete = (order) => {
    setSelected(order);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(EMPTY_FORM);
  };

  // ✅ api ya tiene baseURL — solo paths relativos, sin withCredentials
  const handleCreate = async () => {
    if (!form.userEmail || !form.total)
      return toast.error("Email y total son obligatorios");
    const user = users.find((u) => u.email === form.userEmail);
    if (!user) return toast.error("Usuario no encontrado");
    try {
      setSaving(true);
      await api.post("orders", {
        user: user._id,
        items: [],
        total: parseFloat(form.total),
        estado: form.estado,
        direccion: {
          calle: form.calle,
          ciudad: form.ciudad,
          codigoPostal: form.codigoPostal,
          pais: form.pais,
        },
      });
      toast.success("Orden creada");
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al crear orden");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!form.estado) return toast.error("El estado es obligatorio");
    try {
      setSaving(true);
      await api.put(`orders/${selected._id}`, {
        estado: form.estado,
        total: parseFloat(form.total),
        direccion: {
          calle: form.calle,
          ciudad: form.ciudad,
          codigoPostal: form.codigoPostal,
          pais: form.pais,
        },
      });
      toast.success("Orden actualizada");
      closeModal();
      fetchData();
    } catch {
      toast.error("Error al actualizar orden");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await api.delete(`orders/${selected._id}`);
      toast.success("Orden eliminada");
      closeModal();
      fetchData();
    } catch {
      toast.error("Error al eliminar orden");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (order, estado) => {
    try {
      await api.put(`orders/${order._id}`, { estado });
      toast.success(`Estado actualizado a "${estado}"`);
      fetchData();
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  if (loading) return <div className={styles.loading}>Cargando órdenes...</div>;

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Órdenes</h2>
        <button onClick={openCreate} className={styles.btnPrimary}>
          <Plus size={15} /> Nueva orden
        </button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por email o ID..."
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
          <option value="todos">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e.charAt(0).toUpperCase() + e.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Orden</th>
              <th className={styles.th}>Cliente</th>
              <th className={styles.th}>Productos</th>
              <th className={styles.th}>Estado</th>
              <th className={styles.th}>Total</th>
              <th className={`${styles.th} ${styles.thRight}`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No se encontraron órdenes
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order._id}>
                  <td className={styles.td}>
                    <div className={styles.orderId}>
                      #{order._id?.slice(-6).toUpperCase()}
                    </div>
                    <div className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString("es-ES")}
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.userEmail}>
                      <div className={styles.avatar}>
                        {order.user?.email?.slice(0, 2).toUpperCase() || "??"}
                      </div>
                      {order.user?.email || "—"}
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.itemsPreview}>
                      {order.items?.length > 0 ? (
                        order.items.map((i) => i.nombre).join(", ")
                      ) : (
                        <span className={styles.tdMuted}>Sin productos</span>
                      )}
                    </div>
                  </td>
                  <td className={styles.td}>
                    <select
                      value={order.estado}
                      onChange={(e) =>
                        handleStatusChange(order, e.target.value)
                      }
                      className={`${styles.statusBadge} ${statusClass[order.estado] || styles.statusPendiente}`}
                      style={{
                        border: "none",
                        cursor: "pointer",
                        background: "inherit",
                      }}
                    >
                      {ESTADOS.map((e) => (
                        <option key={e} value={e}>
                          {e.charAt(0).toUpperCase() + e.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.total}>
                      {(order.total || 0).toFixed(2)}€
                    </span>
                  </td>
                  <td className={`${styles.td} ${styles.tdRight}`}>
                    <div className={styles.actions}>
                      <button
                        onClick={() => openDetail(order)}
                        className={`${styles.btnIcon} ${styles.btnIconInfo}`}
                        title="Ver detalle"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => openEdit(order)}
                        className={styles.btnIcon}
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => openDelete(order)}
                        className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.footerCount}>
          {filtered.length} orden{filtered.length !== 1 ? "es" : ""}
          {filter !== "todos" && ` · ${filter}`}
        </p>
      </div>

      {/* Modal crear / editar */}
      {(modal === "create" || modal === "edit") && (
        <div className={styles.overlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>{modal === "create" ? "Nueva orden" : "Editar orden"}</h3>
              <button onClick={closeModal} className={styles.modalClose}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.formGrid}>
              {modal === "create" && (
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>Email del usuario</label>
                  <input
                    type="email"
                    value={form.userEmail}
                    onChange={(e) =>
                      setForm({ ...form, userEmail: e.target.value })
                    }
                    placeholder="usuario@email.com"
                    list="users-list"
                  />
                  <datalist id="users-list">
                    {users.map((u) => (
                      <option key={u._id} value={u.email} />
                    ))}
                  </datalist>
                </div>
              )}
              <div className={styles.field}>
                <label>Estado</label>
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                >
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>
                      {e.charAt(0).toUpperCase() + e.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Total (€)</label>
                <input
                  type="number"
                  value={form.total}
                  onChange={(e) => setForm({ ...form, total: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label>Calle</label>
                <input
                  type="text"
                  value={form.calle}
                  onChange={(e) => setForm({ ...form, calle: e.target.value })}
                  placeholder="Calle Mayor 24"
                />
              </div>
              <div className={styles.field}>
                <label>Ciudad</label>
                <input
                  type="text"
                  value={form.ciudad}
                  onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                  placeholder="Madrid"
                />
              </div>
              <div className={styles.field}>
                <label>Código postal</label>
                <input
                  type="text"
                  value={form.codigoPostal}
                  onChange={(e) =>
                    setForm({ ...form, codigoPostal: e.target.value })
                  }
                  placeholder="28013"
                />
              </div>
              <div className={styles.field}>
                <label>País</label>
                <input
                  type="text"
                  value={form.pais}
                  onChange={(e) => setForm({ ...form, pais: e.target.value })}
                  placeholder="España"
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.btnSecondary}>
                Cancelar
              </button>
              <button
                onClick={modal === "create" ? handleCreate : handleEdit}
                disabled={saving}
                className={styles.btnPrimary}
              >
                {saving
                  ? "Guardando..."
                  : modal === "create"
                    ? "Crear"
                    : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {modal === "detail" && selected && (
        <div className={styles.overlay}>
          <div className={`${styles.modalCard} ${styles.modalCardLg}`}>
            <div className={styles.modalHeader}>
              <h3>Orden #{selected._id?.slice(-6).toUpperCase()}</h3>
              <button onClick={closeModal} className={styles.modalClose}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Cliente</span>
                <span className={styles.detailValue}>
                  {selected.user?.email || "—"}
                </span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Fecha</span>
                <span className={styles.detailValue}>
                  {new Date(selected.createdAt).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Estado</span>
                <span
                  className={`${styles.statusBadge} ${statusClass[selected.estado]}`}
                >
                  {selected.estado}
                </span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Total</span>
                <span className={styles.detailValue}>
                  {(selected.total || 0).toFixed(2)}€
                </span>
              </div>
            </div>

            {selected.direccion?.calle && (
              <>
                <p className={styles.sectionTitle}>Dirección</p>
                <div className={styles.detailGrid}>
                  <div className={styles.detailField}>
                    <span className={styles.detailLabel}>Calle</span>
                    <span className={styles.detailValue}>
                      {selected.direccion.calle}
                    </span>
                  </div>
                  <div className={styles.detailField}>
                    <span className={styles.detailLabel}>Ciudad</span>
                    <span className={styles.detailValue}>
                      {selected.direccion.ciudad}
                    </span>
                  </div>
                  <div className={styles.detailField}>
                    <span className={styles.detailLabel}>Código postal</span>
                    <span className={styles.detailValue}>
                      {selected.direccion.codigoPostal}
                    </span>
                  </div>
                  <div className={styles.detailField}>
                    <span className={styles.detailLabel}>País</span>
                    <span className={styles.detailValue}>
                      {selected.direccion.pais}
                    </span>
                  </div>
                </div>
              </>
            )}

            <p className={styles.sectionTitle}>
              Productos ({selected.items?.length || 0})
            </p>
            {selected.items?.length === 0 ? (
              <p className={styles.tdMuted} style={{ fontSize: 13 }}>
                Sin productos
              </p>
            ) : (
              selected.items?.map((item, i) => (
                <div key={i} className={styles.itemRow}>
                  <span className={styles.itemName}>{item.nombre}</span>
                  <span className={styles.itemQty}>x{item.quantity}</span>
                  <span className={styles.itemPrice}>
                    {(item.precio * item.quantity).toFixed(2)}€
                  </span>
                </div>
              ))
            )}

            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.btnSecondary}>
                Cerrar
              </button>
              <button
                onClick={() => {
                  closeModal();
                  openEdit(selected);
                }}
                className={styles.btnPrimary}
              >
                <Pencil size={14} /> Editar
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
              <h3>Eliminar orden</h3>
              <button onClick={closeModal} className={styles.modalClose}>
                <X size={18} />
              </button>
            </div>
            <p className={styles.modalText}>
              ¿Seguro que quieres eliminar la orden{" "}
              <strong>#{selected?._id?.slice(-6).toUpperCase()}</strong>? Esta
              acción no se puede deshacer.
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
