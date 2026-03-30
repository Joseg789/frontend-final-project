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
              <a href="#">Men</a>
            </li>
            <li>
              <a href="#">Women</a>
            </li>
            <li>
              <a href="#">Kids</a>
            </li>
            <li>
              <a href="#">Sale</a>
            </li>
          </ul>
        </div>

        {/* Columna 2 */}
        <div className="footer-column">
          <h3>HELP</h3>
          <ul>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Shipping</a>
            </li>
            <li>
              <a href="#">Returns</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div className="footer-column">
          <h3>ABOUT</h3>
          <ul>
            <li>
              <a href="#">Our Story</a>
            </li>
            <li>
              <a href="#">Sustainability</a>
            </li>
            <li>
              <a href="#">Careers</a>
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
