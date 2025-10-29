# feat: redirigir usuario tras login

## Archivos modificados
- `src/App.jsx`
- `src/context/AuthContext.jsx`

## Descripción detallada
Este commit implementa la lógica de redirección automática tras un login exitoso, cumpliendo con el flujo de autenticación de la aplicación. Los cambios realizados permiten que, una vez que el usuario se autentica correctamente, se muestre una pantalla protegida (simulada como "home" temporal) con un mensaje de bienvenida personalizado y la opción de cerrar sesión.

### Cambios principales:

- **Redirección tras login:**
	- Cuando el usuario ingresa sus credenciales y el login es exitoso, la interfaz deja de mostrar los formularios de login/registro y pasa a mostrar una pantalla protegida.
	- Esta pantalla protegida incluye un mensaje de bienvenida con el nombre o usuario autenticado y un botón para cerrar sesión.

- **Logout:**
	- Al hacer click en el botón de "Cerrar sesión", el usuario es deslogueado y vuelve a ver los formularios de login/registro.

- **No se implementa una home real:**
	- Por el alcance de este commit, la "home" es solo una pantalla protegida temporal, útil para demostrar el flujo de autenticación y la gestión del estado de usuario.

### Justificación y utilidad:
- Permite validar el flujo completo de autenticación y la gestión de sesión en la app.
- Facilita pruebas y futuras integraciones de rutas protegidas o una home real.
- Mejora la experiencia de usuario al dar feedback visual claro sobre el estado de autenticación.
