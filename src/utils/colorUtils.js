// Mapeo de nombres de colores a valores hexadecimales
export const colorMap = {
  'Negro': '#000000',
  'Blanco': '#FFFFFF',
  'Gris': '#808080',
  'Azul': '#0066CC',
  'Verde': '#00AA00',
  'Rojo': '#CC0000',
  'Rosa': '#FF69B4',
  'Naranja': '#FF8800',
  'Amarillo': '#FFDD00',
  'Morado': '#8A2BE2',
  'Celeste': '#87CEEB',
  'Fucsia': '#FF1493',
  'Marrón': '#8B4513',
  'Café': '#6F4E37',
  'Beige': '#F5F5DC',
  'Turquesa': '#40E0D0',
  'Coral': '#FF7F50',
  'Lavanda': '#E6E6FA',
  'Mint': '#98FB98',
  'Oro': '#FFD700',
  'Plata': '#C0C0C0',
  'Cobre': '#B87333',
  'Marino': '#000080',
  'Oliva': '#808000',
  'Vino': '#722F37'
};

// Función para obtener el color hexadecimal de un nombre
export const getColorHex = (colorName) => {
  return colorMap[colorName] || '#CCCCCC'; // Color gris por defecto
};

// Función para determinar si usar texto claro u oscuro sobre un color
export const getContrastText = (hex) => {
  // Convertir hex a RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calcular luminancia
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};