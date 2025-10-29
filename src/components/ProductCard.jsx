import React from 'react';
import { getColorHex } from '../utils/colorUtils';
import './ProductCard.css';

const ProductCard = ({ product, inCart, onAdd, onRemove }) => {
  return (
    <div className="product-card">
      <img src={product.images?.[0] || product.image} alt={product.name} className="product-card-img" />
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-tags">
          {product.tags && product.tags.map((tag, idx) => (
            <span key={idx} className="product-card-tag">{tag}</span>
          ))}
        </div>
        {product.colores && product.colores.length > 0 && (
          <div className="product-card-colors">
            {product.colores.map((color, idx) => (
              <div
                key={idx}
                className="product-card-color-circle"
                style={{ backgroundColor: getColorHex(color) }}
                title={color}
              />
            ))}
            {product.colores.length > 3 && (
              <span className="color-count">+{product.colores.length - 3}</span>
            )}
          </div>
        )}
        <div className="product-card-price">${product.price.toLocaleString('es-AR')}</div>
        
      </div>
    </div>
  );
};

export default ProductCard;
