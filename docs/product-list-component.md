# ProductList component

## Cambios realizados

1. Creacion del componente `ProductList`
- Se agrego `src/components/ProductList.jsx` para obtener productos mediante `fetchProducts` de `src/services/api.js`.
- Se manejo estado de carga, errores y ausencia de resultados con mensajes claros.
- Se formateo el precio utilizando `Intl.NumberFormat` con configuracion regional es-AR.

2. Estilos dedicados
- Se agrego `src/components/ProductList.css` con una grilla responsive de tarjetas y estados de feedback.
- Se incluyeron transiciones suaves y adaptacion para imagenes destacadas.

3. Integracion en la pagina de inicio
- `src/pages/HomePage.jsx` ahora importa y renderiza el listado dentro de la seccion principal.
- Se ajusto `src/pages/HomePage.css` para soportar el nuevo layout y secciones responsivas.

4. Adaptacion del servicio a la API
- `src/services/api.js` ahora normaliza las respuestas que envian `{ success, data }` devolviendo solo los datos necesarios.
- Se asegura compatibilidad con el backend Express y evita listas vacias inesperadas en el componente.

## Comportamiento principal
- Al montarse, `ProductList` solicita los productos a la API local y actualiza la vista automaticamente.
- Los usuarios visualizan fichas con imagen, titulo, descripcion y precio (cuando esta disponible).
- Se muestran mensajes de carga, error o vacio segun corresponda.

## Consideraciones futuras
- Permitir filtros por categoria reutilizando la prop `category` ya contemplada.
- Extraer el formato monetario si se requiere en otros componentes.