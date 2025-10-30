// Authentication Module for BSI UMKM Centre
// Integrates with WordPress/WooCommerce authentication system

import { AdminAPI, AuthManager } from './woocommerce-api.js';

/**
 * WordPress REST API authentication endpoint
 * Requires JWT Authentication plugin
 */
const AUTH_ENDPOINTS = {
  LOGIN: '/wp-json/jwt-auth/v1/token',
  VALIDATE: '/wp-json/jwt-auth/v1/token/validate',
  REGISTER: '/wp-json/wp/v2/users/register'
};

const STORE_URL = process.env.VITE_STORE_URL || 'https://umkmbsi.com';

/**
 * Login user with WordPress credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data with token
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${STORE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: email,
        password: password
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Login gagal. Periksa email dan password Anda.'
      }));
      throw new Error(error.message);
    }

    const data = await response.json();
    
    // Store authentication data
    AuthManager.setAuth(data.token, {
      id: data.user_id,
      email: data.user_email,
      displayName: data.user_display_name,
      niceName: data.user_nicename
    });

    // Fetch additional customer data from WooCommerce
    try {
      const customerData = await AdminAPI.getCustomer(data.user_id);
      const enrichedUser = {
        ...AuthManager.getUser(),
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        billing: customerData.billing,
        shipping: customerData.shipping
      };
      
      AuthManager.setAuth(data.token, enrichedUser);
      
      return enrichedUser;
    } catch (error) {
      // Continue even if customer data fetch fails
      console.warn('Could not fetch customer data:', error);
      return AuthManager.getUser();
    }

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user data
 */
export async function register(userData) {
  try {
    // First, create WordPress user
    const wpUserResponse = await fetch(`${STORE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: userData.email,
        email: userData.email,
        password: userData.password
      })
    });

    if (!wpUserResponse.ok) {
      const error = await wpUserResponse.json().catch(() => ({
        message: 'Pendaftaran gagal. Email mungkin sudah terdaftar.'
      }));
      throw new Error(error.message);
    }

    const wpUser = await wpUserResponse.json();

    // Then, create WooCommerce customer with additional details
    const customerData = {
      email: userData.email,
      first_name: userData.name.split(' ')[0] || '',
      last_name: userData.name.split(' ').slice(1).join(' ') || '',
      username: userData.email,
      billing: {
        first_name: userData.name.split(' ')[0] || '',
        last_name: userData.name.split(' ').slice(1).join(' ') || '',
        email: userData.email,
        phone: userData.phone || '',
        country: 'ID',
        state: '',
        city: '',
        address_1: '',
        address_2: '',
        postcode: ''
      },
      shipping: {
        first_name: userData.name.split(' ')[0] || '',
        last_name: userData.name.split(' ').slice(1).join(' ') || '',
        country: 'ID',
        state: '',
        city: '',
        address_1: '',
        address_2: '',
        postcode: ''
      }
    };

    try {
      await AdminAPI.createCustomer(customerData);
    } catch (error) {
      console.warn('Could not create WooCommerce customer:', error);
      // Continue even if customer creation fails
    }

    // Auto-login after registration
    return await login(userData.email, userData.password);

  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Validate current authentication token
 * @returns {Promise<boolean>} Validation result
 */
export async function validateToken() {
  const token = AuthManager.getToken();
  
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${STORE_URL}${AUTH_ENDPOINTS.VALIDATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

/**
 * Logout current user
 */
export function logout() {
  AuthManager.logout();
  window.location.href = '/';
}

/**
 * Get current authenticated user
 * @returns {Object|null} User data or null
 */
export function getCurrentUser() {
  return AuthManager.getUser();
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export function isAuthenticated() {
  return AuthManager.isAuthenticated();
}

/**
 * Require authentication - redirect to login if not authenticated
 * @param {string} redirectUrl - URL to redirect after login
 */
export async function requireAuth(redirectUrl = null) {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    const currentPath = redirectUrl || window.location.pathname;
    window.location.href = `/?redirect=${encodeURIComponent(currentPath)}`;
    return false;
  }

  // Validate token
  const valid = await validateToken();
  
  if (!valid) {
    AuthManager.logout();
    const currentPath = redirectUrl || window.location.pathname;
    window.location.href = `/?redirect=${encodeURIComponent(currentPath)}`;
    return false;
  }

  return true;
}

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user data
 */
export async function updateProfile(profileData) {
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const updatedCustomer = await AdminAPI.updateCustomer(user.id, profileData);
    
    // Update local user data
    const updatedUser = {
      ...user,
      firstName: updatedCustomer.first_name,
      lastName: updatedCustomer.last_name,
      billing: updatedCustomer.billing,
      shipping: updatedCustomer.shipping
    };
    
    const token = AuthManager.getToken();
    AuthManager.setAuth(token, updatedUser);
    
    return updatedUser;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}
