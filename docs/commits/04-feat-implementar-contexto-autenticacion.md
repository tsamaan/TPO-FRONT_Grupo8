# feat: implementar contexto de autenticación

## Archivos modificados
- `src/context/AuthContext.jsx`
- `src/services/authService.js`
- `src/components/auth/RegisterForm/RegisterForm.jsx`

## Descripción detallada
Se extiende el contexto de autenticación para manejar tanto el registro como el login de usuarios en memoria (sin backend real). Los cambios principales son:
- El contexto ahora expone funciones para registrar y autenticar usuarios.
- El formulario de registro utiliza el contexto para registrar usuarios y muestra mensajes de éxito o error según corresponda.
- Se valida que no se puedan registrar emails o usuarios duplicados.
- El login valida credenciales contra los usuarios registrados en memoria.

### Justificación y utilidad:
- Permite centralizar la lógica de autenticación y registro, facilitando la escalabilidad y el mantenimiento.
- Sienta la base para conectar con un backend real en el futuro.
