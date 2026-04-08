// Contacto.jsx
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import styles from "./Contact.module.css";
import { Link } from "react-router-dom";
import api from "../api";

const INFO = [
  {
    icon: Mail,
    titulo: "Email",
    linea1: "hola@tienda.com",
    linea2: "soporte@tienda.com",
  },
  {
    icon: Phone,
    titulo: "Teléfono",
    linea1: "+34 900 123 456",
    linea2: "Lun–Vie 9:00–18:00",
  },
  {
    icon: MapPin,
    titulo: "Dirección",
    linea1: "Calle Mayor 24, 3º B",
    linea2: "28013 Madrid, España",
  },
  {
    icon: Clock,
    titulo: "Horario",
    linea1: "Lun–Vie: 9:00–18:00",
    linea2: "Sáb: 10:00–14:00",
  },
];

const TEMAS = [
  "Consulta general",
  "Pedido existente",
  "Devolución",
  "Producto",
  "Otro",
];

const EMPTY_FORM = {
  nombre: "",
  email: "",
  tema: "Consulta general",
  mensaje: "",
};

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje)
      return toast.error("Rellena todos los campos");

    setLoading(true);
    try {
      await api.post("contact", form);
      toast.success("Mensaje enviado correctamente. Te responderemos pronto.");
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Estamos aquí</p>
          <h1 className={styles.heroTitle}>Contacta con nosotros</h1>
          <p className={styles.heroDesc}>
            ¿Tienes alguna pregunta sobre nuestros productos o tu pedido?
            Escríbenos y te responderemos en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* Info cards */}
      <section className={styles.infoSection}>
        <div className={styles.infoGrid}>
          {INFO.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.titulo} className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className={styles.infoTitulo}>{item.titulo}</p>
                  <p className={styles.infoLinea}>{item.linea1}</p>
                  <p className={styles.infoLinea}>{item.linea2}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Formulario + Mapa */}
      <section className={styles.section}>
        <div className={styles.mainGrid}>
          {/* Formulario */}
          <div>
            <p className={styles.eyebrow}>Escríbenos</p>
            <h2 className={styles.sectionTitle}>Envíanos un mensaje</h2>
            <p className={styles.texto} style={{ marginBottom: "2rem" }}>
              Completa el formulario y nuestro equipo se pondrá en contacto
              contigo lo antes posible.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Tema</label>
                <select
                  name="tema"
                  value={form.tema}
                  onChange={handleChange}
                  className={styles.input}
                >
                  {TEMAS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Mensaje</label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  className={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.btnSubmit}
              >
                {loading ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send size={15} />
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Mapa */}
          <div className={styles.mapaWrap}>
            <p className={styles.eyebrow}>Ubicación</p>
            <h2 className={styles.sectionTitle}>Dónde encontrarnos</h2>
            <p className={styles.texto} style={{ marginBottom: "1.5rem" }}>
              Visítanos en nuestra tienda física en el centro de Madrid.
            </p>
            <div className={styles.mapa}>
              <iframe
                title="Mapa tienda"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6!2d-3.7037!3d40.4168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287d0f7f0f33%3A0x1e3c7b0e2b0b0b0b!2sMadrid%2C%20Spain!5e0!3m2!1sen!2ses!4v1620000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>¿Prefieres hablar directamente?</h2>
          <p className={styles.ctaDesc}>
            Llámanos o escríbenos por email y te atenderemos de inmediato.
          </p>
          <div className={styles.ctaBtns}>
            <Link to="tel:+34900123456" className={styles.ctaBtnPrimary}>
              <Phone size={15} /> Llamar ahora
            </Link>
            <Link
              to="mailto:hola@tienda.com"
              className={styles.ctaBtnSecondary}
            >
              <Mail size={15} /> Enviar email
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
