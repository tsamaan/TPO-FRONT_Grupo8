# Crear Contexto de Carrito

## Descripción
Implementación del contexto del carrito de compras utilizando useContext de React para gestionar el estado global del carrito en la aplicación.

## Cambios realizados
1. Crear archivo `CartContext.jsx` en la carpeta `context`
2. Implementar el provider del carrito con las siguientes características:
   - Estado inicial del carrito (array vacío)
   - Estado para el total de items
   - Provider que envuelve los estados y funciones del carrito

## Archivos afectados
- `src/context/CartContext.jsx` (nuevo)
- `src/App.jsx` (modificado para incluir el CartProvider)

## Funcionalidades implementadas
- Creación del contexto del carrito
- Implementación del provider con estado inicial
- Exportación del contexto para su uso en componentes

## Estado actual
✅ Contexto del carrito creado y listo para implementar funciones de manejo de productos
