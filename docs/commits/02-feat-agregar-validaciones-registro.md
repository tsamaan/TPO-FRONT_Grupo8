# feat: agregar validaciones al registro

## Archivos modificados
- `src/components/auth/RegisterForm/RegisterForm.jsx`

## Descripcion detallada
Se agregan validaciones al formulario de registro para mejorar la experiencia de usuario y evitar registros incompletos o con errores. Las validaciones implementadas son:
- Todos los campos del formulario son obligatorios.
- Las contraseñas ingresadas deben coincidir.
- Si alguna validacion falla, se muestra un mensaje de error claro al usuario.

Estas validaciones aseguran que los datos ingresados sean consistentes y previenen errores comunes al momento de crear una cuenta.

### Justificacion y utilidad:
- Mejora la calidad de los datos registrados.
- Brinda feedback inmediato al usuario, evitando frustraciones.
