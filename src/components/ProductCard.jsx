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
        
        {/* Mostrar colores desde variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="product-card-colors">
            {product.variants.slice(0, 3).map((variant, idx) => (
              <div
                key={idx}
                className={`product-card-color-circle ${variant.stock === 0 ? 'out-of-stock' : ''}`}
                style={{ backgroundColor: getColorHex(variant.color) }}
                title={`${variant.color} - ${variant.stock > 0 ? `${variant.stock} disponibles` : 'Agotado'}`}
              />
            ))}
            {product.variants.length > 3 && (
              <span className="color-count">+{product.variants.length - 3}</span>
            )}
          </div>
        )}
        
        {/* Mostrar rango de precios si hay variantes con diferentes precios */}
        <div className="product-card-price">
          {product.minPrice !== product.maxPrice ? (
            <>${product.minPrice?.toLocaleString('es-AR')} - ${product.maxPrice?.toLocaleString('es-AR')}</>
          ) : (
            <>${product.price?.toLocaleString('es-AR')}</>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ProductCard;
