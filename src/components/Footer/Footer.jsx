import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-col--links">
            <ul>
              <li><a href="/">INICIO</a></li>
              <li><a href="/productos">PRODUCTOS</a></li>
            </ul>
          </div>

          {/* <div className="footer-col footer-col--center">
            <div className="newsletter">
              <input type="text" placeholder="Suscribite al newsletter..." aria-label="newsletter" />
              <button aria-label="subscribe">+</button>
            </div>
          </div> */}

          <div className="footer-col footer-col--contact">
            <h4>INSTAGRAM</h4>
            <p>WhatsApp: 5411511783645</p>
            <p>haversack.ventas@gmail.com</p>
            <p>Punta arenas 1326, La paternal, CABA</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>
            Defensa de las y los consumidores. Para reclamos <a href="#">ingresa aca</a>.
            {' '}/{' '}
            <a href="#">Boton de arrepentimiento</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;