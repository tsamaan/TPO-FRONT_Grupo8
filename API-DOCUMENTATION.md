# API Documentation - api.js

Documentación completa del cliente API para interactuar con JSON Server.

## 📚 Tabla de Contenidos

- [Configuración](#configuración)
- [Productos](#productos)
- [Usuarios](#usuarios)
- [Carrito de Compras](#carrito-de-compras)
- [Manejo de Errores](#manejo-de-errores)
- [Ejemplos de Uso](#ejemplos-de-uso)

## ⚙️ Configuración

**Base URL**: `http://localhost:3001`
**Servidor**: JSON Server en puerto 3001

```javascript
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchUsers,
  fetchCart,
  createCartItem
} from './src/services/api.js'
```

## 🛍️ Productos

### `fetchProducts(category?)`

Obtiene todos los productos o filtrados por categoría.

**Parámetros:**
- `category` (opcional): String - Filtrar por categoría

**Retorna:** `Promise<Array>` - Lista de productos

**Ejemplo:**
```javascript
// Todos los productos
const allProducts = await fetchProducts()

// Productos por categoría
const electronics = await fetchProducts('electronics')
const clothing = await fetchProducts('clothing')
const books = await fetchProducts('books')
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Smartphone Samsung Galaxy",
    "price": 299.99,
    "description": "Smartphone con pantalla de 6.1 pulgadas",
    "image": "https://...",
    "category": "electronics",
    "stock": 15,
    "tags": ["smartphone", "samsung", "android"]
  }
]
```

### `fetchProductById(id)`

Obtiene un producto específico por ID.

**Parámetros:**
- `id` (requerido): Number - ID del producto

**Retorna:** `Promise<Object>` - Producto específico

**Ejemplo:**
```javascript
const product = await fetchProductById(1)
console.log(product.name) // "Smartphone Samsung Galaxy"
```

### `createProduct(productData)`

Crea un nuevo producto.

**Parámetros:**
- `productData` (requerido): Object - Datos del producto

**Retorna:** `Promise<Object>` - Producto creado con ID

**Ejemplo:**
```javascript
const newProduct = await createProduct({
  name: "Tablet Nueva",
  price: 199.99,
  description: "Tablet con pantalla HD",
  image: "https://...",
  category: "electronics",
  stock: 10,
  tags: ["tablet", "android", "hd"]
})
```

### `updateProduct(id, productData)`

Actualiza un producto existente.

**Parámetros:**
- `id` (requerido): Number - ID del producto
- `productData` (requerido): Object - Nuevos datos del producto

**Retorna:** `Promise<Object>` - Producto actualizado

**Ejemplo:**
```javascript
const updatedProduct = await updateProduct(1, {
  name: "Smartphone Samsung Galaxy S24",
  price: 349.99,
  stock: 20
})
```

### `deleteProduct(id)`

Elimina un producto.

**Parámetros:**
- `id` (requerido): Number - ID del producto

**Retorna:** `Promise<boolean>` - true si se eliminó correctamente

**Ejemplo:**
```javascript
const deleted = await deleteProduct(1)
if (deleted) {
  console.log('Producto eliminado')
}
```

## 👥 Usuarios

### `fetchUsers()`

Obtiene todos los usuarios registrados.

**Retorna:** `Promise<Array>` - Lista de usuarios

**Ejemplo:**
```javascript
const users = await fetchUsers()
console.log(users.length) // Número de usuarios
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "email": "test@haversack.com",
    "password": "test123",
    "nombre": "Test",
    "apellido": "User",
    "usuario": "testuser",
    "name": "Test User",
    "address": "Test Address",
    "phone": "+54 11 0000-0000"
  }
]
```

**⚠️ Nota de Seguridad**: En producción, las contraseñas no deberían ser visibles en las respuestas.

## 🛒 Carrito de Compras

### `fetchCart(userId?)`

Obtiene carritos de compra, opcionalmente filtrados por usuario.

**Parámetros:**
- `userId` (opcional): Number - ID del usuario

**Retorna:** `Promise<Array>` - Lista de carritos

**Ejemplo:**
```javascript
// Todos los carritos
const allCarts = await fetchCart()

// Carrito de un usuario específico
const userCart = await fetchCart(1)
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "products": [
      {
        "productId": 1,
        "quantity": 1,
        "price": 299.99
      }
    ],
    "total": 299.99,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
]
```

### `createCartItem(cartData)`

Crea un nuevo elemento en el carrito.

**Parámetros:**
- `cartData` (requerido): Object - Datos del carrito

**Retorna:** `Promise<Object>` - Carrito creado con ID

**Ejemplo:**
```javascript
const cartItem = await createCartItem({
  userId: 1,
  products: [
    {
      productId: 2,
      quantity: 1,
      price: 59.99
    }
  ],
  total: 59.99,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})
```

## ⚠️ Manejo de Errores

Todas las funciones pueden lanzar errores que deben ser manejados:

```javascript
try {
  const products = await fetchProducts()
} catch (error) {
  console.error('Error fetching products:', error)
  // Manejar error apropiadamente
}
```

**Tipos de errores comunes:**
- **Network Error**: Servidor no disponible
- **HTTP 404**: Recurso no encontrado
- **HTTP 500**: Error interno del servidor
- **JSON Parse Error**: Respuesta malformada

## 📋 Ejemplos de Uso Completos

### Búsqueda y Filtrado de Productos

```javascript
// Buscar productos de electrónicos
const electronics = await fetchProducts('electronics')

// Encontrar producto específico
const smartphone = electronics.find(p =>
  p.tags.includes('smartphone')
)

console.log(`Encontrado: ${smartphone.name}`)
```

### Gestión de Carrito

```javascript
// Obtener carrito del usuario
const userCarts = await fetchCart(1)
const currentCart = userCarts[0]

// Agregar producto al carrito
const newCartItem = await createCartItem({
  userId: 1,
  products: [
    ...currentCart.products,
    {
      productId: 3,
      quantity: 1,
      price: 24.99
    }
  ],
  total: currentCart.total + 24.99,
  createdAt: currentCart.createdAt,
  updatedAt: new Date().toISOString()
})
```

### CRUD Completo de Productos

```javascript
// Crear producto
const newProduct = await createProduct({
  name: "Producto Test",
  price: 99.99,
  category: "test",
  stock: 5
})

// Leer producto
const product = await fetchProductById(newProduct.id)

// Actualizar producto
const updated = await updateProduct(product.id, {
  ...product,
  price: 89.99,
  stock: 3
})

// Eliminar producto
await deleteProduct(product.id)
```

## 🔧 JSON Server Endpoints

El API se basa en JSON Server que proporciona:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/products` | Todos los productos |
| GET | `/products?category=electronics` | Filtrar por categoría |
| GET | `/products/1` | Producto específico |
| POST | `/products` | Crear producto |
| PUT | `/products/1` | Actualizar producto |
| DELETE | `/products/1` | Eliminar producto |
| GET | `/users` | Todos los usuarios |
| GET | `/users?email=test@email.com` | Filtrar por email |
| GET | `/cart` | Todos los carritos |
| GET | `/cart?userId=1` | Carrito por usuario |
| POST | `/cart` | Crear carrito |

## 🚀 Inicio Rápido

1. **Iniciar servidor:**
   ```bash
   npm run server
   ```

2. **Importar funciones:**
   ```javascript
   import { fetchProducts } from './src/services/api.js'
   ```

3. **Usar en componente React:**
   ```javascript
   const [products, setProducts] = useState([])

   useEffect(() => {
     fetchProducts()
       .then(setProducts)
       .catch(console.error)
   }, [])
   ```

---

📝 **Nota**: Esta documentación está basada en JSON Server 1.0.0-beta.3 con el archivo `data.json` como base de datos.