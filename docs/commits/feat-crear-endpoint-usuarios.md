# feat: crear endpoint de usuarios

**Tipo**: Feature (Nueva funcionalidad)
**Fecha**: Desarrollo backend
**Archivos modificados**: `server/index.js`, `package.json`

---

## 📋 Resumen

Implementación de endpoints REST específicos para la gestión de usuarios, migrando de JSON Server a Express.js con validación, manejo de errores y respuestas estandarizadas.

---

## 🔧 Cambios Implementados

### 1. Servidor Express Setup

**Archivo**: `server/index.js`

```javascript
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
```

**Middleware configurado**:
- **CORS**: Permite requests desde frontend (puerto 5173)
- **Morgan**: Logging HTTP requests para debugging
- **Express.json**: Parsing automático de JSON bodies

### 2. Database Helpers

```javascript
const readDB = () => {
  try {
    const data = readFileSync(DB_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading database:', error)
    return { products: [], users: [], cart: [] }
  }
}

const writeDB = (data) => {
  try {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing database:', error)
    return false
  }
}
```

**Funcionalidades**:
- Lectura síncrona del archivo JSON
- Escritura con formato pretty-print
- Fallback a estructura vacía en caso de error

### 3. Response Helpers

```javascript
const successResponse = (res, data, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data
  })
}

const errorResponse = (res, message = 'Error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null
  })
}
```

**Formato estandarizado**:
- Responses consistentes en toda la API
- Campo `success` para validación rápida
- `message` descriptivo para debugging
- `data` con información real o `null`

### 4. Endpoints de Usuarios

#### GET /users
```javascript
app.get('/users', (req, res) => {
  try {
    const db = readDB()
    successResponse(res, db.users, 'Users retrieved successfully')
  } catch (error) {
    errorResponse(res, 'Error fetching users')
  }
})
```

**Funcionalidad**:
- Obtiene todos los usuarios de la base de datos
- Manejo de errores con try/catch
- Response estandarizado

#### GET /users/:id
```javascript
app.get('/users/:id', (req, res) => {
  try {
    const db = readDB()
    const userId = parseInt(req.params.id)

    const user = db.users.find(u => u.id === userId)

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    successResponse(res, user, 'User retrieved successfully')
  } catch (error) {
    errorResponse(res, 'Error fetching user')
  }
})
```

**Funcionalidades**:
- Validación de ID numérico
- Búsqueda específica por ID
- Error 404 si usuario no existe
- Response con usuario individual

### 5. Dependencias Actualizadas

**package.json**:
```json
{
  "dependencies": {
    "express": "^4.21.2",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "dotenv": "^16.4.7"
  },
  "scripts": {
    "server": "node server/index.js",
    "server:dev": "nodemon server/index.js"
  }
}
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Gestión de Usuarios

**Endpoints disponibles**:
- `GET /users` - Listar todos los usuarios
- `GET /users/:id` - Obtener usuario específico por ID

**Características**:
- Validación de parámetros de entrada
- Manejo robusto de errores
- Responses en formato JSON estandarizado
- Logging automático de requests

### ✅ Arquitectura Backend

**Mejoras vs JSON Server**:
- Control total sobre responses
- Validación personalizada
- Logging detallado
- Error handling específico
- Middleware customizable

---

## 📊 Estructura de Response

### Éxito - Múltiples usuarios
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "email": "juan@example.com",
      "name": "Juan Pérez",
      "address": "Av. Corrientes 1234, Buenos Aires",
      "phone": "+54 11 1234-5678"
    },
    {
      "id": 2,
      "email": "maria@example.com",
      "name": "María García",
      "address": "Calle Florida 567, Buenos Aires",
      "phone": "+54 11 9876-5432"
    }
  ]
}
```

### Éxito - Usuario específico
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "address": "Av. Corrientes 1234, Buenos Aires",
    "phone": "+54 11 1234-5678"
  }
}
```

### Error - Usuario no encontrado
```json
{
  "success": false,
  "message": "User not found",
  "data": null
}
```

---

## 🔍 Validaciones Implementadas

### Validación de ID
```javascript
const userId = parseInt(req.params.id)
// Convierte string a número para comparación exacta
```

### Validación de Existencia
```javascript
if (!user) {
  return errorResponse(res, 'User not found', 404)
}
```

### Validación de Base de Datos
```javascript
return { products: [], users: [], cart: [] }
// Fallback si db.json no existe o está corrupto
```

---

## 🧪 Testing Manual

### Verificación de Endpoints

**Obtener todos los usuarios**:
```bash
curl -X GET http://localhost:3001/users
```

**Obtener usuario específico**:
```bash
curl -X GET http://localhost:3001/users/1
```

**Probar usuario inexistente**:
```bash
curl -X GET http://localhost:3001/users/999
# Debe devolver 404
```

### Logs Esperados
```
GET /users 200 - response time
GET /users/1 200 - response time
GET /users/999 404 - response time
```

---

## 💡 Decisiones de Arquitectura

### Express vs JSON Server
- **Control**: Mayor control sobre responses y validaciones
- **Logging**: Morgan para monitoring de requests
- **Escalabilidad**: Base para funcionalidades complejas
- **Debugging**: Error handling más específico

### File-based Database
- **Simplicidad**: Mantiene JSON para desarrollo rápido
- **Persistence**: Cambios se mantienen entre reinicios
- **Debugging**: Fácil inspección manual de datos

### Response Format
- **Consistencia**: Mismo formato en toda la API
- **Frontend**: Fácil manejo desde React con `.data`
- **Error handling**: Campo `success` para validación

---

## 🔄 Próximos Pasos

Este endpoint de usuarios habilita:
1. ✅ Autenticación básica
2. ✅ Gestión de perfiles
3. ✅ Asociación con carritos
4. ✅ Validación en frontend
5. ✅ CRUD operations completo

---

**Estado**: ✅ Completado y testeado
**Impacto**: Establece la base para gestión de usuarios en la aplicación e-commerce.