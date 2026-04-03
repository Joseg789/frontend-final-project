import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Search } from "lucide-react";
import styles from "./Users.module.css";

const API_URL = import.meta.env.VITE_API_URL_BACKEND2;
const EMPTY_FORM = { email: "", password: "" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | "edit" | "delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}auth/users`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("create");
  };

  const openEdit = (user) => {
    setForm({ email: user.email, password: "" });
    setSelected(user);
    setModal("edit");
  };

  const openDelete = (user) => {
    setSelected(user);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(EMPTY_FORM);
  };

  const handleCreate = async () => {
    if (!form.email || !form.password)
      return toast.error("Rellena todos los campos");
    try {
      setSaving(true);
      await axios.post(`${API_URL}auth/register`, form, {
        withCredentials: true,
      });
      toast.success("Usuario creado");
      closeModal();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al crear usuario");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!form.email) return toast.error("El email es obligatorio");
    try {
      setSaving(true);
      await axios.put(`${API_URL}auth/users/${selected._id}`, form, {
        withCredentials: true,
      });
      toast.success("Usuario actualizado");
      closeModal();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al actualizar usuario");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await axios.delete(`${API_URL}auth/users/${selected._id}`, {
        withCredentials: true,
      });
      toast.success("Usuario eliminado");
      closeModal();
      fetchUsers();
    } catch {
      toast.error("Error al eliminar usuario");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Usuarios</h2>
        <button onClick={openCreate} className={styles.btnPrimary}>
          <Plus size={15} /> Nuevo usuario
        </button>
      </div>

      {/* Buscador */}
      <div className={styles.searchWrapper}>
        <Search size={14} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar por email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Tabla */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Rol</th>
              <th className={`${styles.th} ${styles.thRight}`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  Cargando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u._id}>
                  <td className={styles.td}>
                    <div className={styles.emailCell}>
                      <div className={styles.avatar}>
                        {u.email.slice(0, 2).toUpperCase()}
                      </div>
                      {u.email}
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.tdMuted}`}>{u._id}</td>
                  <td className={styles.td}>
                    <span
                      className={
                        u.role === "admin"
                          ? styles.badgeAdmin
                          : styles.badgeUser
                      }
                    >
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <button
                        onClick={() => openEdit(u)}
                        className={styles.btnIcon}
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => openDelete(u)}
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

      {/* Total */}
      {!loading && (
        <p className={styles.total}>
          {filtered.length} usuario{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Modal crear / editar */}
      {(modal === "create" || modal === "edit") && (
        <div className={styles.overlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>{modal === "create" ? "Nuevo usuario" : "Editar usuario"}</h3>
              <button onClick={closeModal} className={styles.modalClose}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div className={styles.field}>
                <label>
                  {modal === "edit"
                    ? "Nueva contraseña (opcional)"
                    : "Contraseña"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Mínimo 8 caracteres"
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

      {/* Modal eliminar */}
      {modal === "delete" && (
        <div className={styles.overlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>Eliminar usuario</h3>
              <button onClick={closeModal} className={styles.modalClose}>
                <X size={18} />
              </button>
            </div>
            <p className={styles.modalText}>
              ¿Seguro que quieres eliminar a <strong>{selected?.email}</strong>?
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
