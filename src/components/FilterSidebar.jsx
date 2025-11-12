import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getColorHex } from '../utils/colorUtils';
import './FilterSidebar.css';

const FilterSidebar = ({ isOpen, onClose, products, onFilterChange }) => {
  const location = useLocation();
  
  const [filters, setFilters] = useState({
    sortBy: 'name',
    selectedColors: [],
    selectedTags: [],
    priceRange: { min: '', max: '' }
  });

  const categorias = [
    { nombre: 'Ver todos los productos', path: '/productos' },
    { nombre: 'Accesorios', path: '/productos/categoria/accesorios' },
    { nombre: 'Bolsos', path: '/productos/categoria/bolsos' },
    { nombre: 'Materos', path: '/productos/categoria/materos' },
    { nombre: 'Mochilas', path: '/productos/categoria/mochilas' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'newest', label: 'Mas Nuevos' },
    { value: 'popular', label: 'Mas Vendidos' }
  ];

  // Extraer colores unicos y contar productos por color
  const getAvailableColors = () => {
    const colorCounts = {};
    products.forEach(product => {
      if (product.colores && Array.isArray(product.colores)) {
        product.colores.forEach(color => {
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        });
      }
    });
    return Object.entries(colorCounts).map(([color, count]) => ({ color, count }));
  };

  // Extraer tags unicos y contar productos por tag
  const getAvailableTags = () => {
    const tagCounts = {};
    products.forEach(product => {
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(tagCounts).map(([tag, count]) => ({ tag, count }));
  };

  const availableColors = getAvailableColors();
  const availableTags = getAvailableTags();

  const handleSortChange = (sortValue) => {
    const newFilters = { ...filters, sortBy: sortValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleColorToggle = (color) => {
    const newSelectedColors = filters.selectedColors.includes(color)
      ? filters.selectedColors.filter(c => c !== color)
      : [...filters.selectedColors, color];
    
    const newFilters = { ...filters, selectedColors: newSelectedColors };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagToggle = (tag) => {
    const newSelectedTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    
    const newFilters = { ...filters, selectedTags: newSelectedTags };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (field, value) => {
    const newPriceRange = { ...filters.priceRange, [field]: value };
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      sortBy: 'name',
      selectedColors: [],
      selectedTags: [],
      priceRange: { min: '', max: '' }
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getColorButtonStyle = (color) => {
    // Importar desde utils
    const colorHex = getColorHex(color);

    return {
      backgroundColor: colorHex,
      border: filters.selectedColors.includes(color) ? '3px solid #333' : '2px solid #ddd'
    };
  };

  if (!isOpen) return null;

  return (
    <div className="filter-sidebar-overlay" onClick={onClose}>
      <aside className="filter-sidebar" onClick={e => e.stopPropagation()}>
        <div className="filter-sidebar-header">
          <h2>Filtros</h2>
          <button className="filter-sidebar-close" onClick={onClose}>&times;</button>
        </div>

        <div className="filter-sidebar-content">
          {/* Ordenar por */}
          <div className="filter-section">
            <h3>ORDENAR POR:</h3>
            <select 
              value={filters.sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Categorias */}
          <div className="filter-section">
            <h3>CATEGORiAS</h3>
            <div className="category-links">
              {categorias.map(cat => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  className={`category-link ${location.pathname === cat.path ? 'active' : ''}`}
                  onClick={onClose}
                >
                  {cat.nombre}
                </Link>
              ))}
            </div>
          </div>

          {/* Colores */}
          {availableColors.length > 0 && (
            <div className="filter-section">
              <h3>COLOR</h3>
              <div className="color-buttons">
                {availableColors.map(({ color, count }) => (
                  <button
                    key={color}
                    className={`color-button ${filters.selectedColors.includes(color) ? 'selected' : ''}`}
                    style={getColorButtonStyle(color)}
                    onClick={() => handleColorToggle(color)}
                    title={`${color} (${count})`}
                  >
                    <span className="color-label">{color}({count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags/Modelos */}
          {availableTags.length > 0 && (
            <div className="filter-section">
              <h3>MODELOS</h3>
              <div className="tag-buttons">
                {availableTags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    className={`tag-button ${filters.selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}({count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Marca */}
          <div className="filter-section">
            <h3>MARCA</h3>
            <div className="brand-filter">
              <span>Haversack({products.length})</span>
            </div>
          </div>

          {/* Precio */}
          <div className="filter-section">
            <h3>PRECIO</h3>
            <div className="price-range">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>DESDE</label>
                  <input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="price-input-group">
                  <label>HASTA</label>
                  <input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    placeholder="999999"
                  />
                </div>
              </div>
              <button 
                className="apply-price-button"
                onClick={() => onFilterChange(filters)}
              >
                APLICAR
              </button>
            </div>
          </div>

          {/* Boton limpiar filtros */}
          <div className="filter-section">
            <button className="clear-filters-button" onClick={clearFilters}>
              Limpiar Filtros
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default FilterSidebar;