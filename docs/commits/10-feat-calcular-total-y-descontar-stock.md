# Implementar cálculo de total y descuento de stock

## Descripción
Implementación de la funcionalidad para calcular el total de la compra en el checkout y actualizar el stock de los productos comprados.

## Cambios realizados
1. Modificar `CartContext.jsx` para agregar las funciones:
   - `calculateTotal`: calcula el total de la compra
   - `checkout`: procesa la compra y actualiza el stock

2. Implementar lógica para:
   - Calcular el total de la compra considerando precio y cantidad
   - Validar stock disponible antes de procesar la compra
   - Actualizar el stock de los productos
   - Vaciar el carrito después de una compra exitosa

## Archivos afectados
- `src/context/CartContext.jsx` (modificado)

## Funcionalidades implementadas
- Cálculo automático del total de la compra
- Validación de stock antes de procesar la compra
- Actualización del stock de productos
- Limpieza del carrito post-compra

## Estado actual
✅ Funciones de checkout implementadas y listas para usar en componentes
