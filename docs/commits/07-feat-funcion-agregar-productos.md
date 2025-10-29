# Implementar función para agregar productos al carrito

## Descripción
Implementación de la funcionalidad para agregar productos al carrito de compras, incluyendo la validación de stock y la actualización del contador de items.

## Cambios realizados
1. Modificar `CartContext.jsx` para agregar la función `addToCart`
2. Implementar lógica para:
   - Verificar si el producto ya existe en el carrito
   - Validar stock disponible
   - Actualizar cantidad si el producto existe
   - Agregar nuevo producto si no existe
   - Actualizar el contador total de items

## Archivos afectados
- `src/context/CartContext.jsx` (modificado)

## Funcionalidades implementadas
- Función `addToCart` que recibe un producto y su cantidad
- Validación de stock disponible
- Actualización automática del contador de items
- Manejo de productos duplicados en el carrito

## Estado actual
✅ Función de agregar al carrito implementada y lista para usar en componentes
