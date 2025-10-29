# Redisenio del Navbar lateral

## Cambios realizados
- `src/components/Navbar/Navbar.jsx`: Se reestructuro el componente para construir un menu lateral fijo con logo, enlaces principales, boton "Productos >" que abre la barra de categorias y acciones inferiores (Instagram + botones de acceso).
- `src/components/Navbar/Navbar.css`: Se actualizaron los estilos para replicar el layout vertical oscuro del mock, con tipografias en negrita, botones tipo pildora y ajustes responsivos. Tambien se anadio la clase `main-with-navbar` para dar margen al contenido.
- `src/App.jsx`: Se envolvieron las rutas principales dentro de `div.main-with-navbar` para que el contenido respete el ancho del navbar y se ajustaron los textos informativos.

## Resultado
El panel de navegacion luce como en la referencia: fondo negro, logo superior, enlaces alineados en columna con "Productos >", texto "INSTAGRAM" y los botones "CREAR CUENTA" / "INGRESAR" en un contenedor gris.

## Consideraciones futuras
- Evaluar si el widget del carrito necesita reposicionarse para el nuevo ancho.
- Integrar navegacion activa mas rica (por ejemplo, indicar seccion abierta cuando se vuelve del sidebar de categorias).