# Implementar función para eliminar productos del carrito

## Descripción
Implementación de la funcionalidad para eliminar productos individuales del carrito de compras, actualizando el estado del carrito y el contador total de items.

## Cambios realizados
1. Modificar `CartContext.jsx` para agregar la función `removeFromCart`
2. Implementar lógica para:
   - Eliminar un producto específico del carrito
   - Actualizar el contador total de items
   - Manejar la eliminación de productos inexistentes

## Archivos afectados
- `src/context/CartContext.jsx` (modificado)

## Funcionalidades implementadas
- Función `removeFromCart` que recibe el ID del producto a eliminar
- Actualización automática del contador de items al eliminar productos
- Validación de producto existente antes de eliminar

## Estado actual
✅ Función de eliminar productos implementada y lista para usar en componentes
