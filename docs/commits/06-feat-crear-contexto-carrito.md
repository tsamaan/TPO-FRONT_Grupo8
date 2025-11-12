# Crear Contexto de Carrito

## Descripcion
Implementacion del contexto del carrito de compras utilizando useContext de React para gestionar el estado global del carrito en la aplicacion.

## Cambios realizados
1. Crear archivo `CartContext.jsx` en la carpeta `context`
2. Implementar el provider del carrito con las siguientes caracteristicas:
   - Estado inicial del carrito (array vacio)
   - Estado para el total de items
   - Provider que envuelve los estados y funciones del carrito

## Archivos afectados
- `src/context/CartContext.jsx` (nuevo)
- `src/App.jsx` (modificado para incluir el CartProvider)

## Funcionalidades implementadas
- Creacion del contexto del carrito
- Implementacion del provider con estado inicial
- Exportacion del contexto para su uso en componentes

## Estado actual
✅ Contexto del carrito creado y listo para implementar funciones de manejo de productos
