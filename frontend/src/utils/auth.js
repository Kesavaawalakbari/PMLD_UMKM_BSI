// Authentication Module for BSI UMKM Centre
// Integrates with Express.js Backend API

/**
 * Express.js Backend API authentication endpoints
 */
const API_BASE_URL = 'http://localhost:5000';
const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  VALIDATE: '/api/auth/validate',
  PROFILE: '/api/auth/profile'
};

/**
 * Auth Manager - Handles token and user data storage
 */
const AuthManager = {
  getToken() {
    return localStorage.getItem('bsi_auth_token');
  },
  
  setToken(token) {
    localStorage.setItem('bsi_auth_token', token);
  },
  
  getUser() {
    const userStr = localStorage.getItem('bsi_user_data');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  setUser(user) {
    localStorage.setItem('bsi_user_data', JSON.stringify(user));
  },
  
  setAuth(token, user) {
    this.setToken(token);
    this.setUser(user);
  },
  
  logout() {
    localStorage.removeItem('bsi_auth_token');
    localStorage.removeItem('bsi_user_data');
    localStorage.removeItem('bsi_remember_email');
  },
  
  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  }
};

/**
 * Login user with Express backend credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data with token
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
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
    AuthManager.setAuth(data.token, data.user);

    return data.user;

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Register new user with Express backend
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user data
 */
export async function register(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone || ''
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Pendaftaran gagal. Email mungkin sudah terdaftar.'
      }));
      throw new Error(error.message);
    }

    const data = await response.json();
    
    // Store authentication data (backend auto-logs in after registration)
    AuthManager.setAuth(data.token, data.user);

    return data.user;

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
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.VALIDATE}`, {
      method: 'GET',
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
  window.location.href = 'landingpage.html';
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
    window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
    return false;
  }

  // Validate token
  const valid = await validateToken();
  
  if (!valid) {
    AuthManager.logout();
    const currentPath = redirectUrl || window.location.pathname;
    window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
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
  const token = AuthManager.getToken();
  
  if (!user || !token) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.PROFILE}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error('Profile update failed');
    }

    const data = await response.json();
    
    // Update local user data
    AuthManager.setUser(data.user);
    
    return data.user;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}
