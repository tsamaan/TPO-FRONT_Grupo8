# Implementar funcion para agregar productos al carrito

## Descripcion
Implementacion de la funcionalidad para agregar productos al carrito de compras, incluyendo la validacion de stock y la actualizacion del contador de items.

## Cambios realizados
1. Modificar `CartContext.jsx` para agregar la funcion `addToCart`
2. Implementar logica para:
   - Verificar si el producto ya existe en el carrito
   - Validar stock disponible
   - Actualizar cantidad si el producto existe
   - Agregar nuevo producto si no existe
   - Actualizar el contador total de items

## Archivos afectados
- `src/context/CartContext.jsx` (modificado)

## Funcionalidades implementadas
- Funcion `addToCart` que recibe un producto y su cantidad
- Validacion de stock disponible
- Actualizacion automatica del contador de items
- Manejo de productos duplicados en el carrito

## Estado actual
✅ Funcion de agregar al carrito implementada y lista para usar en componentes
