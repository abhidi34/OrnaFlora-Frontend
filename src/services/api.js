// API Service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/';

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || `API error: ${response.status}`);
    } catch {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
  }
  return response.json().catch(() => ({}));
};

export const apiService = {
  // Authentication
login: async (email, password) => {
  const response = await fetch(`${API_BASE_URL}auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);

  // Save JWT and user
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("currentUser", data.user.email);

  return data;
},

  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  getProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}auth/profile/${userId}`);
    return handleResponse(response);
  },

  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}products`);
    return handleResponse(response);
  },

  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}products/${id}`);
    return handleResponse(response);
  },

  getProductsByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}products/category/${category}`);
    return handleResponse(response);
  },

  searchProducts: async (term) => {
    const response = await fetch(`${API_BASE_URL}products/search/${term}`);
    return handleResponse(response);
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}products/categories/all`);
    return handleResponse(response);
  },

  getAvailableProducts: async () => {
    const response = await fetch(`${API_BASE_URL}products/available/all`);
    return handleResponse(response);
  },

  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}products/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Orders
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  getOrders: async (userId) => {
    const response = await fetch(`${API_BASE_URL}orders?userId=${userId}`);
    return handleResponse(response);
  },

  getOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}orders/${orderId}`);
    return handleResponse(response);
  },

  updateOrder: async (orderId, orderData) => {
    const response = await fetch(`${API_BASE_URL}orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  deleteOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}orders/${orderId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  getAllOrders: async () => {
    const response = await fetch(`${API_BASE_URL}orders/all`);
    return handleResponse(response);
  },

  // Cart
  addToCart: async (userId, productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}carts/${userId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse(response);
  },

  getCart: async (userId) => {
    const response = await fetch(`${API_BASE_URL}carts/${userId}`);
    return handleResponse(response);
  },

  updateCartItem: async (userId, productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}carts/${userId}/items/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },

  removeFromCart: async (userId, productId) => {
    const response = await fetch(`${API_BASE_URL}carts/${userId}/items/${productId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  clearCart: async (userId) => {
    const response = await fetch(`${API_BASE_URL}carts/${userId}/clear`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Addresses
  addAddress: async (userId, addressData) => {
    const response = await fetch(`${API_BASE_URL}addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addressData, userId }),
    });
    return handleResponse(response);
  },

  getAddresses: async (userId) => {
    const response = await fetch(`${API_BASE_URL}addresses?userId=${userId}`);
    return handleResponse(response);
  },

  getAddress: async (addressId) => {
    const response = await fetch(`${API_BASE_URL}addresses/${addressId}`);
    return handleResponse(response);
  },

  updateAddress: async (addressId, addressData) => {
    const response = await fetch(`${API_BASE_URL}addresses/${addressId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData),
    });
    return handleResponse(response);
  },

  deleteAddress: async (addressId) => {
    const response = await fetch(`${API_BASE_URL}addresses/${addressId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Users
  getUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}users/${userId}`);
    return handleResponse(response);
  },

  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}users/${userId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}users/all`);
    return handleResponse(response);
  },

  changePassword: async (userId, passwordData) => {
    const response = await fetch(`${API_BASE_URL}users/${userId}/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordData),
    });
    return handleResponse(response);
  },
};
