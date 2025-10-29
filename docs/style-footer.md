# Implementación del Footer

## Cambios Realizados

1. Creación del componente Footer
- Se creó el archivo `Footer.jsx` en la carpeta `src/components/Footer`
- Se implementó un footer con tres columnas y barra inferior gris según el mockup
- Estructura: links (izquierda), newsletter (centro), contacto (derecha)

2. Estilos del Footer
- Se creó el archivo `Footer.css` con estilos específicos
- Grid de tres columnas con gap y alineación
- Newsletter con input tipo "pill" y botón circular +
- Barra inferior gris con bordes redondeados y texto centrado
- Responsive: en pantallas pequeñas las columnas se apilan verticalmente
- Se añadió la variable CSS `--navbar-width` para dejar espacio al `Navbar` fijo en la izquierda. Por defecto `--navbar-width: 250px`.

3. Recursos añadidos
- `public/payments-placeholder.png` es un placeholder (ya eliminado del footer por request del equipo).

## Cómo integrarlo
- Importar en `App.jsx` o componente principal:

```jsx
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div>
      {/* ...existing layout... */}
      <Footer />
    </div>
  )
}
```

## Notas importantes
- Si el `Navbar` tiene un ancho distinto a 250px, cambiar la variable en `:root` dentro de `src/components/Footer/Footer.css` o en un CSS global:

```css
:root { --navbar-width: 200px; }
```

- En dispositivos móviles la variable se establece a `0` y el footer ocupa todo el ancho.

## Detalles de diseño
- Tipografía neutra del sistema
- Colores suaves para fondo y bordes
- Enlaces subrayados en azul para accesibilidad
- Mantiene separación con el contenido principal

## Notas
- Si deseas reemplazar el placeholder de medios de pago, sustituir `public/payments-placeholder.png` por el asset real con el mismo nombre (si vuelven a usarlo).