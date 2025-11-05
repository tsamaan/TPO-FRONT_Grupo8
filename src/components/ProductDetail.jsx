import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useParams } from 'react-router-dom';
import { getColorHex } from '../utils/colorUtils';
import ProductImageCarousel from './ProductImageCarousel';
import './ProductDetail.css';

const cuotas = 24;
const descuento = 0.46; // 46% OFF como en el ejemplo

// SVGs de medios de pago (inline para no depender de imágenes externas)
const visaSVG = (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="38" height="24" rx="3" fill="#fff"/><text x="7" y="17" fontSize="13" fontFamily="Arial" fill="#1A1F71">VISA</text></svg>
);
const mastercardSVG = (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="38" height="24" rx="3" fill="#fff"/><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8"/><text x="7" y="21" fontSize="7" fontFamily="Arial" fill="#222">MC</text></svg>
);
const mercadopagoSVG = (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="38" height="24" rx="3" fill="#fff"/><ellipse cx="19" cy="12" rx="10" ry="7" fill="#00B1EA"/><text x="8" y="17" fontSize="8" fontFamily="Arial" fill="#fff">MPago</text></svg>
);

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading: productsLoading } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const { addToCart, cart } = useCart();

  useEffect(() => {
    console.log('=== ProductDetail Debug ===');
    console.log('ID de URL:', id);
    console.log('Productos cargados:', products.length);
    console.log('Loading:', productsLoading);
    
    if (products.length > 0) {
      // Buscar el producto localmente en el contexto
      const foundProduct = products.find(p => 
        p.id === parseInt(id) || 
        p.id === id || 
        String(p.id) === String(id)
      );
      console.log('Producto encontrado:', foundProduct ? foundProduct.name : 'NO ENCONTRADO');
      console.log('Variantes:', foundProduct?.variants);
      
      if (foundProduct) {
        setProduct(foundProduct);
        setNotFound(false);
        
        // Seleccionar primera variante disponible automáticamente
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          const firstAvailable = foundProduct.variants.find(
            v => v.available && v.stock > 0
          );
          setSelectedVariant(firstAvailable || foundProduct.variants[0]);
          console.log('Variante seleccionada:', firstAvailable || foundProduct.variants[0]);
        }
      } else {
        setProduct(null);
        setNotFound(true);
      }
    } else if (!productsLoading) {
      setNotFound(true);
    }
  }, [id, products, productsLoading]);

  // Mostrar loading mientras se cargan los productos
  if (productsLoading) {
    console.log('Mostrando loading...');
    return <div className="product-detail-loading">Cargando productos...</div>;
  }

  // Si no hay productos después de cargar
  if (products.length === 0) {
    console.log('No hay productos cargados');
    return <div className="product-detail-error">No se pudieron cargar los productos.</div>;
  }

  // Si el producto no se encontró
  if (notFound || !product) {
    console.log('Producto no encontrado, ID:', id);
    return <div className="product-detail-error">Producto no encontrado (ID: {id}).</div>;
  }

  console.log('Renderizando producto:', product.name);

  // Adaptar campos del producto
  const nombre = product.name || product.nombre;
  const descripcion = product.description || product.descripcion;
  
  // Usar imagen de la variante seleccionada o imagen por defecto del producto
  let imagen = selectedVariant?.imageUrl || product.images?.[0] || product.image || product.imagen;
  if (imagen && imagen.startsWith('.')) {
    imagen = imagen.replace(/^\./, '').replace(/\\/g, '/').replace(/\//g, '/');
  }
  
  // Usar precio de la variante seleccionada o precio base del producto
  const precio = selectedVariant?.finalPrice || Number(product.price || product.precio);
  
  // Stock de la variante seleccionada o stock total del producto
  const stock = selectedVariant?.stock || Number(product.totalStock || product.stock || 0);
  
  const categoria = product.category || product.categoria;
  
  // La categoría puede ser un objeto { id, name } o un string
  const categoriaNombre = typeof categoria === 'object' && categoria?.name 
    ? categoria.name 
    : (typeof categoria === 'string' ? categoria : 'CATEGORÍA');

  // Cálculo de precios y cuotas
  const precioOriginal = precio ? (precio / (1 - descuento)).toFixed(2) : null;
  const precioCuota = precio ? (precio / cuotas).toFixed(2) : null;

  // Calcular cantidad ya agregada al carrito de esta variante específica
  const cantidadEnCarrito = selectedVariant 
    ? cart.find(item => item.sku === selectedVariant.sku)?.quantity || 0
    : cart.find(item => item.id === product?.id)?.quantity || 0;
    
  const stockDisponible = stock - cantidadEnCarrito;

  // Manejar selección de color (variante)
  const handleVariantSelect = (variant) => {
    console.log('Variante seleccionada:', variant);
    setSelectedVariant(variant);
    setCantidad(1); // Resetear cantidad al cambiar variante
  };

  const handleCantidad = (val) => {
    if (isNaN(val) || val < 1) val = 1;
    if (val > stockDisponible) val = stockDisponible;
    setCantidad(val);
  };

  const handleDecrease = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const handleIncrease = () => {
    if (cantidad < stockDisponible) {
      setCantidad(cantidad + 1);
    }
  };

  const handleAddCart = () => {
    // Si hay variantes, verificar que se haya seleccionado una
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      alert('Por favor selecciona un color');
      return;
    }
    
    if (cantidad > stockDisponible) {
      alert('No puedes agregar más productos de los que hay en stock disponible');
      return;
    }
    
    // Armar el objeto producto con los campos que espera el carrito
    const productoParaCarrito = {
      id: product.id,
      variantId: selectedVariant?.id,
      sku: selectedVariant?.sku || product.id,
      name: nombre,
      price: precio,
      image: imagen,
      images: product.images || [imagen],
      stock: stock,
      category: categoriaNombre,
      color: selectedVariant?.color,
      size: selectedVariant?.size
    };
    addToCart(productoParaCarrito, cantidad);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="product-detail-haversack">
      <div className="product-detail-haversack-imgbox">
        <ProductImageCarousel
          images={product.images || [imagen].filter(Boolean)}
          productName={nombre}
        />
      </div>
      <div className="product-detail-haversack-info">
        <div className="product-detail-haversack-breadcrumb">
          INICIO {'>'} PRODUCTOS {'>'} {categoriaNombre?.toUpperCase() || 'CATEGORÍA'} {'>'} {nombre}
        </div>
        <h1 className="product-detail-haversack-title">{nombre}</h1>
        <div className="product-detail-haversack-prices">
          <span className="product-detail-haversack-price">${precio?.toLocaleString('es-AR')}</span>
          {precioOriginal && (
            <span className="product-detail-haversack-original">${Number(precioOriginal).toLocaleString('es-AR')}</span>
          )}
          <span className="product-detail-haversack-off">46% OFF</span>
        </div>
        <div className="product-detail-haversack-descuento">
          <span className="product-detail-haversack-descuento-rojo">10% de descuento</span> pagando con Transferencia o depósito
        </div>
        <div className="product-detail-haversack-cuotas">
          {cuotas} cuotas de <b>${precioCuota}</b>
        </div>
        <div className="product-detail-haversack-pagos">
          <span title="Visa">{visaSVG}</span>
          <span title="Mastercard">{mastercardSVG}</span>
          <span title="MercadoPago">{mercadopagoSVG}</span>
          <a href="#" className="product-detail-haversack-link">Ver medios de pago</a>
        </div>
        
        {/* Selector de Variantes (Colores) */}
        {product.variants && product.variants.length > 0 && (
          <div className="product-detail-variant-selector">
            <h3 className="variant-selector-title">Seleccionar Color:</h3>
            <div className="variant-options">
              {product.variants.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantSelect(variant)}
                  disabled={!variant.available || variant.stock === 0}
                  className={`variant-option ${selectedVariant?.id === variant.id ? 'selected' : ''} ${!variant.available || variant.stock === 0 ? 'unavailable' : ''}`}
                  title={`${variant.color}${variant.size ? ` - ${variant.size}` : ''} - ${variant.stock} disponibles`}
                >
                  <div className="variant-color-circle" style={{ backgroundColor: getColorHex(variant.color) }}></div>
                  <div className="variant-info">
                    <span className="variant-name">{variant.color}</span>
                    {variant.size && <span className="variant-size">{variant.size}</span>}
                    <span className="variant-stock">
                      {variant.stock > 0 ? `${variant.stock} disponibles` : 'Agotado'}
                    </span>
                  </div>
                  {selectedVariant?.id === variant.id && (
                    <div className="variant-checkmark">✓</div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Información de la variante seleccionada */}
            {selectedVariant && (
              <div className="selected-variant-info">
                <span className="info-label">Seleccionado:</span>
                <span className="info-value">
                  {selectedVariant.color}
                  {selectedVariant.size && ` - ${selectedVariant.size}`}
                  {' '}({selectedVariant.stock} disponibles)
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className="product-detail-haversack-cantidad">
          <span>Cantidad</span>
          <div className="cart-item-controls">
            <button onClick={handleDecrease} disabled={cantidad <= 1}>-</button>
            <span>{cantidad}</span>
            <button onClick={handleIncrease} disabled={cantidad >= stockDisponible}>+</button>
          </div>
          <div className="product-detail-haversack-stockinfo">
            Stock disponible: {stockDisponible}
            {cantidadEnCarrito > 0 && (
              <span> (ya agregaste {cantidadEnCarrito} al carrito)</span>
            )}
          </div>
        </div>
        <button
          className="product-detail-haversack-addcart"
          onClick={handleAddCart}
          disabled={stockDisponible < 1}
          style={stockDisponible < 1 ? { background: '#ccc', color: '#666', cursor: 'not-allowed' } : {}}
        >
          {stockDisponible < 1 ? 'NO HAY STOCK' : (added ? '¡AGREGADO!' : 'AGREGAR AL CARRITO')}
        </button>
        <div className="product-detail-haversack-description">
          <b>{nombre}</b>: {descripcion}
        </div>
        {product.colores && product.colores.length > 0 && (
          <div className="product-detail-haversack-colors">
            <b>Colores disponibles:</b>
            <div className="colors-list">
              {product.colores.map((color, index) => (
                <div key={index} className="color-option">
                  <div
                    className="color-circle"
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
                  />
                  <span className="color-name">{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="product-detail-haversack-stock">
          <b>Stock:</b> {stock}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
