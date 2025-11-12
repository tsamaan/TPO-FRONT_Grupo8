# Implementar funcion para eliminar productos del carrito

## Descripcion
Implementacion de la funcionalidad para eliminar productos individuales del carrito de compras, actualizando el estado del carrito y el contador total de items.

## Cambios realizados
1. Modificar `CartContext.jsx` para agregar la funcion `removeFromCart`
2. Implementar logica para:
   - Eliminar un producto especifico del carrito
   - Actualizar el contador total de items
   - Manejar la eliminacion de productos inexistentes

## Archivos afectados
- `src/context/CartContext.jsx` (modificado)

## Funcionalidades implementadas
- Funcion `removeFromCart` que recibe el ID del producto a eliminar
- Actualizacion automatica del contador de items al eliminar productos
- Validacion de producto existente antes de eliminar

## Estado actual
✅ Funcion de eliminar productos implementada y lista para usar en componentes
