# Integracion de Autenticacion con API JWT

## 📋 Resumen de Cambios

Se actualizo el sistema de autenticacion para usar completamente la API REST del backend en el puerto 8080 con tokens JWT.

## 🔐 Endpoints de Autenticacion

### 1. **Login** - `POST /api/users/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (exito):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nombre": "Juan",
    "apellido": "Perez",
    "role": "USER"
  }
}
```

**Response (Error):**
```json
{
  "message": "Usuario o contraseña incorrectos"
}
```

### 2. **Register** - `POST /api/users/register`

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Perez",
  "name": "Juan Perez",
  "phone": "+54 11 1234-5678",
  "direccion": {
    "calle": "Av. Corrientes 1234"
  }
}
```

**Response (exito):**
```json
{
  "id": 2,
  "email": "newuser@example.com",
  "nombre": "Juan",
  "apellido": "Perez",
  "role": "USER"
}
```

### 3. **Logout** - Cliente unicamente

No requiere endpoint en el backend. JWT es stateless, por lo que el logout se maneja eliminando el token del localStorage.

## 🔄 Flujo de Autenticacion

### Login Flow:

1. Usuario ingresa email y password
2. Frontend llama a `loginService(email, password)`
3. Se hace POST a `/api/users/login`
4. Backend valida credenciales y genera JWT
5. Frontend recibe `{ token, user }`
6. Se guarda en localStorage:
   - `token`: JWT para autenticacion
   - `user`: Datos del usuario (JSON)
7. Se actualiza el estado en `AuthContext`
8. Usuario es redirigido segun su rol

### Register Flow:

1. Usuario completa formulario de registro
2. Frontend llama a `registerService(data)`
3. Se hace POST a `/api/users/register`
4. Backend crea el usuario
5. Frontend recibe confirmacion
6. Usuario es redirigido al login

### Logout Flow:

1. Usuario hace clic en cerrar sesion
2. Frontend llama a `logout()`
3. Se eliminan `token` y `user` del localStorage
4. Se limpia el estado en `AuthContext`
5. Usuario es redirigido al login

## 📦 LocalStorage

### Datos almacenados:

```javascript
// Token JWT para autenticacion
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')

// Usuario completo (objeto JSON)
localStorage.setItem('user', JSON.stringify({
  id: 1,
  email: "user@example.com",
  nombre: "Juan",
  apellido: "Perez",
  role: "USER"
}))
```

## 🔒 Uso del Token JWT

Para hacer peticiones autenticadas a la API:

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:8080/api/protected-endpoint', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## 🛡️ Seguridad en el Backend

El backend valida el token JWT en cada peticion protegida:

- ✅ GET `/api/products/**` - Publico (sin autenticacion)
- ✅ GET `/api/categories/**` - Publico (sin autenticacion)
- 🔐 POST/PUT/DELETE `/api/products/**` - Requiere rol ADMIN
- 🔐 `/api/cart/**` - Requiere autenticacion
- 🔐 `/api/orders/**` - Requiere autenticacion

## 📁 Archivos Modificados

### Frontend:

1. **`authService.js`** - Servicios de autenticacion
   - `loginService()` - Maneja login con JWT
   - `registerService()` - Maneja registro
   - `logoutService()` - Limpia localStorage

2. **`AuthContext.jsx`** - Context de autenticacion
   - Gestiona estado global de autenticacion
   - Recupera sesion del localStorage
   - Funciones de verificacion de roles

3. **`api.js`** - Helper para headers con JWT
   - `getAuthHeader()` - Agrega token a las peticiones

### Backend:

- **`SecurityConfig.java`** - Configuracion de seguridad
- **`JwtAuthenticationFilter.java`** - Filtro de autenticacion JWT
- **`UserController.java`** - Endpoints de usuarios

## 🎯 Verificacion de Roles

```javascript
// En cualquier componente
const { user, hasRole, isAdmin, isSuperAdmin } = useContext(AuthContext);

// Verificar rol especifico
if (hasRole('ADMIN')) {
  // Mostrar contenido admin
}

// Verificar si es admin o superadmin
if (isAdmin()) {
  // Mostrar dashboard admin
}

// Verificar solo superadmin
if (isSuperAdmin()) {
  // Mostrar funcionalidades de superadmin
}
```

## ✅ Testing

### Probar Login:
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@haversack.com", "password": "admin123"}'
```

### Probar Endpoint Protegido:
```bash
curl -X GET http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🐛 Manejo de Errores

### Token Expirado:
- Backend devuelve 401 Unauthorized
- Frontend debe redirigir al login
- Limpiar localStorage

### Token Invalido:
- Backend devuelve 401 Unauthorized
- Frontend debe redirigir al login
- Limpiar localStorage

### Sin Token:
- Endpoints protegidos devuelven 401
- Usuario es redirigido al login

## 📝 Notas Importantes

1. **JWT es stateless**: No hay sesiones en el servidor
2. **Token en localStorage**: Persiste entre recargas de pagina
3. **Logout no requiere backend**: Solo limpiar localStorage
4. **Roles en el token**: El JWT contiene la informacion del rol del usuario
5. **Expiracion del token**: Configurada en el backend (por defecto 24 horas)
