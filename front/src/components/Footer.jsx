import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "../api";
import FacebookIcon from "./icons/FacebookIcon";
import InstagramIcon from "./icons/InstagramIcon";
import XIcon from "./icons/XIcon";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Introduce tu email");

    try {
      setLoading(true);
      await api.post("subscribe", { email });
      setDone(true);
      setEmail("");
      toast.success("¡Suscrito! Revisa tu email para tu cupón SAVE10");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al suscribirse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Columna 1 */}
        <div className="footer-column">
          <h3>Shop</h3>
          <ul>
            <li>
              <Link to="/hombre">Hombre</Link>
            </li>
            <li>
              <Link to="/mujer">Mujer</Link>
            </li>
            <li>
              <Link to="/productos">Todos los productos</Link>
            </li>
          </ul>
        </div>

        {/* Columna 2 */}
        <div className="footer-column">
          <h3>Ayuda</h3>
          <ul>
            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
            <li>
              <Link to="/envios">Envíos</Link>
            </li>
            <li>
              <Link to="/nosotros">Nosotros</Link>
            </li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div className="footer-column">
          <h3>Legal</h3>
          <ul>
            <li>
              <Link to="/privacidad">Privacidad</Link>
            </li>
            <li>
              <Link to="/terminos">Términos</Link>
            </li>
            <li>
              <Link to="/cookies">Cookies</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-column newsletter">
          <h3>Únete</h3>

          {done ? (
            <div className="newsletter-success">
              <p className="newsletter-success-icon">🎉</p>
              <p className="newsletter-success-text">
                ¡Suscrito! Revisa tu email — te hemos enviado el cupón
                <strong> SAVE10</strong> para un 10% de descuento.
              </p>
            </div>
          ) : (
            <>
              <p>
                Suscríbete y recibe un <strong>10% de descuento</strong> en tu
                primera compra.
              </p>

              <div className="coupon-preview">
                <span className="coupon-code">SAVE10</span>
                <span className="coupon-off">−10%</span>
              </div>

              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? "..." : "→"}
                </button>
              </form>

              <p className="newsletter-hint">
                Sin spam. Darte de baja cuando quieras.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 MyShop. All rights reserved.</p>
        <div className="socials">
          <Link to="#" aria-label="Instagram">
            <InstagramIcon />
          </Link>
          <Link to="#" aria-label="Facebook">
            <FacebookIcon />
          </Link>
          <Link to="#" aria-label="X">
            <XIcon />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
