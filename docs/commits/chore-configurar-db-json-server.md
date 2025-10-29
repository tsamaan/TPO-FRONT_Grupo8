# chore: configurar db.json en json-server

**Tipo**: Chore (Configuración/Mantenimiento)
**Fecha**: Implementación inicial
**Archivos modificados**: `db.json`, `package.json`

---

## 📋 Resumen

Configuración inicial del backend usando JSON Server como API REST rápida para desarrollo. Este commit establece la base de datos de prueba y los scripts necesarios para levantar el servidor.

---

## 🔧 Cambios Implementados

### 1. Creación de `db.json`

**Archivo**: `db.json`

```json
{
  "products": [
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
    // ... más productos
  ],
  "users": [
    {
      "id": 1,
      "email": "juan@example.com",
      "name": "Juan Pérez",
      "address": "Av. Corrientes 1234, Buenos Aires",
      "phone": "+54 11 1234-5678"
    }
    // ... más usuarios
  ],
  "cart": [
    {
      "id": 1,
      "userId": 1,
      "products": [...],
      "total": 299.99,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
    // ... más carritos
  ]
}
```

**Estructura de Datos**:
- **products**: Catálogo de productos con tags, categorías, stock
- **users**: Usuarios con información completa incluido teléfono
- **cart**: Carritos de compras con timestamps y totales

### 2. Configuración en `package.json`

**Dependencia agregada**:
```json
"dependencies": {
  "json-server": "^0.17.4"
}
```

**Script agregado**:
```json
"scripts": {
  "server": "json-server --watch db.json --port 3001"
}
```

---

## 🎯 Objetivos Cumplidos

### ✅ Backend Funcional
- Servidor API REST en puerto 3001
- Endpoints automáticos para CRUD operations
- Hot-reload con `--watch`

### ✅ Datos de Prueba
- 4 productos con categorías (electronics, clothing, books)
- 2 usuarios con datos completos
- 2 carritos con productos y totales
- Estructura normalizada y relacional

### ✅ Configuración Básica
- Script de inicio rápido: `npm run server`
- Puerto separado del frontend (3001)
- CORS habilitado automáticamente

---

## 🚀 Endpoints Disponibles

### Automáticos por JSON Server:

**Productos**:
- `GET /products` - Listar todos
- `GET /products/1` - Obtener específico
- `GET /products?category=electronics` - Filtrar
- `POST /products` - Crear nuevo
- `PUT /products/1` - Actualizar completo
- `PATCH /products/1` - Actualizar parcial
- `DELETE /products/1` - Eliminar

**Usuarios**:
- `GET /users` - Listar todos
- `GET /users/1` - Obtener específico
- `POST /users` - Crear nuevo
- `PUT/PATCH/DELETE /users/:id` - Modificar

**Carrito**:
- `GET /cart` - Listar todos
- `GET /cart?userId=1` - Por usuario
- `POST /cart` - Crear carrito
- `PUT/PATCH/DELETE /cart/:id` - Modificar

---

## 💡 Decisiones de Diseño

### Estructura de Productos
- **Tags**: Array para búsqueda flexible
- **Category**: String para filtrado simple
- **Stock**: Control de inventario
- **Images**: URLs placeholder para desarrollo

### Estructura de Usuarios
- **Phone**: Campo adicional para contacto
- **Address**: Información completa de entrega

### Estructura de Carrito
- **Timestamps**: Para tracking temporal
- **Total**: Precalculado para consistencia
- **Products array**: Referencia por ID + cantidad + precio

---

## 🔄 Próximos Pasos

Este commit sienta las bases para:
1. ✅ Desarrollo de endpoints específicos
2. ✅ Integración con frontend React
3. ✅ Implementación de filtros y búsquedas
4. ✅ Validación de datos
5. ✅ Mejoras de performance

---

## 🧪 Testing

**Verificación manual**:
```bash
# Iniciar servidor
npm run server

# Verificar endpoints
curl http://localhost:3001/products
curl http://localhost:3001/users
curl http://localhost:3001/cart
```

**Resultado esperado**: JSON con datos estructurados y responses HTTP 200.

---

**Estado**: ✅ Completado y funcional
**Impacto**: Establece la infraestructura backend básica para el proyecto e-commerce.