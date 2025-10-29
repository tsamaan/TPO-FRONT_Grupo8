/**
 * src/config.js
 *
 * Carga variables de entorno desde Vite (import.meta.env) o Node (process.env)
 * y exporta una configuración con tipos convertidos y valores por defecto.
 *
 * Uso (ES Module):
 *   import config from './config'
 *   console.log(config.API_BASE_URL)
 *
 * Notas:
 *  - Para Vite se recomienda definir variables con prefijo VITE_ si las quieres
 *    exponer al cliente. Este módulo intenta leer tanto import.meta.env como
 *    process.env para ser útil tanto en desarrollo local como en entornos Node.
 */

let _env = {};
if (typeof process !== 'undefined' && process.env) {
  // Node / server-side
  _env = process.env;
} else {
  // Browser / Vite: import.meta.env may be available in ESM context
  try {
    _env = import.meta && import.meta.env ? import.meta.env : {};
  } catch (e) {
    _env = {};
  }
}

function parseNumber(v, def) {
  const n = Number(v);
  return Number.isNaN(n) ? def : n;
}

function parseString(v, def) {
  return v === undefined || v === null ? def : String(v).trim();
}

function parseBoolean(v, def) {
  if (v === undefined || v === null) return def;
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase().trim();
  if (s === 'true' || s === '1') return true;
  if (s === 'false' || s === '0') return false;
  return def;
}

const config = {
  PORT: parseNumber(_env.PORT || _env.VITE_PORT, 3001),
  NODE_ENV: parseString(_env.NODE_ENV || _env.VITE_NODE_ENV || _env.MODE, 'development'),
  DB_PATH: parseString(_env.DB_PATH || _env.VITE_DB_PATH, './db.json'),
  CORS_ORIGIN: parseString(_env.CORS_ORIGIN || _env.VITE_CORS_ORIGIN, 'http://localhost:5173'),
  API_BASE_URL: parseString(_env.API_BASE_URL || _env.VITE_API_BASE_URL, 'http://localhost:8080'),
  LOG_LEVEL: parseString(_env.LOG_LEVEL || _env.VITE_LOG_LEVEL, 'combined'),
  
  TOKEN_SECRET: parseString(_env.TOKEN_SECRET || _env.VITE_TOKEN_SECRET),
  TOKEN_EXPIRES_IN: parseString(_env.TOKEN_EXPIRES_IN || _env.VITE_TOKEN_EXPIRES_IN),

};

config.isProduction = config.NODE_ENV === 'production';

export default config;
