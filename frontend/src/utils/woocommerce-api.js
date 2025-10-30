// WooCommerce API Integration Layer
// Headless WooCommerce Implementation for BSI UMKM Centre
// Following best practices from WooCommerce Official Documentation

/**
 * Configuration
 * In production, these should come from environment variables
 */
const CONFIG = {
  STORE_URL: process.env.VITE_STORE_URL || 'https://umkmbsi.com',
  CONSUMER_KEY: process.env.VITE_WC_CONSUMER_KEY || '',
  CONSUMER_SECRET: process.env.VITE_WC_CONSUMER_SECRET || '',
  API_VERSION: 'v3',
  STORE_API_VERSION: 'v1'
};

const STORE_API_BASE = `${CONFIG.STORE_URL}/wp-json/wc/store/${CONFIG.STORE_API_VERSION}`;
const REST_API_BASE = `${CONFIG.STORE_URL}/wp-json/wc/${CONFIG.API_VERSION}`;

/**
 * Utility function to handle API responses
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      code: 'api_error',
      message: `HTTP Error: ${response.status} ${response.statusText}`
    }));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

/**
 * Store API - Public endpoints (no authentication required)
 * Used for customer-facing operations
 */
export const StoreAPI = {
  /**
   * Get products from catalog
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Array of products
   */
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      per_page: params.perPage || 20,
      category: params.category || '',
      search: params.search || '',
      orderby: params.orderBy || 'date',
      order: params.order || 'desc'
    });

    try {
      const response = await fetch(`${STORE_API_BASE}/products?${queryParams}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get single product by ID
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Product details
   */
  async getProduct(productId) {
    try {
      const response = await fetch(`${STORE_API_BASE}/products/${productId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Get current cart
   * @returns {Promise<Object>} Cart data
   */
  async getCart() {
    try {
      const response = await fetch(`${STORE_API_BASE}/cart`, {
        credentials: 'include' // Include cookies for cart session
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Updated cart
   */
  async addToCart(productId, quantity = 1) {
    try {
      const response = await fetch(`${STORE_API_BASE}/cart/add-item`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: productId,
          quantity: quantity
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  /**
   * Update cart item quantity
   * @param {string} itemKey - Cart item key
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Updated cart
   */
  async updateCartItem(itemKey, quantity) {
    try {
      const response = await fetch(`${STORE_API_BASE}/cart/update-item`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: itemKey,
          quantity: quantity
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   * @param {string} itemKey - Cart item key
   * @returns {Promise<Object>} Updated cart
   */
  async removeCartItem(itemKey) {
    try {
      const response = await fetch(`${STORE_API_BASE}/cart/remove-item`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: itemKey
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },

  /**
   * Apply coupon to cart
   * @param {string} couponCode - Coupon code
   * @returns {Promise<Object>} Updated cart
   */
  async applyCoupon(couponCode) {
    try {
      const response = await fetch(`${STORE_API_BASE}/cart/apply-coupon`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: couponCode
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  },

  /**
   * Process checkout
   * @param {Object} checkoutData - Checkout form data
   * @returns {Promise<Object>} Order details
   */
  async processCheckout(checkoutData) {
    try {
      const response = await fetch(`${STORE_API_BASE}/checkout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error processing checkout:', error);
      throw error;
    }
  },

  /**
   * Get product categories
   * @returns {Promise<Array>} Array of categories
   */
  async getCategories() {
    try {
      const response = await fetch(`${STORE_API_BASE}/products/categories`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

/**
 * REST API - Admin operations (requires authentication)
 * Used for administrative tasks and customer account management
 */
export const AdminAPI = {
  /**
   * Generate authentication URL with consumer key and secret
   * @param {string} endpoint - API endpoint
   * @returns {string} Full URL with authentication parameters
   */
  getAuthenticatedUrl(endpoint) {
    const url = new URL(endpoint, CONFIG.STORE_URL);
    url.searchParams.append('consumer_key', CONFIG.CONSUMER_KEY);
    url.searchParams.append('consumer_secret', CONFIG.CONSUMER_SECRET);
    return url.toString();
  },

  /**
   * Get orders for authenticated user
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Array of orders
   */
  async getOrders(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      per_page: params.perPage || 10,
      status: params.status || 'any',
      customer: params.customerId || ''
    });

    const endpoint = `${REST_API_BASE}/orders?${queryParams}`;
    const url = this.getAuthenticatedUrl(endpoint);

    try {
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Get single order
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrder(orderId) {
    const endpoint = `${REST_API_BASE}/orders/${orderId}`;
    const url = this.getAuthenticatedUrl(endpoint);

    try {
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Create new customer
   * @param {Object} customerData - Customer information
   * @returns {Promise<Object>} Created customer
   */
  async createCustomer(customerData) {
    const endpoint = `${REST_API_BASE}/customers`;
    const url = this.getAuthenticatedUrl(endpoint);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  /**
   * Get customer data
   * @param {number} customerId - Customer ID
   * @returns {Promise<Object>} Customer details
   */
  async getCustomer(customerId) {
    const endpoint = `${REST_API_BASE}/customers/${customerId}`;
    const url = this.getAuthenticatedUrl(endpoint);

    try {
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      throw error;
    }
  },

  /**
   * Update customer data
   * @param {number} customerId - Customer ID
   * @param {Object} customerData - Updated customer information
   * @returns {Promise<Object>} Updated customer
   */
  async updateCustomer(customerId, customerData) {
    const endpoint = `${REST_API_BASE}/customers/${customerId}`;
    const url = this.getAuthenticatedUrl(endpoint);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating customer ${customerId}:`, error);
      throw error;
    }
  }
};

/**
 * Authentication Helper
 * Manages user authentication state
 */
export const AuthManager = {
  /**
   * Store authentication token
   * @param {string} token - JWT token
   * @param {Object} user - User data
   */
  setAuth(token, user) {
    localStorage.setItem('bsi_auth_token', token);
    localStorage.setItem('bsi_user_data', JSON.stringify(user));
  },

  /**
   * Get authentication token
   * @returns {string|null} JWT token or null
   */
  getToken() {
    return localStorage.getItem('bsi_auth_token');
  },

  /**
   * Get user data
   * @returns {Object|null} User data or null
   */
  getUser() {
    const userData = localStorage.getItem('bsi_user_data');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Clear authentication data
   */
  logout() {
    localStorage.removeItem('bsi_auth_token');
    localStorage.removeItem('bsi_user_data');
    localStorage.removeItem('bsi_cart_data');
  }
};

/**
 * Cart Manager
 * Manages cart state synchronization
 */
export const CartManager = {
  /**
   * Get cart count from localStorage cache
   * @returns {number} Number of items in cart
   */
  getCartCount() {
    const cartData = localStorage.getItem('bsi_cart_data');
    if (cartData) {
      try {
        const cart = JSON.parse(cartData);
        return cart.items_count || 0;
      } catch (error) {
        return 0;
      }
    }
    return 0;
  },

  /**
   * Update cart count in localStorage
   * @param {Object} cartData - Cart data from API
   */
  updateCartCache(cartData) {
    localStorage.setItem('bsi_cart_data', JSON.stringify(cartData));
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new CustomEvent('cart-updated', {
      detail: { cartData }
    }));
  },

  /**
   * Clear cart cache
   */
  clearCartCache() {
    localStorage.removeItem('bsi_cart_data');
  }
};

// Export configuration for testing purposes
export const getConfig = () => ({ ...CONFIG });
