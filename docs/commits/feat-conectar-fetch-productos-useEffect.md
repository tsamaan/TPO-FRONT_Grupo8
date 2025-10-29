# feat: conectar fetch de productos con useEffect

**Tipo**: Feature (Nueva funcionalidad)
**Fecha**: Integración frontend-backend
**Archivos modificados**: `src/services/api.js`, `src/App.jsx`, `src/App.css`, `src/components/CategoryFilter.jsx`

---

## 📋 Resumen

Implementación completa de la integración frontend-backend para mostrar productos, incluyendo servicio de fetch, componente React con useEffect, filtrado por categorías en tiempo real y interfaz visual responsive.

---

## 🔧 Cambios Implementados

### 1. Servicio API - `src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:3001'

export const fetchProducts = async (category = null) => {
  try {
    const url = category
      ? `${config.API_BASE_URL}/products?category=${category}`
      : `${config.API_BASE_URL}/products`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const products = await response.json()
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/products/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const product = await response.json()
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}
```

**Características del servicio**:
- **URL dinámica**: Construye query parameters para filtros
- **Error handling**: Valida respuestas HTTP y captura errores
- **Async/await**: Sintaxis moderna para promises
- **Reutilizable**: Funciones exportables para cualquier componente

### 2. Componente Principal - `src/App.jsx`

```javascript
import { useState, useEffect } from 'react'
import { fetchProducts } from './services/api'
import CategoryFilter from './components/CategoryFilter'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const category = selectedCategory || null
        const data = await fetchProducts(category)
        setProducts(data.data) // Accede a data.data por formato Express
      } catch (err) {
        setError(err.message)
        console.error('Failed to load products:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [selectedCategory]) // Re-ejecuta cuando cambia la categoría

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  if (loading) return <div>Cargando productos...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <>
      <h1>E-commerce - Productos</h1>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products">No se encontraron productos en esta categoría</div>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <p className="price">${product.price}</p>
              <p className="stock">Stock: {product.stock}</p>
              <div className="tags">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
```

**Estados implementados**:
- **products**: Array de productos del servidor
- **loading**: Indica si está cargando datos
- **error**: Almacena mensajes de error
- **selectedCategory**: Categoría seleccionada para filtrado

### 3. Filtro de Categorías - `src/components/CategoryFilter.jsx`

```javascript
import './CategoryFilter.css'

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'electronics', label: 'Electrónicos' },
    { value: 'clothing', label: 'Ropa' },
    { value: 'books', label: 'Libros' }
  ]

  return (
    <div className="category-filter">
      <label htmlFor="category-select">Filtrar por categoría:</label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        {categories.map(category => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CategoryFilter
```

**Funcionalidades**:
- **Controlled component**: Estado manejado por componente padre
- **Select dinámico**: Opciones mapeadas desde array
- **Accesibilidad**: Labels apropiados y IDs

### 4. Estilos CSS - `src/App.css` y `src/components/CategoryFilter.css`

```css
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
```

**Características visuales**:
- **Grid responsive**: Se adapta a diferentes tamaños de pantalla
- **Cards con hover**: Efectos visuales de interacción
- **Tags styled**: Diseño tipo chips para los tags

---

## 🎯 Funcionalidades Implementadas

### ✅ Carga Automática de Datos

**useEffect inicial**:
```javascript
useEffect(() => {
  const loadProducts = async () => {
    // Carga productos al montar el componente
  }
  loadProducts()
}, [selectedCategory])
```

- Ejecuta al montar el componente
- Re-ejecuta cuando cambia `selectedCategory`
- Maneja loading states y errores

### ✅ Filtrado Reactivo

**Cambio de categoría**:
1. Usuario selecciona categoría en dropdown
2. `handleCategoryChange` actualiza estado
3. `useEffect` detecta cambio en dependencias
4. Nueva llamada a API con filtro
5. UI se actualiza automáticamente

### ✅ Estados de UI

**Loading state**:
```javascript
if (loading) return <div>Cargando productos...</div>
```

**Error state**:
```javascript
if (error) return <div>Error: {error}</div>
```

**Empty state**:
```javascript
{products.length === 0 ? (
  <div className="no-products">No se encontraron productos en esta categoría</div>
) : (
  // Renderizar productos
)}
```

### ✅ Renderizado de Productos

**Mapeo dinámico**:
```javascript
products.map(product => (
  <div key={product.id} className="product-card">
    <img src={product.image} alt={product.name} />
    <h3>{product.name}</h3>
    <p className="price">${product.price}</p>
    <div className="tags">
      {product.tags.map((tag, index) => (
        <span key={index} className="tag">{tag}</span>
      ))}
    </div>
  </div>
))
```

---

## 🔄 Flujo de Datos Completo

### 1. Inicialización
```
App.jsx monta → useEffect ejecuta → fetchProducts() → API call → Response → setState(products)
```

### 2. Filtrado
```
Usuario selecciona categoría → handleCategoryChange → setSelectedCategory →
useEffect detecta cambio → fetchProducts(category) → API call con query →
Response filtrada → setState(products) → UI actualizada
```

### 3. Manejo de Errores
```
Fetch falla → catch error → setError(message) →
Conditional render muestra error → User ve mensaje
```

---

## 📊 Integración Frontend-Backend

### Request Format
```javascript
// Sin filtro
GET http://localhost:3001/products

// Con filtro
GET http://localhost:3001/products?category=electronics
```

### Response Format
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Smartphone Samsung Galaxy",
      "price": 299.99,
      "category": "electronics",
      "tags": ["smartphone", "samsung", "android"]
    }
  ]
}
```

### Data Access
```javascript
const data = await fetchProducts(category)
setProducts(data.data) // Accede al array dentro de data
```

---

## 🧪 Testing Manual

### Verificaciones Realizadas

**Carga inicial**:
1. Abrir aplicación → Ver "Cargando productos..."
2. Datos cargan → Grid de productos visible
3. Todas las categorías seleccionadas por defecto

**Filtrado funcional**:
1. Seleccionar "Electrónicos" → Solo productos electronics
2. Seleccionar "Ropa" → Solo productos clothing
3. Seleccionar "Todas" → Todos los productos

**Estados de error**:
1. Servidor offline → Mensaje de error
2. Network error → Error de conexión
3. Empty category → "No se encontraron productos"

**Responsive design**:
1. Resize ventana → Grid se adapta
2. Mobile view → Cards stack verticalmente
3. Hover effects → Transform y shadow funcionales

---

## 💡 Decisiones Técnicas

### useEffect Dependencies
```javascript
useEffect(() => {
  // ...
}, [selectedCategory])
```
- Dependency array con `selectedCategory`
- Re-ejecuta solo cuando cambia el filtro
- Evita llamadas API innecesarias

### Estado Local vs Props
- **products**: Estado local (datos del servidor)
- **selectedCategory**: Estado local (UI state)
- **CategoryFilter**: Recibe props (controlled component)

### Error Boundaries
```javascript
try {
  const data = await fetchProducts(category)
  setProducts(data.data)
} catch (err) {
  setError(err.message)
  console.error('Failed to load products:', err)
}
```
- Try/catch para async operations
- Console.error para debugging
- User-friendly error messages

### Performance Considerations
- **Loading states**: UX durante fetch
- **Conditional rendering**: Evita renders innecesarios
- **Key props**: Optimiza re-renders de listas

---

## 🔄 Próximos Pasos

Esta integración habilita:
1. ✅ Catálogo visual completo
2. ✅ Búsqueda y filtrado en tiempo real
3. ✅ Base para carrito de compras
4. ✅ Detalles de productos individuales
5. ✅ Paginación y más filtros avanzados

---

**Estado**: ✅ Completado y funcional
**Impacto**: Conexión completa frontend-backend, experiencia de usuario fluida para navegación de productos.