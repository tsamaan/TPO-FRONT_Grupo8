import React from 'react';
import { useLocation } from 'react-router-dom';
import './FilterWidget.css';


const FilterWidget = ({ onFilterClick, productCount = 0, isOpen = false }) => {
  const location = useLocation();

  // Show filter widget only on product pages
  const showFilterWidget = location.pathname.startsWith('/productos');

  if (!showFilterWidget) return null;

  return (
    <button className="filter-widget" onClick={onFilterClick} aria-label={isOpen ? 'Cerrar filtros' : 'Abrir filtros'}>
      {isOpen ? (
        // Ícono de X
        <svg className="filter-icon-main" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        // Ícono de sliders
        <svg className="filter-icon-main" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M7 12h10M10 18h4"></path>
        </svg>
      )}
    </button>
  );
};

export default FilterWidget;