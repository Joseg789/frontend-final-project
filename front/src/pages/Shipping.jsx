// Shipping.jsx
import { useState } from "react";
import {
  Truck,
  Package,
  RefreshCw,
  Clock,
  MapPin,
  Shield,
  ChevronDown,
} from "lucide-react";
import styles from "./Shipping.module.css";
import { Link } from "react-router-dom";

const OPCIONES_ENVIO = [
  {
    icon: Truck,
    titulo: "Envío estándar",
    plazo: "3 – 5 días hábiles",
    precio: "4,99€",
    gratis: "Gratis en pedidos +50€",
    desc: "Entrega en la dirección que indiques. Recibirás un email con el número de seguimiento.",
  },
  {
    icon: Clock,
    titulo: "Envío express",
    plazo: "1 – 2 días hábiles",
    precio: "9,99€",
    gratis: "Gratis en pedidos +120€",
    desc: "Garantizamos la entrega en 48 horas para pedidos realizados antes de las 14:00.",
  },
  {
    icon: MapPin,
    titulo: "Recogida en tienda",
    plazo: "Disponible en 24h",
    precio: "Gratis",
    gratis: "Siempre gratis",
    desc: "Recoge tu pedido en nuestra tienda de Madrid. Te avisaremos cuando esté listo.",
  },
];

const PASOS = [
  {
    num: "01",
    titulo: "Haces tu pedido",
    desc: "Añade los productos al carrito y completa el proceso de pago de forma segura.",
  },
  {
    num: "02",
    titulo: "Preparamos tu pedido",
    desc: "Nuestro equipo empaqueta tu pedido con cuidado en un máximo de 24 horas.",
  },
  {
    num: "03",
    titulo: "Enviamos tu pedido",
    desc: "El transportista recoge el paquete y recibes un email con el número de seguimiento.",
  },
  {
    num: "04",
    titulo: "Recibes tu pedido",
    desc: "Tu pedido llega a la dirección indicada en el plazo estimado.",
  },
];

const FAQS = [
  {
    pregunta: "¿Cuándo recibiré mi pedido?",
    respuesta:
      "Los pedidos realizados antes de las 14:00 en días hábiles se procesan el mismo día. El plazo de entrega depende de la opción de envío elegida: estándar (3-5 días) o express (1-2 días).",
  },
  {
    pregunta: "¿Puedo cambiar la dirección de entrega?",
    respuesta:
      "Puedes modificar la dirección de entrega mientras el pedido no haya sido enviado. Una vez que el transportista lo recoge no podemos garantizar el cambio. Contacta con nosotros lo antes posible.",
  },
  {
    pregunta: "¿Qué pasa si no estoy en casa?",
    respuesta:
      "El transportista realizará un segundo intento de entrega. Si tampoco estás disponible, el paquete se depositará en el punto de recogida más cercano durante 15 días.",
  },
  {
    pregunta: "¿Enviáis a Canarias, Baleares y Ceuta?",
    respuesta:
      "Sí, enviamos a todo el territorio español. Los plazos de entrega pueden ser de 2 a 3 días adicionales y puede aplicarse un suplemento de envío.",
  },
  {
    pregunta: "¿Enviáis internacionalmente?",
    respuesta:
      "De momento solo enviamos a España y Portugal. Estamos trabajando para ampliar nuestros destinos próximamente.",
  },
  {
    pregunta: "¿Cómo puedo hacer un seguimiento de mi pedido?",
    respuesta:
      "Una vez enviado el pedido recibirás un email con el número de seguimiento y el enlace directo al transportista para que puedas rastrearlo en tiempo real.",
  },
];

const ZONAS = [
  {
    zona: "Península",
    estandar: "3 – 5 días",
    express: "1 – 2 días",
    precio: "4,99€ / 9,99€",
  },
  {
    zona: "Baleares",
    estandar: "5 – 7 días",
    express: "2 – 3 días",
    precio: "6,99€ / 12,99€",
  },
  {
    zona: "Canarias",
    estandar: "7 – 10 días",
    express: "3 – 5 días",
    precio: "8,99€ / 14,99€",
  },
  {
    zona: "Ceuta y Melilla",
    estandar: "7 – 10 días",
    express: "3 – 5 días",
    precio: "8,99€ / 14,99€",
  },
  {
    zona: "Portugal",
    estandar: "4 – 6 días",
    express: "2 – 3 días",
    precio: "5,99€ / 11,99€",
  },
];

export default function Shipping() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.wrap}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Política de envíos</p>
          <h1 className={styles.heroTitle}>
            Rápido, seguro
            <br />y sin sorpresas
          </h1>
          <p className={styles.heroDesc}>
            Enviamos a toda España con total transparencia en plazos y precios.
            Tu pedido llegará en perfectas condiciones o te lo reponemos.
          </p>
        </div>
      </section>

      {/* Banner envío gratis */}
      <div className={styles.bannerGratis}>
        <Truck size={18} />
        <p>
          Envío estándar <strong>GRATIS</strong> en pedidos superiores a 50€
        </p>
      </div>

      {/* Opciones de envío */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Opciones disponibles</p>
          <h2 className={styles.sectionTitle}>Elige cómo recibir tu pedido</h2>
        </div>
        <div className={styles.opcionesGrid}>
          {OPCIONES_ENVIO.map((op) => {
            const Icon = op.icon;
            return (
              <div key={op.titulo} className={styles.opcionCard}>
                <div className={styles.opcionHeader}>
                  <div className={styles.opcionIcon}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className={styles.opcionTitulo}>{op.titulo}</p>
                    <p className={styles.opcionPlazo}>{op.plazo}</p>
                  </div>
                </div>
                <p className={styles.opcionDesc}>{op.desc}</p>
                <div className={styles.opcionFooter}>
                  <span className={styles.opcionPrecio}>{op.precio}</span>
                  <span className={styles.opcionGratis}>{op.gratis}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pasos */}
      <section className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>El proceso</p>
          <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
        </div>
        <div className={styles.pasosGrid}>
          {PASOS.map((paso, i) => (
            <div key={paso.num} className={styles.pasoCard}>
              <p className={styles.pasoNum}>{paso.num}</p>
              <h3 className={styles.pasoTitulo}>{paso.titulo}</h3>
              <p className={styles.pasoDesc}>{paso.desc}</p>
              {i < PASOS.length - 1 && <div className={styles.pasoLinea} />}
            </div>
          ))}
        </div>
      </section>

      {/* Devoluciones */}
      <section className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.devolucionGrid}>
          <div>
            <p className={styles.eyebrow}>Sin complicaciones</p>
            <h2 className={styles.sectionTitle}>Política de devoluciones</h2>
            <p className={styles.texto}>
              Tienes <strong>30 días</strong> desde la recepción de tu pedido
              para devolver cualquier artículo sin dar explicaciones. El
              producto debe estar en perfecto estado, sin usar y con las
              etiquetas originales.
            </p>
            <p className={styles.texto} style={{ marginTop: "1rem" }}>
              Una vez recibamos la devolución, procesaremos el reembolso en un
              plazo máximo de <strong>5 días hábiles</strong> al método de pago
              original.
            </p>
            <div className={styles.devolucionSteps}>
              {[
                "Contacta con nosotros indicando el número de pedido",
                "Te enviamos la etiqueta de devolución por email",
                "Deposita el paquete en cualquier punto de recogida",
                "Recibe tu reembolso en 5 días hábiles",
              ].map((step, i) => (
                <div key={i} className={styles.devolucionStep}>
                  <span className={styles.devolucionNum}>{i + 1}</span>
                  <span className={styles.devolucionTexto}>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.devolucionImgWrap}>
            <img
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=60"
              alt="Devoluciones"
              className={styles.devolucionImg}
            />
          </div>
        </div>
      </section>

      {/* Garantías */}
      <section className={styles.section}>
        <div className={styles.garantiasGrid}>
          {[
            {
              icon: Shield,
              titulo: "Compra 100% segura",
              desc: "Todos los pagos están protegidos con cifrado SSL de 256 bits.",
            },
            {
              icon: Package,
              titulo: "Embalaje protegido",
              desc: "Cada pedido se empaqueta cuidadosamente para evitar daños durante el transporte.",
            },
            {
              icon: RefreshCw,
              titulo: "30 días para devolver",
              desc: "Si no estás satisfecho, te devolvemos el dinero sin preguntas.",
            },
            {
              icon: Truck,
              titulo: "Seguimiento en tiempo real",
              desc: "Recibe actualizaciones del estado de tu pedido en todo momento.",
            },
          ].map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.titulo} className={styles.garantiaCard}>
                <Icon size={22} className={styles.garantiaIcon} />
                <h3 className={styles.garantiaTitulo}>{g.titulo}</h3>
                <p className={styles.garantiaDesc}>{g.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Preguntas frecuentes</p>
          <h2 className={styles.sectionTitle}>Todo lo que necesitas saber</h2>
        </div>
        <div className={styles.faqList}>
          {FAQS.map((faq, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.pregunta}
                <ChevronDown
                  size={16}
                  className={`${styles.faqIcon} ${openFaq === i ? styles.faqIconOpen : ""}`}
                />
              </button>
              {openFaq === i && (
                <p className={styles.faqAnswer}>{faq.respuesta}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            ¿Tienes alguna duda sobre tu envío?
          </h2>
          <p className={styles.ctaDesc}>
            Nuestro equipo de atención al cliente está disponible para ayudarte.
          </p>
          <div className={styles.ctaBtns}>
            <Link to="/contact" className={styles.ctaBtnPrimary}>
              Contactar
            </Link>
            <Link to="/productos" className={styles.ctaBtnSecondary}>
              Ver productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
