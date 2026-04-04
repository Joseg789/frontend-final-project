import { useState } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Save,
  LogOut,
} from "lucide-react";
import styles from "./Settings.module.css";

const NAV_ITEMS = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
  { id: "seguridad", label: "Seguridad", icon: Shield },
  { id: "apariencia", label: "Apariencia", icon: Palette },
  { id: "tienda", label: "Tienda", icon: Globe },
  { id: "sistema", label: "Sistema", icon: Database },
];

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("perfil");
  const [saving, setSaving] = useState(false);

  // — Estado por sección —
  const [perfil, setPerfil] = useState({
    nombre: "Admin",
    email: user?.email || "",
    telefono: "+34 600 000 000",
    idioma: "es",
  });

  const [notifSettings, setNotifSettings] = useState({
    nuevoPedido: true,
    pedidoCancelado: true,
    nuevoUsuario: false,
    stockBajo: true,
    reporteSemanal: false,
    emailResumen: true,
  });

  const [seguridad, setSeguridad] = useState({
    passActual: "",
    passNueva: "",
    passConfirm: "",
    dobleAuth: false,
    sesionLog: true,
  });

  const [apariencia, setApariencia] = useState({
    colorPrimario: "#2c2c2a",
    colorAcento: "#a00303",
    modoOscuro: false,
    compacto: false,
  });

  const [tienda, setTienda] = useState({
    nombre: "Mi Tienda",
    descripcion: "Tienda de ropa outdoor y aventura",
    moneda: "EUR",
    impuesto: "21",
    envioGratis: "50",
    email: "tienda@email.com",
  });

  const handleSave = async (section) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success(`${section} guardado correctamente`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Ajustes</h2>
      </div>

      <div className={styles.grid}>
        {/* Sidebar */}
        <nav className={styles.sidebar}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              onClick={() => setActive(id)}
              className={`${styles.navItem} ${active === id ? styles.navItemActive : ""}`}
            >
              <Icon size={15} />
              {label}
            </div>
          ))}
          <div className={styles.navDivider} />
          <div
            className={styles.navItem}
            onClick={handleLogout}
            style={{ color: "#a32d2d" }}
          >
            <LogOut size={15} />
            Cerrar sesión
          </div>
        </nav>

        {/* Contenido */}
        <div>
          {/* Perfil */}
          {active === "perfil" && (
            <>
              <div className={styles.card}>
                <p className={styles.sectionTitle}>Foto de perfil</p>
                <div className={styles.avatarUpload}>
                  <div className={styles.avatarCircle}>
                    {perfil.email.slice(0, 2).toUpperCase()}
                  </div>
                  <div className={styles.avatarActions}>
                    <button className={styles.btnSecondary}>
                      Cambiar foto
                    </button>
                    <span className={styles.avatarHint}>JPG, PNG. Máx 2MB</span>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <p className={styles.sectionTitle}>Información personal</p>
                <div className={styles.fieldRow}>
                  <Field
                    label="Nombre"
                    value={perfil.nombre}
                    onChange={(v) => setPerfil({ ...perfil, nombre: v })}
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={perfil.email}
                    onChange={(v) => setPerfil({ ...perfil, email: v })}
                  />
                </div>
                <div className={styles.fieldRow}>
                  <Field
                    label="Teléfono"
                    type="tel"
                    value={perfil.telefono}
                    onChange={(v) => setPerfil({ ...perfil, telefono: v })}
                  />
                  <div className={styles.field}>
                    <label>Idioma</label>
                    <select
                      value={perfil.idioma}
                      onChange={(e) =>
                        setPerfil({ ...perfil, idioma: e.target.value })
                      }
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>
                <SaveBar onSave={() => handleSave("Perfil")} saving={saving} />
              </div>
            </>
          )}

          {/* Notificaciones */}
          {active === "notificaciones" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>
                Preferencias de notificaciones
              </p>
              <p className={styles.sectionDesc}>
                Elige qué eventos generan notificaciones en el panel.
              </p>
              {[
                {
                  key: "nuevoPedido",
                  label: "Nuevo pedido",
                  desc: "Cuando un cliente realiza un pedido",
                },
                {
                  key: "pedidoCancelado",
                  label: "Pedido cancelado",
                  desc: "Cuando un cliente cancela su pedido",
                },
                {
                  key: "nuevoUsuario",
                  label: "Nuevo usuario",
                  desc: "Cuando alguien se registra",
                },
                {
                  key: "stockBajo",
                  label: "Stock bajo",
                  desc: "Cuando un producto tiene poco stock",
                },
                {
                  key: "reporteSemanal",
                  label: "Reporte semanal",
                  desc: "Resumen de ventas cada lunes",
                },
                {
                  key: "emailResumen",
                  label: "Email de resumen diario",
                  desc: "Recibe un resumen diario por email",
                },
              ].map(({ key, label, desc }) => (
                <div key={key} className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <div className={styles.toggleLabel}>{label}</div>
                    <div className={styles.toggleDesc}>{desc}</div>
                  </div>
                  <Toggle
                    checked={notifSettings[key]}
                    onChange={(v) =>
                      setNotifSettings({ ...notifSettings, [key]: v })
                    }
                  />
                </div>
              ))}
              <SaveBar
                onSave={() => handleSave("Notificaciones")}
                saving={saving}
              />
            </div>
          )}

          {/* Seguridad */}
          {active === "seguridad" && (
            <>
              <div className={styles.card}>
                <p className={styles.sectionTitle}>Cambiar contraseña</p>
                <div className={styles.fieldRow}>
                  <Field
                    label="Contraseña actual"
                    type="password"
                    value={seguridad.passActual}
                    onChange={(v) =>
                      setSeguridad({ ...seguridad, passActual: v })
                    }
                  />
                  <div />
                </div>
                <div className={styles.fieldRow}>
                  <Field
                    label="Nueva contraseña"
                    type="password"
                    value={seguridad.passNueva}
                    onChange={(v) =>
                      setSeguridad({ ...seguridad, passNueva: v })
                    }
                  />
                  <Field
                    label="Confirmar contraseña"
                    type="password"
                    value={seguridad.passConfirm}
                    onChange={(v) =>
                      setSeguridad({ ...seguridad, passConfirm: v })
                    }
                  />
                </div>
                <SaveBar
                  onSave={() => handleSave("Contraseña")}
                  saving={saving}
                  label="Actualizar contraseña"
                />
              </div>

              <div className={styles.card}>
                <p className={styles.sectionTitle}>Seguridad avanzada</p>
                {[
                  {
                    key: "dobleAuth",
                    label: "Autenticación de dos factores",
                    desc: "Añade una capa extra de seguridad al login",
                  },
                  {
                    key: "sesionLog",
                    label: "Registro de sesiones",
                    desc: "Guarda un historial de accesos al panel",
                  },
                ].map(({ key, label, desc }) => (
                  <div key={key} className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <div className={styles.toggleLabel}>{label}</div>
                      <div className={styles.toggleDesc}>{desc}</div>
                    </div>
                    <Toggle
                      checked={seguridad[key]}
                      onChange={(v) => setSeguridad({ ...seguridad, [key]: v })}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Apariencia */}
          {active === "apariencia" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>Apariencia del panel</p>

              <div className={styles.colorRow}>
                <input
                  type="color"
                  value={apariencia.colorPrimario}
                  onChange={(e) =>
                    setApariencia({
                      ...apariencia,
                      colorPrimario: e.target.value,
                    })
                  }
                  className={styles.colorSwatch}
                />
                <span className={styles.colorLabel}>Color primario</span>
                <span className={styles.colorValue}>
                  {apariencia.colorPrimario}
                </span>
              </div>

              <div className={styles.colorRow}>
                <input
                  type="color"
                  value={apariencia.colorAcento}
                  onChange={(e) =>
                    setApariencia({
                      ...apariencia,
                      colorAcento: e.target.value,
                    })
                  }
                  className={styles.colorSwatch}
                />
                <span className={styles.colorLabel}>Color de acento</span>
                <span className={styles.colorValue}>
                  {apariencia.colorAcento}
                </span>
              </div>

              {[
                {
                  key: "modoOscuro",
                  label: "Modo oscuro",
                  desc: "Activa el tema oscuro en el panel",
                },
                {
                  key: "compacto",
                  label: "Modo compacto",
                  desc: "Reduce el espaciado para ver más contenido",
                },
              ].map(({ key, label, desc }) => (
                <div key={key} className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <div className={styles.toggleLabel}>{label}</div>
                    <div className={styles.toggleDesc}>{desc}</div>
                  </div>
                  <Toggle
                    checked={apariencia[key]}
                    onChange={(v) => setApariencia({ ...apariencia, [key]: v })}
                  />
                </div>
              ))}
              <SaveBar
                onSave={() => handleSave("Apariencia")}
                saving={saving}
              />
            </div>
          )}

          {/* Tienda */}
          {active === "tienda" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>Configuración de la tienda</p>
              <div className={styles.fieldRow}>
                <Field
                  label="Nombre de la tienda"
                  value={tienda.nombre}
                  onChange={(v) => setTienda({ ...tienda, nombre: v })}
                />
                <Field
                  label="Email de contacto"
                  type="email"
                  value={tienda.email}
                  onChange={(v) => setTienda({ ...tienda, email: v })}
                />
              </div>
              <div
                className={`${styles.field} ${styles.fieldFull}`}
                style={{ marginBottom: 12 }}
              >
                <label>Descripción</label>
                <textarea
                  value={tienda.descripcion}
                  onChange={(e) =>
                    setTienda({ ...tienda, descripcion: e.target.value })
                  }
                />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Moneda</label>
                  <select
                    value={tienda.moneda}
                    onChange={(e) =>
                      setTienda({ ...tienda, moneda: e.target.value })
                    }
                  >
                    <option value="EUR">EUR — Euro</option>
                    <option value="USD">USD — Dólar</option>
                    <option value="GBP">GBP — Libra</option>
                  </select>
                </div>
                <Field
                  label="IVA (%)"
                  type="number"
                  value={tienda.impuesto}
                  onChange={(v) => setTienda({ ...tienda, impuesto: v })}
                />
              </div>
              <div className={styles.fieldRow}>
                <Field
                  label="Envío gratis a partir de (€)"
                  type="number"
                  value={tienda.envioGratis}
                  onChange={(v) => setTienda({ ...tienda, envioGratis: v })}
                />
                <div />
              </div>
              <SaveBar onSave={() => handleSave("Tienda")} saving={saving} />
            </div>
          )}

          {/* Sistema */}
          {active === "sistema" && (
            <>
              <div className={styles.card}>
                <p className={styles.sectionTitle}>Información del sistema</p>
                {[
                  {
                    label: "Versión",
                    value: "1.0.0",
                    badge: styles.badgeGreen,
                  },
                  {
                    label: "Entorno",
                    value: "Producción",
                    badge: styles.badgeAmber,
                  },
                  { label: "Base de datos", value: "MongoDB", badge: null },
                  { label: "Node.js", value: "v20.x", badge: null },
                  {
                    label: "Última copia",
                    value: "Hoy 03:00",
                    badge: styles.badgeGreen,
                  },
                ].map(({ label, value, badge }) => (
                  <div key={label} className={styles.toggleRow}>
                    <div className={styles.toggleLabel}>{label}</div>
                    {badge ? (
                      <span className={`${styles.badge} ${badge}`}>
                        {value}
                      </span>
                    ) : (
                      <span style={{ fontSize: 13, color: "#555" }}>
                        {value}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.dangerCard}>
                <p className={styles.dangerTitle}>Zona de peligro</p>
                <div className={styles.dangerRow}>
                  <div className={styles.dangerInfo}>
                    <p>Limpiar caché</p>
                    <span>Elimina los archivos temporales del servidor</span>
                  </div>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => toast.success("Caché limpiada")}
                  >
                    Limpiar
                  </button>
                </div>
                <div className={styles.dangerRow}>
                  <div className={styles.dangerInfo}>
                    <p>Exportar datos</p>
                    <span>Descarga todos los datos de la tienda en JSON</span>
                  </div>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => toast.success("Exportación iniciada")}
                  >
                    Exportar
                  </button>
                </div>
                <div className={styles.dangerRow}>
                  <div className={styles.dangerInfo}>
                    <p>Restablecer ajustes</p>
                    <span>Vuelve a la configuración de fábrica</span>
                  </div>
                  <button
                    className={styles.btnDanger}
                    onClick={() => toast.error("Función deshabilitada en demo")}
                  >
                    Restablecer
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// — Subcomponentes —

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.toggleSlider} />
    </label>
  );
}

function SaveBar({ onSave, saving, label = "Guardar cambios" }) {
  return (
    <div className={styles.saveBar}>
      <button onClick={onSave} disabled={saving} className={styles.btnPrimary}>
        <Save size={14} />
        {saving ? "Guardando..." : label}
      </button>
    </div>
  );
}
