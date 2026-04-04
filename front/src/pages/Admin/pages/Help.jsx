import { useState } from "react";
import { toast } from "sonner";
import {
  Search,
  ChevronDown,
  BookOpen,
  ShoppingBag,
  Users,
  BarChart2,
  Settings,
  Package,
  Mail,
  MessageCircle,
  Phone,
  ExternalLink,
  Zap,
} from "lucide-react";
import styles from "./Help.module.css";

const NAV_ITEMS = [
  { id: "faq", label: "Preguntas frecuentes", icon: MessageCircle },
  { id: "guias", label: "Guías", icon: BookOpen },
  { id: "contacto", label: "Contacto", icon: Mail },
  { id: "atajos", label: "Atajos de teclado", icon: Zap },
  { id: "estado", label: "Estado del sistema", icon: Settings },
];

const FAQS = [
  {
    category: "pedidos",
    question: "¿Cómo proceso un pedido pendiente?",
    answer:
      "Ve a la sección Órdenes del panel, localiza el pedido con estado 'pendiente' y cambia su estado al siguiente paso usando el selector de estado en la fila. Puedes también abrirlo con el icono de ojo para ver el detalle completo antes de procesarlo.",
  },
  {
    category: "pedidos",
    question: "¿Cómo cancelo un pedido?",
    answer:
      "En la sección Órdenes, abre el pedido y cambia el estado a 'cancelado'. El sistema registrará el cambio automáticamente. Recuerda notificar al cliente si es necesario.",
  },
  {
    category: "usuarios",
    question: "¿Cómo creo un nuevo usuario desde el panel?",
    answer:
      "Ve a la sección Usuarios, pulsa 'Nuevo usuario' y rellena el email y contraseña. El usuario recibirá sus credenciales y podrá acceder inmediatamente.",
  },
  {
    category: "usuarios",
    question: "¿Cómo cambio el rol de un usuario?",
    answer:
      "Actualmente los roles se asignan en la base de datos directamente. Para promover un usuario a admin, actualiza el campo 'role' en MongoDB Compass o desde tu script de seeds.",
  },
  {
    category: "productos",
    question: "¿Cómo añado un nuevo producto con imagen?",
    answer:
      "Ve a la sección Crear del panel admin. Rellena el formulario con nombre, precio, categoría, talla y descripción. La imagen se sube directamente a Cloudinary y la URL se guarda automáticamente en la base de datos.",
  },
  {
    category: "productos",
    question: "¿Por qué no aparece la imagen del producto?",
    answer:
      "Comprueba que las variables de entorno de Cloudinary están correctamente configuradas en tu archivo .env del backend (CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET). Si el problema persiste, revisa los logs del servidor.",
  },
  {
    category: "analytics",
    question: "¿Por qué los gráficos aparecen vacíos?",
    answer:
      "Los gráficos se alimentan de los datos reales de tu base de datos. Si acabas de instalar el proyecto, ejecuta el script seed.js para generar datos de prueba. Si ya tienes datos, verifica que la ruta GET /orders del backend responde correctamente.",
  },
  {
    category: "sistema",
    question: "¿Cómo funcionan las sesiones?",
    answer:
      "El panel usa express-session con connect-mongo para persistir sesiones en MongoDB. La sesión dura 24 horas por defecto. Si el usuario cierra sesión o expira, se redirige automáticamente a /login.",
  },
];

const GUIDES = [
  {
    icon: ShoppingBag,
    iconBg: "#EAF3DE",
    iconColor: "#3B6D11",
    title: "Gestión de pedidos",
    desc: "Aprende a procesar, actualizar y cancelar pedidos",
    badge: "badgePopular",
  },
  {
    icon: Users,
    iconBg: "#E6F1FB",
    iconColor: "#185FA5",
    title: "Gestión de usuarios",
    desc: "Crea, edita y elimina usuarios desde el panel",
    badge: "badgeBasic",
  },
  {
    icon: Package,
    iconBg: "#EEEDFE",
    iconColor: "#534AB7",
    title: "Gestión de productos",
    desc: "Añade productos con imágenes y gestiona el catálogo",
    badge: "badgeBasic",
  },
  {
    icon: BarChart2,
    iconBg: "#FAEEDA",
    iconColor: "#854F0B",
    title: "Analytics y reportes",
    desc: "Entiende las métricas y exporta reportes en CSV",
    badge: "badgeNew",
  },
  {
    icon: Settings,
    iconBg: "#f5f5f5",
    iconColor: "#555",
    title: "Configuración",
    desc: "Personaliza la tienda, notificaciones y seguridad",
    badge: "badgeBasic",
  },
  {
    icon: Zap,
    iconBg: "#FCEBEB",
    iconColor: "#a32d2d",
    title: "Primeros pasos",
    desc: "Configura el proyecto desde cero en 10 minutos",
    badge: "badgeNew",
  },
];

const SHORTCUTS = [
  { label: "Ir al dashboard", keys: ["G", "D"] },
  { label: "Ir a pedidos", keys: ["G", "O"] },
  { label: "Ir a usuarios", keys: ["G", "U"] },
  { label: "Ir a analytics", keys: ["G", "A"] },
  { label: "Buscar", keys: ["Ctrl", "K"] },
  { label: "Nuevo pedido", keys: ["N", "O"] },
  { label: "Nuevo usuario", keys: ["N", "U"] },
  { label: "Cerrar modal", keys: ["Esc"] },
  { label: "Guardar cambios", keys: ["Ctrl", "S"] },
];

const SYSTEM_STATUS = [
  {
    name: "API Backend",
    status: "operativo",
    dot: "dotGreen",
    val: "99.9% uptime",
  },
  {
    name: "Base de datos",
    status: "operativo",
    dot: "dotGreen",
    val: "MongoDB Atlas",
  },
  {
    name: "Cloudinary CDN",
    status: "operativo",
    dot: "dotGreen",
    val: "Imágenes OK",
  },
  {
    name: "Sesiones",
    status: "operativo",
    dot: "dotGreen",
    val: "connect-mongo",
  },
  {
    name: "Rate limiting",
    status: "activo",
    dot: "dotGreen",
    val: "2000 req/15min",
  },
  { name: "CORS", status: "configurado", dot: "dotGreen", val: "2 orígenes" },
];

const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "pedidos", label: "Pedidos" },
  { id: "usuarios", label: "Usuarios" },
  { id: "productos", label: "Productos" },
  { id: "analytics", label: "Analytics" },
  { id: "sistema", label: "Sistema" },
];

export default function Help() {
  const [active, setActive] = useState("faq");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todos");
  const [openFaq, setOpenFaq] = useState(null);
  const [ticket, setTicket] = useState({
    asunto: "",
    categoria: "pedidos",
    mensaje: "",
  });
  const [sending, setSending] = useState(false);

  const filteredFaqs = FAQS.filter((f) => {
    const matchCat = category === "todos" || f.category === category;
    const matchSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleTicket = async () => {
    if (!ticket.asunto || !ticket.mensaje)
      return toast.error("Rellena todos los campos");
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setTicket({ asunto: "", categoria: "pedidos", mensaje: "" });
    toast.success("Ticket enviado correctamente");
  };

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Ayuda</h2>
      </div>

      {/* Buscador global */}
      <div className={styles.searchWrap}>
        <Search size={15} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar en la ayuda..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActive("faq");
          }}
          className={styles.searchInput}
        />
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
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className={styles.navItem}
          >
            <ExternalLink size={15} />
            Documentación
          </a>
        </nav>

        {/* Contenido */}
        <div>
          {/* FAQ */}
          {active === "faq" && (
            <>
              {/* Filtro por categoría */}
              <div
                className={styles.card}
                style={{ padding: "0.75rem 1.25rem" }}
              >
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      style={{
                        padding: "5px 12px",
                        fontSize: 12,
                        border: "0.5px solid",
                        borderColor: category === c.id ? "#2c2c2a" : "#e0e0e0",
                        borderRadius: 6,
                        background:
                          category === c.id ? "#2c2c2a" : "transparent",
                        color: category === c.id ? "#fff" : "#888",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.card}>
                <p className={styles.sectionTitle}>
                  Preguntas frecuentes{" "}
                  {filteredFaqs.length > 0 && `(${filteredFaqs.length})`}
                </p>
                {filteredFaqs.length === 0 ? (
                  <p className={styles.empty}>No se encontraron resultados</p>
                ) : (
                  filteredFaqs.map((faq, i) => (
                    <div key={i} className={styles.faqItem}>
                      <button
                        className={styles.faqQuestion}
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        {faq.question}
                        <ChevronDown
                          size={16}
                          className={`${styles.faqIcon} ${openFaq === i ? styles.faqIconOpen : ""}`}
                        />
                      </button>
                      {openFaq === i && (
                        <p className={styles.faqAnswer}>{faq.answer}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Guías */}
          {active === "guias" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>Guías y tutoriales</p>
              <div className={styles.guideGrid}>
                {GUIDES.map((g) => {
                  const Icon = g.icon;
                  return (
                    <div
                      key={g.title}
                      className={styles.guideCard}
                      onClick={() => toast.info(`Abriendo: ${g.title}`)}
                    >
                      <div
                        className={styles.guideIcon}
                        style={{ background: g.iconBg }}
                      >
                        <Icon size={16} color={g.iconColor} />
                      </div>
                      <div className={styles.guideInfo}>
                        <p className={styles.guideTitle}>{g.title}</p>
                        <p className={styles.guideDesc}>{g.desc}</p>
                        <span
                          className={`${styles.guideBadge} ${styles[g.badge]}`}
                        >
                          {g.badge === "badgeNew"
                            ? "Nuevo"
                            : g.badge === "badgePopular"
                              ? "Popular"
                              : "Básico"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contacto */}
          {active === "contacto" && (
            <>
              <div className={styles.card}>
                <p className={styles.sectionTitle}>Canales de soporte</p>
                <div className={styles.contactGrid}>
                  <div
                    className={styles.contactCard}
                    onClick={() => toast.info("Abriendo email...")}
                  >
                    <div
                      className={styles.contactIcon}
                      style={{ background: "#EAF3DE" }}
                    >
                      <Mail size={18} color="#3B6D11" />
                    </div>
                    <p className={styles.contactTitle}>Email</p>
                    <p className={styles.contactDesc}>
                      Soporte por correo electrónico
                    </p>
                    <p className={styles.contactTime}>Respuesta en 24h</p>
                  </div>
                  <div
                    className={styles.contactCard}
                    onClick={() => toast.info("Abriendo chat...")}
                  >
                    <div
                      className={styles.contactIcon}
                      style={{ background: "#E6F1FB" }}
                    >
                      <MessageCircle size={18} color="#185FA5" />
                    </div>
                    <p className={styles.contactTitle}>Chat en vivo</p>
                    <p className={styles.contactDesc}>Habla con el equipo</p>
                    <p className={styles.contactTime}>Lun–Vie 9:00–18:00</p>
                  </div>
                  <div
                    className={styles.contactCard}
                    onClick={() => toast.info("Llamando...")}
                  >
                    <div
                      className={styles.contactIcon}
                      style={{ background: "#FAEEDA" }}
                    >
                      <Phone size={18} color="#854F0B" />
                    </div>
                    <p className={styles.contactTitle}>Teléfono</p>
                    <p className={styles.contactDesc}>+34 900 000 000</p>
                    <p className={styles.contactTime}>Urgencias 24/7</p>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <p className={styles.sectionTitle}>Enviar un ticket</p>
                <div className={styles.formField}>
                  <label>Asunto</label>
                  <input
                    type="text"
                    value={ticket.asunto}
                    onChange={(e) =>
                      setTicket({ ...ticket, asunto: e.target.value })
                    }
                    placeholder="Describe brevemente el problema"
                  />
                </div>
                <div className={styles.formField}>
                  <label>Categoría</label>
                  <select
                    value={ticket.categoria}
                    onChange={(e) =>
                      setTicket({ ...ticket, categoria: e.target.value })
                    }
                  >
                    <option value="pedidos">Pedidos</option>
                    <option value="usuarios">Usuarios</option>
                    <option value="productos">Productos</option>
                    <option value="pagos">Pagos</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>Mensaje</label>
                  <textarea
                    value={ticket.mensaje}
                    onChange={(e) =>
                      setTicket({ ...ticket, mensaje: e.target.value })
                    }
                    placeholder="Describe el problema con el mayor detalle posible..."
                  />
                </div>
                <button
                  onClick={handleTicket}
                  disabled={sending}
                  className={styles.btnPrimary}
                >
                  {sending ? "Enviando..." : "Enviar ticket"}
                </button>
              </div>
            </>
          )}

          {/* Atajos de teclado */}
          {active === "atajos" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>Atajos de teclado</p>
              {SHORTCUTS.map((s) => (
                <div key={s.label} className={styles.shortcutRow}>
                  <span className={styles.shortcutLabel}>{s.label}</span>
                  <div className={styles.shortcutKeys}>
                    {s.keys.map((k, i) => (
                      <span key={i} className={styles.kbd}>
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Estado del sistema */}
          {active === "estado" && (
            <div className={styles.card}>
              <p className={styles.sectionTitle}>Estado del sistema</p>
              {SYSTEM_STATUS.map((s) => (
                <div key={s.name} className={styles.statusRow}>
                  <div className={styles.statusLeft}>
                    <div className={`${styles.statusDot} ${styles[s.dot]}`} />
                    <span className={styles.statusName}>{s.name}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className={styles.statusVal}>{s.val}</div>
                    <div
                      style={{ fontSize: 11, color: "#3B6D11", marginTop: 1 }}
                    >
                      {s.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
