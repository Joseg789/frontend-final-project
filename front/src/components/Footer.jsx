import { Link } from "react-router-dom";
import FacebookIcon from "./icons/FacebookIcon";
import InstagramIcon from "./icons/InstagramIcon";
import XIcon from "./icons/XIcon";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Columna 1 */}
        <div className="footer-column">
          <h3>SHOP</h3>
          <ul>
            <li>
              <Link to="/hombre">Hombre</Link>
            </li>
            <li>
              <Link to="/mujer">Mujer</Link>
            </li>
          </ul>
        </div>

        {/* Columna 2 */}
        <div className="footer-column">
          <h3>Ayuda</h3>
          <ul>
            <li>
              <Link to="/contact">Contacto</Link>
            </li>
            <li>
              <Link to="/shipping">Shipping</Link>
            </li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div className="footer-column">
          <h3>Quienes somos?</h3>
          <ul>
            <li>
              <Link to="/nosotros">Nuestra Historia</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-column newsletter">
          <h3>JOIN US</h3>
          <p>Subscribe for updates and offers</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button>→</button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 Your Brand. All rights reserved.</p>
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
