
import { config } from '../config/env'

const API_BASE_URL = config.apiBaseUrl

export async function loginService(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // El backend devuelve { token, user }
    if (data.token && data.user) {
      // Guardar el token JWT en localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return { 
        success: true, 
        user: data.user,
        token: data.token 
      }
    } else {
      return { 
        success: false, 
        message: data.message || "Usuario o contraseña incorrectos" 
      }
    }
  } catch (error) {
    console.error('Error during login:', error)
    return { 
      success: false, 
      message: error.message || "Error de conexion con el servidor" 
    }
  }
}

export async function registerService(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        nombre: data.nombre,
        apellido: data.apellido,
        name: `${data.nombre} ${data.apellido}`,
        phone: data.phone || '',
        address: data.address || ''
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        message: errorData.message || "Error al registrar usuario" 
      }
    }

    const result = await response.json()
    
    // El backend devuelve { success: true, message: "...", user: {...} }
    if (result.success && result.user) {
      return { 
        success: true,
        message: "Usuario registrado exitosamente" 
      }
    } else {
      return { 
        success: false, 
        message: result.message || "Error al registrar usuario" 
      }
    }
  } catch (error) {
    console.error('Error during registration:', error)
    return { 
      success: false, 
      message: error.message || "Error de conexion con el servidor" 
    }
  }
}

export async function logoutService() {
  try {
    const token = localStorage.getItem('token');
    
    // Si hay un endpoint de logout en el backend
    if (token) {
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => {
        // Ignorar errores del logout en el backend
        console.log('Logout endpoint no disponible, solo limpiando localStorage');
      });
    }
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return { success: true };
  } catch (error) {
    console.error('Error during logout:', error);
    // Aun asi limpiar el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  }
}
