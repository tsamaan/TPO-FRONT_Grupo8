
const API_BASE_URL = 'http://localhost:8080'

export async function loginService(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users?email=${email}&password=${password}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const users = await response.json()
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      return { success: true, user }
    } else {
      return { success: false, message: "Usuario o contraseña incorrectos" }
    }
  } catch (error) {
    console.error('Error during login:', error)
    return { success: false, message: "Error de conexión" }
  }
}

export async function registerService(data) {
  try {
    // Verificar si ya existe el email
    const emailCheck = await fetch(`${API_BASE_URL}/users?email=${data.email}`)
    const existingEmailUsers = await emailCheck.json()

    if (existingEmailUsers.length > 0) {
      return { success: false, message: "El email ya está registrado" }
    }

    // Verificar si ya existe el usuario
    const userCheck = await fetch(`${API_BASE_URL}/users?usuario=${data.usuario}`)
    const existingUsers = await userCheck.json()

    if (existingUsers.length > 0) {
      return { success: false, message: "El usuario ya está registrado" }
    }

    // Crear nuevo usuario
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        name: `${data.nombre} ${data.apellido}`,
        address: data.address || '',
        phone: data.phone || ''
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error during registration:', error)
    return { success: false, message: "Error de conexión" }
  }
}
