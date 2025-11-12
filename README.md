# E-commerce React - UADE

Este proyecto es una tienda online desarrollada en React + Vite para la materia **Aplicaciones Interactivas** (UADE). Permite explorar productos, filtrar por categorias y colores, gestionar carrito, autenticacion de usuarios y realizar compras con validacion de stock y registro de ordenes.

## Caracteristicas principales
- Catalogo de productos con imagenes, categorias y filtros avanzados
- Filtros por color, modelo, precio y categoria
- Carrito de compras con validacion de stock y calculo de cuotas
- Registro y login de usuarios (sin localStorage)
- Formulario de datos del comprador en el checkout
- Guardado de ordenes en la API (json-server)
- Rutas protegidas para administracion
- UI responsiva y moderna
- Context API para manejo de estado global (auth, cart)

## Instalacion y ejecucion
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/TPO_API_Grupo8.git
   cd TPO_API_Grupo8
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de la API (json-server):
   ```bash
   npm run server
   ```
4. Inicia la app React:
   ```bash
   npm run dev
   ```

## Estructura del proyecto
- `/src/components` - Componentes principales (Navbar, Footer, ProductList, CartSidebar, etc)
- `/src/context` - Contextos de autenticacion y carrito
- `/src/services` - Funciones para interactuar con la API
- `/src/data` - Datos de productos y usuarios
- `/server` - Configuracion del backend (json-server)


## Notas
- El proyecto utiliza React, Vite, Context API y json-server.
- No se utiliza localStorage para el carrito ni autenticacion.
- El diseño es responsivo y pensado para experiencia mobile y desktop.

---
¡Gracias por visitar nuestro proyecto! Si tienes dudas o sugerencias, puedes contactarnos.
