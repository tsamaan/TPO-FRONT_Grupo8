# feat: redirigir usuario tras login

## Archivos modificados
- `src/App.jsx`
- `src/context/AuthContext.jsx`

## Descripcion detallada
Este commit implementa la logica de redireccion automatica tras un login exitoso, cumpliendo con el flujo de autenticacion de la aplicacion. Los cambios realizados permiten que, una vez que el usuario se autentica correctamente, se muestre una pantalla protegida (simulada como "home" temporal) con un mensaje de bienvenida personalizado y la opcion de cerrar sesion.

### Cambios principales:

- **Redireccion tras login:**
	- Cuando el usuario ingresa sus credenciales y el login es exitoso, la interfaz deja de mostrar los formularios de login/registro y pasa a mostrar una pantalla protegida.
	- Esta pantalla protegida incluye un mensaje de bienvenida con el nombre o usuario autenticado y un boton para cerrar sesion.

- **Logout:**
	- Al hacer click en el boton de "Cerrar sesion", el usuario es deslogueado y vuelve a ver los formularios de login/registro.

- **No se implementa una home real:**
	- Por el alcance de este commit, la "home" es solo una pantalla protegida temporal, util para demostrar el flujo de autenticacion y la gestion del estado de usuario.

### Justificacion y utilidad:
- Permite validar el flujo completo de autenticacion y la gestion de sesion en la app.
- Facilita pruebas y futuras integraciones de rutas protegidas o una home real.
- Mejora la experiencia de usuario al dar feedback visual claro sobre el estado de autenticacion.
