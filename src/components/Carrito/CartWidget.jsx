import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './CartWidget.css';

const CartWidget = ({ onMenuClick }) => {
  const { totalItems } = useCart();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Mobile menu button (hamburger)
  const handleMobileMenuClick = () => {
    setMobileNavOpen(true);
  };
  const handleMobileMenuClose = () => {
    setMobileNavOpen(false);
  };

  return (
    <div className="cart-widget">
      {/* Mobile menu button, only visible on mobile */}

      <div className="cart-icon-container" onClick={onMenuClick} style={{ cursor: 'pointer' }}>
        <svg className="cart-icon" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14l.84-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.26-.25z"/>
        </svg>
        {totalItems > 0 && (
          <span className="cart-count">{totalItems}</span>
        )}
      </div>
      <button
        className="mobile-menu-btn"
        aria-label="Abrir menú"
        onClick={handleMobileMenuClick}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      {/* Mobile navbar sidebar (to be implemented) */}
      {mobileNavOpen && (
        <div className="mobile-navbar-overlay" onClick={handleMobileMenuClose}>
          <div className="mobile-navbar" onClick={e => e.stopPropagation()}>
            <button className="mobile-navbar-close" onClick={handleMobileMenuClose} aria-label="Cerrar menú">×</button>

            <div className="mobile-navbar-content">
              <div className="mobile-navbar__top">
                <a href="/" className="mobile-navbar__logo" aria-label="Ir al inicio">
                  <img
                    src="https://dcdn-us.mitiendanube.com/stores/005/572/435/themes/common/logo-361476303-1745245688-cc2c95556edd9c5e5c2d51e099859cfe1745245688.jpg?0"
                    alt="Haversack"
                  />
                </a>
                <nav className="mobile-navbar__menu" aria-label="Navegacion principal">
                  <a href="/" className="mobile-navbar-link active">Inicio</a>
                  <button type="button" className="mobile-navbar-link mobile-navbar-link--button" style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 700, fontSize: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    Productos <span aria-hidden="true">&gt;</span>
                  </button>
                  <a href="/contacto" className="mobile-navbar-link">Contacto</a>
                </nav>
              </div>
              <div className="mobile-navbar__bottom">
                <p className="mobile-navbar__social">INSTAGRAM</p>
                <div className="mobile-navbar-actions">
                  <a href="/registro" className="mobile-navbar-action">CREAR CUENTA</a>
                  <a href="/login" className="mobile-navbar-action">INGRESAR</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartWidget;
