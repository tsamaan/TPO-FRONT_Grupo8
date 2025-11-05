import { config } from '../config/env'

// Configuración base de la API
const API_BASE_URL = config.apiBaseUrl

// Helper para obtener el token del localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// PRODUCTOS
export const fetchProducts = async (category = null) => {
  try {
    const url = category
      ? `${API_BASE_URL}/products?category=${category}`
      : `${API_BASE_URL}/products`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const products = await response.json()
    return Array.isArray(products) ? products : []
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const product = await response.json()
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

// CATEGORÍAS
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories = await response.json();
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createOrder = async (orderData, isAuthenticated = false) => {
  try {
    // Usar endpoint diferente según si está autenticado
    const endpoint = isAuthenticated ? '/orders' : '/orders/guest';
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Solo agregar token si está autenticado
    if (isAuthenticated) {
      Object.assign(headers, getAuthHeader());
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
// Eliminar producto del carrito
export const deleteCartItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
}

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const product = await response.json()
    return product
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export const updateProduct = async (id, productData) => {
  try {
    console.log('🔄 API: Actualizando producto', { 
      id, 
      url: `${API_BASE_URL}/products/${id}`,
      hasVariants: !!productData.variants,
      variantsCount: productData.variants?.length || 0
    });
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    })

    console.log('📡 Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const product = await response.json()
    console.log('✅ Producto actualizado:', product);
    return product
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const users = await response.json()
    return Array.isArray(users) ? users : []
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const fetchCart = async (userId = null) => {
  try {
    const url = userId
      ? `${API_BASE_URL}/cart?userId=${userId}`
      : `${API_BASE_URL}/cart`

    const response = await fetch(url, {
      headers: {
        ...getAuthHeader(),
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const cart = await response.json()
    return Array.isArray(cart) ? cart : []
  } catch (error) {
    console.error('Error fetching cart:', error)
    throw error
  }
}

export const createCartItem = async (cartData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(cartData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const cartItem = await response.json()
    return cartItem
  } catch (error) {
    console.error('Error creating cart item:', error)
    throw error
  }
}

// Obtener todas las órdenes
export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const orders = await response.json();
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Obtener órdenes de un usuario específico
export const fetchUserOrders = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const orders = await response.json();
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Obtener órdenes por email (incluye compras hechas sin estar logueado)
export const getOrdersByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/email/${encodeURIComponent(email)}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const orders = await response.json();
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error('Error fetching orders by email:', error);
    throw error;
  }
};

// Registrar un nuevo admin (solo para super admin)
export const registerAdmin = async (adminData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar admin');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
};

// Obtener todos los usuarios (solo para admin/superadmin)
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users = await response.json();
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Cambiar el rol de un usuario (solo para superadmin)
export const changeUserRole = async (userId, newRole) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cambiar rol de usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error changing user role:', error);
    throw error;
  }
};

// Eliminar un usuario (solo para superadmin)
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
