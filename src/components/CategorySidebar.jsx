import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CategorySidebar.css';

const categorias = [
  { nombre: 'Ver todos los productos', path: '/productos' },
  { nombre: 'Accesorios', path: '/productos/categoria/accesorios' },
  { nombre: 'Bolsos', path: '/productos/categoria/bolsos' },
  { nombre: 'Materos', path: '/productos/categoria/materos' },
  { nombre: 'Mochilas', path: '/productos/categoria/mochilas' },
];

const CategorySidebar = ({ open, onClose }) => {
  const location = useLocation();
  if (!open) return null;
  return (
    <div className="category-sidebar-overlay" onClick={onClose}>
      <aside className="category-sidebar" onClick={e => e.stopPropagation()}>
        <div className="category-sidebar-header">
          <button className="category-sidebar-close" onClick={onClose}>&times;</button>
          <h2>Productos</h2>
        </div>
        <nav className="category-sidebar-nav">
          {categorias.map(cat => (
            <Link
              key={cat.path}
              to={cat.path}
              className={`category-link${location.pathname === cat.path ? ' active' : ''}`}
              onClick={onClose}
            >
              {cat.nombre}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default CategorySidebar;
