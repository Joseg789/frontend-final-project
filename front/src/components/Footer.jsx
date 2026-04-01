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
              <Link to="/hombre">Men</Link>
            </li>
            <li>
              <Link to="/mujer">Women</Link>
            </li>
            <li>
              <Link to="/kids">Kids</Link>
            </li>
            <li>
              <Link to="/sale">Sale</Link>
            </li>
          </ul>
        </div>

        {/* Columna 2 */}
        <div className="footer-column">
          <h3>HELP</h3>
          <ul>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/shipping">Shipping</Link>
            </li>
            <li>
              <Link to="/returns">Returns</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div className="footer-column">
          <h3>ABOUT</h3>
          <ul>
            <li>
              <Link to="/our-story">Our Story</Link>
            </li>
            <li>
              <Link to="/sustainability">Sustainability</Link>
            </li>
            <li>
              <Link to="/careers">Careers</Link>
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
          <a href="#" aria-label="Instagram">
            <InstagramIcon />
          </a>

          <a href="#" aria-label="Facebook">
            <FacebookIcon />
          </a>

          <a href="#" aria-label="X">
            <XIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
