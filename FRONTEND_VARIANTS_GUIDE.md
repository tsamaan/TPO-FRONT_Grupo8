# Frontend - Guía de Actualización para Variantes

## 📋 Cambios Necesarios en el Frontend

### 1. Actualizar Tipado de Productos

El objeto `product` ahora tiene esta estructura:

```javascript
{
  id: "1",
  name: "Mochila Urbana",
  price: 15000,           // Precio base
  minPrice: 15000,        // Precio mínimo de variantes
  maxPrice: 15000,        // Precio máximo de variantes
  totalStock: 15,         // Stock total
  colores: ["Negro", "Rojo", "Azul"],  // Para compatibilidad
  variants: [             // ⭐ NUEVO: Array de variantes
    {
      id: 1,
      sku: "1-NEGRO",
      color: "Negro",
      size: null,
      stock: 5,
      priceModifier: 0,
      finalPrice: 15000,
      imageUrl: "/img/negro.jpg",
      available: true
    },
    // ...más variantes
  ]
}
```

### 2. Actualizar ProductDetail.jsx

```jsx
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading: productsLoading } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  
  const { addToCart, cart } = useCart();

  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      const foundProduct = products.find(p => 
        p.id === parseInt(id) || p.id === id || String(p.id) === String(id)
      );
      setProduct(foundProduct);
      
      // Seleccionar primera variante disponible automáticamente
      if (foundProduct?.variants && foundProduct.variants.length > 0) {
        const firstAvailable = foundProduct.variants.find(
          v => v.available && v.stock > 0
        );
        setSelectedVariant(firstAvailable || foundProduct.variants[0]);
      }
    }
  }, [id, products, productsLoading]);

  // Calcular stock disponible del color seleccionado
  const stockDisponible = selectedVariant?.stock || 0;

  const handleColorSelect = (variant) => {
    setSelectedVariant(variant);
    setCantidad(1); // Resetear cantidad al cambiar color
  };

  const handleAddCart = () => {
    if (!selectedVariant) {
      alert('Por favor selecciona un color');
      return;
    }
    
    if (cantidad > stockDisponible) {
      alert('No hay suficiente stock disponible');
      return;
    }
    
    // Agregar al carrito con información de la variante
    const productoParaCarrito = {
      id: product.id,
      variantId: selectedVariant.id,
      sku: selectedVariant.sku,
      name: product.name,
      price: selectedVariant.finalPrice,
      image: selectedVariant.imageUrl || product.image,
      color: selectedVariant.color,
      size: selectedVariant.size,
      stock: selectedVariant.stock,
      category: product.category
    };
    
    addToCart(productoParaCarrito, cantidad);
  };

  if (productsLoading) return <div>Cargando...</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="product-detail">
      {/* Imagen del producto (cambiar según variante seleccionada) */}
      <div className="product-images">
        <img 
          src={selectedVariant?.imageUrl || product.image} 
          alt={product.name}
        />
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="description">{product.description}</p>
        
        {/* Mostrar precio de la variante seleccionada */}
        <div className="price">
          ${selectedVariant?.finalPrice?.toLocaleString('es-AR') || product.price?.toLocaleString('es-AR')}
        </div>

        {/* Selector de Colores */}
        <div className="color-selector">
          <h3>Seleccionar Color:</h3>
          <div className="color-options">
            {product.variants?.map(variant => (
              <button
                key={variant.id}
                onClick={() => handleColorSelect(variant)}
                disabled={!variant.available || variant.stock === 0}
                className={`color-option ${selectedVariant?.id === variant.id ? 'selected' : ''} ${!variant.available || variant.stock === 0 ? 'unavailable' : ''}`}
              >
                <span className="color-name">{variant.color}</span>
                <span className="color-stock">
                  {variant.stock > 0 ? `${variant.stock} disponibles` : 'Agotado'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stock disponible del color seleccionado */}
        <div className="stock-info">
          {stockDisponible > 0 ? (
            <span className="stock-available">✓ {stockDisponible} unidades disponibles</span>
          ) : (
            <span className="stock-unavailable">✗ Sin stock</span>
          )}
        </div>

        {/* Cantidad */}
        <div className="quantity-selector">
          <label>Cantidad:</label>
          <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
          <input 
            type="number" 
            value={cantidad} 
            onChange={(e) => setCantidad(Math.min(stockDisponible, Math.max(1, parseInt(e.target.value) || 1)))}
            min="1"
            max={stockDisponible}
          />
          <button onClick={() => setCantidad(Math.min(stockDisponible, cantidad + 1))}>+</button>
        </div>

        {/* Botón Agregar al Carrito */}
        <button 
          className="add-to-cart-btn"
          onClick={handleAddCart}
          disabled={!selectedVariant || stockDisponible === 0}
        >
          {stockDisponible > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
```

### 3. Actualizar CartContext.jsx

El carrito debe manejar variantes por SKU:

```jsx
// Modificar addToCart para manejar variantes
const addToCart = (product, quantity = 1) => {
  setCart(prevCart => {
    // Buscar si ya existe este SKU en el carrito
    const existingIndex = prevCart.findIndex(
      item => item.sku === product.sku
    );

    if (existingIndex >= 0) {
      // Ya existe, aumentar cantidad
      const newCart = [...prevCart];
      newCart[existingIndex].quantity += quantity;
      return newCart;
    } else {
      // No existe, agregar nuevo
      return [...prevCart, { 
        ...product, 
        quantity,
        cartItemId: `${product.id}-${product.sku}` // ID único para el item del carrito
      }];
    }
  });
};
```

### 4. CSS para Selector de Colores

```css
.color-selector {
  margin: 2rem 0;
}

.color-selector h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.color-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.color-option {
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.color-option:hover:not(:disabled) {
  border-color: #b63939;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(182, 57, 57, 0.2);
}

.color-option.selected {
  border-color: #b63939;
  background: #fff5f5;
  font-weight: bold;
}

.color-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.color-option.unavailable {
  text-decoration: line-through;
}

.color-name {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.color-stock {
  font-size: 0.85rem;
  color: #666;
}

.stock-info {
  margin: 1rem 0;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.95rem;
}

.stock-available {
  color: #28a745;
  background: #d4edda;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.stock-unavailable {
  color: #dc3545;
  background: #f8d7da;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
```

### 5. Verificación de Compatibilidad

El backend mantiene compatibilidad, por lo que el frontend antiguo seguirá funcionando:

- `product.colores` sigue disponible (lista de colores)
- `product.totalStock` sigue calculándose
- `product.price` sigue siendo el precio base

Pero para aprovechar el nuevo sistema, necesitas usar `product.variants`.

## 🧪 Testing

1. **Verificar que el backend devuelve variantes:**
   ```bash
   curl http://localhost:8080/api/products/1
   ```

2. **Verificar en el componente ProductDetail:**
   ```jsx
   console.log('Producto:', product);
   console.log('Variantes:', product.variants);
   console.log('Variante seleccionada:', selectedVariant);
   ```

3. **Probar casos:**
   - Seleccionar diferentes colores
   - Intentar agregar más cantidad que el stock disponible
   - Agregar al carrito y verificar que guarde el SKU correcto
   - Producto sin stock en un color específico

## 📝 Notas Importantes

- Cada variante tiene su propio `stock` independiente
- El `sku` identifica de manera única cada variante
- `finalPrice` puede ser diferente del precio base del producto
- `imageUrl` de la variante debe mostrarse al seleccionar ese color
- El carrito debe guardar `sku` y `variantId` además del `productId`
