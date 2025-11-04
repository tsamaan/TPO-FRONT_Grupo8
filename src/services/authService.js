
const API_BASE_URL = 'http://localhost:8080/api'

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
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success && data.user) {
      // Guardar el token si viene en la respuesta
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      return { success: true, user: data.user }
    } else {
      return { success: false, message: data.message || "Usuario o contraseña incorrectos" }
    }
  } catch (error) {
    console.error('Error during login:', error)
    return { success: false, message: "Error de conexión" }
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
        usuario: data.usuario,
        name: `${data.nombre} ${data.apellido}`,
        address: data.address || '',
        phone: data.phone || ''
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, message: errorData.message || "Error al registrar" }
    }

    const result = await response.json()
    
    if (result.success) {
      return { success: true }
    } else {
      return { success: false, message: result.message || "Error al registrar" }
    }
  } catch (error) {
    console.error('Error during registration:', error)
    return { success: false, message: "Error de conexión" }
  }
}
