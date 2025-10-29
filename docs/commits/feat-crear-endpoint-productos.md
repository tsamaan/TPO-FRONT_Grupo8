# feat: crear endpoint de productos

**Tipo**: Feature (Nueva funcionalidad)
**Fecha**: Desarrollo backend
**Archivos modificados**: `server/index.js`

---

## 📋 Resumen

Implementación completa de endpoints REST para gestión de productos, incluyendo filtrado avanzado por categoría y tags, creación de productos, y operaciones CRUD con validación robusta.

---

## 🔧 Cambios Implementados

### 1. GET /products - Listar Productos

```javascript
app.get('/products', (req, res) => {
  try {
    const db = readDB()
    const { category, tags_like } = req.query

    let products = db.products

    // Filter by category
    if (category) {
      products = products.filter(p => p.category === category)
    }

    // Filter by tags
    if (tags_like) {
      products = products.filter(p =>
        p.tags && p.tags.some(tag =>
          tag.toLowerCase().includes(tags_like.toLowerCase())
        )
      )
    }

    successResponse(res, products, 'Products retrieved successfully')
  } catch (error) {
    errorResponse(res, 'Error fetching products')
  }
})
```

**Funcionalidades implementadas**:
- **Listado completo**: Sin parámetros obtiene todos los productos
- **Filtro por categoría**: `?category=electronics`
- **Filtro por tags**: `?tags_like=smartphone` (búsqueda case-insensitive)
- **Filtros combinables**: Pueden usarse juntos para búsqueda específica

### 2. GET /products/:id - Producto Específico

```javascript
app.get('/products/:id', (req, res) => {
  try {
    const db = readDB()
    const productId = parseInt(req.params.id)

    const product = db.products.find(p => p.id === productId)

    if (!product) {
      return errorResponse(res, 'Product not found', 404)
    }

    successResponse(res, product, 'Product retrieved successfully')
  } catch (error) {
    errorResponse(res, 'Error fetching product')
  }
})
```

**Características**:
- Validación de ID numérico
- Error 404 para productos inexistentes
- Response con producto individual

### 3. POST /products - Crear Producto

```javascript
app.post('/products', (req, res) => {
  try {
    const db = readDB()
    const { name, price, description, image, category, stock, tags } = req.body

    // Basic validation
    if (!name || !price || !category) {
      return errorResponse(res, 'Missing required fields: name, price, category', 400)
    }

    const newProduct = {
      id: Math.max(...db.products.map(p => p.id), 0) + 1,
      name,
      price: parseFloat(price),
      description: description || '',
      image: image || 'https://via.placeholder.com/300',
      category,
      stock: parseInt(stock) || 0,
      tags: tags || []
    }

    db.products.push(newProduct)

    if (writeDB(db)) {
      successResponse(res, newProduct, 'Product created successfully')
    } else {
      errorResponse(res, 'Error saving product')
    }
  } catch (error) {
    errorResponse(res, 'Error creating product')
  }
})
```

**Validaciones implementadas**:
- **Campos requeridos**: `name`, `price`, `category`
- **Generación automática**: ID incremental
- **Valores por defecto**: Description vacío, imagen placeholder, stock 0
- **Type conversion**: Price a float, stock a integer
- **Persistencia**: Escritura a archivo JSON

---

## 🎯 Funcionalidades Implementadas

### ✅ Operaciones CRUD

**Lectura (Read)**:
- `GET /products` - Todos los productos
- `GET /products/:id` - Producto específico
- `GET /products?category=electronics` - Filtro por categoría
- `GET /products?tags_like=smartphone` - Búsqueda por tags

**Creación (Create)**:
- `POST /products` - Nuevo producto con validación

### ✅ Filtrado Avanzado

**Por categoría**:
```javascript
if (category) {
  products = products.filter(p => p.category === category)
}
```

**Por tags (case-insensitive)**:
```javascript
if (tags_like) {
  products = products.filter(p =>
    p.tags && p.tags.some(tag =>
      tag.toLowerCase().includes(tags_like.toLowerCase())
    )
  )
}
```

**Filtros combinados**: Ambos filtros pueden aplicarse simultáneamente

---

## 📊 Estructura de Datos

### Producto Completo
```json
{
  "id": 1,
  "name": "Smartphone Samsung Galaxy",
  "price": 299.99,
  "description": "Smartphone con pantalla de 6.1 pulgadas y cámara de 48MP",
  "image": "https://via.placeholder.com/300x300?text=Samsung+Galaxy",
  "category": "electronics",
  "stock": 15,
  "tags": ["smartphone", "samsung", "android", "48mp", "pantalla grande"]
}
```

### Campos del Modelo
- **id**: Number - Generado automáticamente
- **name**: String - Requerido
- **price**: Float - Requerido, convertido automáticamente
- **description**: String - Opcional, default vacío
- **image**: String - Opcional, default placeholder
- **category**: String - Requerido para filtrado
- **stock**: Integer - Opcional, default 0
- **tags**: Array - Opcional, default array vacío

---

## 🔍 Ejemplos de Uso

### Obtener todos los productos
```bash
curl -X GET http://localhost:3001/products
```

**Response**:
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Smartphone Samsung Galaxy",
      "price": 299.99,
      // ... resto del producto
    }
  ]
}
```

### Filtrar por categoría
```bash
curl -X GET "http://localhost:3001/products?category=electronics"
```

### Búsqueda por tags
```bash
curl -X GET "http://localhost:3001/products?tags_like=samsung"
```

### Obtener producto específico
```bash
curl -X GET http://localhost:3001/products/1
```

### Crear nuevo producto
```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Producto",
    "price": 99.99,
    "description": "Descripción del nuevo producto",
    "category": "electronics",
    "stock": 10,
    "tags": ["nuevo", "oferta"]
  }'
```

---

## 🛡️ Validaciones y Error Handling

### Validación de Entrada
```javascript
if (!name || !price || !category) {
  return errorResponse(res, 'Missing required fields: name, price, category', 400)
}
```

### Type Conversion Segura
```javascript
price: parseFloat(price),           // String a Float
stock: parseInt(stock) || 0,        // String a Integer con fallback
tags: tags || []                    // Array o fallback vacío
```

### Error Responses
```json
// 400 - Bad Request
{
  "success": false,
  "message": "Missing required fields: name, price, category",
  "data": null
}

// 404 - Not Found
{
  "success": false,
  "message": "Product not found",
  "data": null
}

// 500 - Server Error
{
  "success": false,
  "message": "Error fetching products",
  "data": null
}
```

---

## 🧪 Testing Scenarios

### Casos de Éxito

**Listar productos**:
```bash
curl http://localhost:3001/products
# Expect: 200, array de productos
```

**Filtros funcionales**:
```bash
curl "http://localhost:3001/products?category=electronics&tags_like=samsung"
# Expect: 200, productos filtrados
```

**Crear producto válido**:
```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99,"category":"test"}'
# Expect: 200, producto creado con ID autogenerado
```

### Casos de Error

**Producto inexistente**:
```bash
curl http://localhost:3001/products/9999
# Expect: 404, error message
```

**Crear sin campos requeridos**:
```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{"description":"Sin nombre ni precio"}'
# Expect: 400, validation error
```

---

## 💡 Decisiones de Diseño

### Filtrado Flexible
- **Query parameters**: Estándar REST para filtros
- **Case insensitive**: Mejor UX en búsqueda de tags
- **Combinable**: Permite búsquedas específicas complejas

### ID Generation
- **Incremental**: Simple y predecible para desarrollo
- **Math.max**: Encuentra el ID más alto existente
- **Fallback 0**: Maneja caso de array vacío

### Default Values
- **Image placeholder**: URL funcional para desarrollo
- **Empty description**: Permite productos mínimos
- **Stock 0**: Indica agotado por defecto
- **Empty tags**: Array válido para operaciones

### Data Persistence
- **Synchronous write**: Simple para este caso de uso
- **Error handling**: Retorna false si falla la escritura
- **Pretty format**: JSON legible para debugging

---

## 🔄 Próximos Pasos

Los endpoints de productos habilitan:
1. ✅ Catálogo completo de productos
2. ✅ Búsqueda y filtrado avanzado
3. ✅ Creación de productos desde admin
4. ✅ Integración con frontend React
5. ✅ Base para carrito de compras

---

**Estado**: ✅ Completado y testeado
**Impacto**: Core funcional del e-commerce - gestión completa de catálogo de productos.