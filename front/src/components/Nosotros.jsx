// Nosotros.jsx
import { Link } from "react-router-dom";
import styles from "./Nosotros.module.css";
import { Shield, Leaf, Mountain, Heart } from "lucide-react";

const VALORES = [
  {
    icon: Shield,
    titulo: "Calidad garantizada",
    desc: "Cada producto pasa por un riguroso control de calidad antes de llegar a tus manos.",
  },
  {
    icon: Leaf,
    titulo: "Sostenibilidad",
    desc: "Comprometidos con el medio ambiente usando materiales reciclados y procesos responsables.",
  },
  {
    icon: Mountain,
    titulo: "Diseñado para la aventura",
    desc: "Ropa técnica pensada para resistir las condiciones más exigentes de la montaña.",
  },
  {
    icon: Heart,
    titulo: "Comunidad",
    desc: "Somos más que una marca, somos una comunidad de personas que aman la naturaleza.",
  },
];

const EQUIPO = [
  {
    nombre: "Jose Sanchez",
    rol: "Fundador & CEO",
    img: "https://res.cloudinary.com/djtg09pf6/image/upload/Retrato_profesional_con_traje_azul_vnvnzk.png",
  },
  {
    nombre: "Yurin Velasquez",
    rol: "Directora de Diseño",
    img: "https://res.cloudinary.com/djtg09pf6/image/upload/Mujer_profesional_con_traje_azul_p05ckn.png",
  },
  {
    nombre: "Ailin Sanchez",
    rol: "Head of Product",
    img: "https://res.cloudinary.com/djtg09pf6/image/upload/Mujer_profesional_trabajando_en_su_laptop_dhue8r.png",
  },
  {
    nombre: "Dayadeth Sanchez",
    rol: "Directora de Marketing",
    img: "https://res.cloudinary.com/djtg09pf6/image/upload/Mujer_sonriente_en_secci%C3%B3n_VIP_1_ja6wy1.png",
  },
];

const STATS = [
  { valor: "2018", label: "Año de fundación" },
  { valor: "+5K", label: "Clientes felices" },
  { valor: "12", label: "Países" },
  { valor: "100%", label: "Materiales éticos" },
];

export default function Nosotros() {
  return (
    <div className={styles.wrap}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Nuestra historia</p>
          <h1 className={styles.heroTitle}>
            Nacidos en la montaña,
            <br />
            hechos para el mundo
          </h1>
          <p className={styles.heroDesc}>
            Desde 2018 creamos ropa técnica para quienes aman explorar. Cada
            puntada, cada material y cada diseño refleja nuestra pasión por la
            aventura y el respeto por la naturaleza.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <p className={styles.statValor}>{s.valor}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Historia */}
      <section className={styles.section}>
        <div className={styles.historiaGrid}>
          <div className={styles.historiaTexto}>
            <p className={styles.eyebrow}>Quiénes somos</p>
            <h2 className={styles.sectionTitle}>Una marca con propósito</h2>
            <p className={styles.texto}>
              Todo empezó en una expedición al Pirineo en 2017. Jose y Yurin,
              hartos de ropa que prometía mucho y cumplía poco, decidieron crear
              la suya propia. Un año después nació nuestra marca con una misión
              clara: ropa que funciona de verdad, hecha de forma responsable.
            </p>
            <p className={styles.texto}>
              Hoy somos un equipo de 40 personas repartidas entre Madrid,
              Barcelona y Chamonix, unidos por la misma pasión: hacer que cada
              aventura sea mejor gracias a lo que llevas puesto.
            </p>
          </div>
          <div className={styles.historiaImgWrap}>
            <img
              src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=60"
              alt="Equipo en montaña"
              className={styles.historiaImg}
            />
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Lo que nos mueve</p>
          <h2 className={styles.sectionTitle}>Nuestros valores</h2>
        </div>
        <div className={styles.valoresGrid}>
          {VALORES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.titulo} className={styles.valorCard}>
                <div className={styles.valorIcon}>
                  <Icon size={22} />
                </div>
                <h3 className={styles.valorTitulo}>{v.titulo}</h3>
                <p className={styles.valorDesc}>{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Equipo */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Las personas detrás</p>
          <h2 className={styles.sectionTitle}>Nuestro equipo</h2>
        </div>
        <div className={styles.equipoGrid}>
          {EQUIPO.map((p) => (
            <div key={p.nombre} className={styles.equipoCard}>
              <div className={styles.equipoImgWrap}>
                <img src={p.img} alt={p.nombre} className={styles.equipoImg} />
              </div>
              <div className={styles.equipoInfo}>
                <p className={styles.equipoNombre}>{p.nombre}</p>
                <p className={styles.equipoRol}>{p.rol}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>¿Listo para tu próxima aventura?</h2>
          <p className={styles.ctaDesc}>
            Explora nuestra colección y encuentra el equipo perfecto para ti.
          </p>
          <Link to="/productos" className={styles.ctaBtn}>
            Ver productos
          </Link>
        </div>
      </section>
    </div>
  );
}
