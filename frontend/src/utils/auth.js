// Authentication Module for BSI UMKM Centre
// Integrates with Supabase + Express.js Backend API
// Combined authentication: Supabase Auth + Custom Backend

/**
 * Supabase Configuration
 * For direct Supabase auth (optional - can use backend API instead)
 */
const SUPABASE_URL = import.meta?.env?.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta?.env?.VITE_SUPABASE_ANON_KEY || '';

/**
 * Backend API Configuration
 * Primary authentication through Express.js backend
 */
const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';
const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  VALIDATE: '/api/auth/validate',
  PROFILE: '/api/auth/profile',
  LOGOUT: '/api/auth/logout'
};

/**
 * Auth Manager - Handles token and user data storage
 * Compatible with both Supabase and custom JWT
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
    // Also clear Supabase session if using direct Supabase auth
    localStorage.removeItem('supabase.auth.token');
  },
  
  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  }
};

/**
 * Login user with backend API (Supabase database)
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
    if (data.success && data.data) {
      AuthManager.setAuth(data.data.token, data.data.user);
      return data.data.user;
    } else {
      AuthManager.setAuth(data.token, data.user);
      return data.user;
    }

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Register new user with backend API (Supabase database)
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
        nama: userData.name || userData.nama,
        confirmPassword: userData.confirmPassword || userData.password
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
    if (data.success && data.data) {
      AuthManager.setAuth(data.data.token, data.data.user);
      return data.data.user;
    } else {
      AuthManager.setAuth(data.token, data.user);
      return data.user;
    }

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
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.PROFILE}`, {
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
    if (data.success && data.data) {
      AuthManager.setUser(data.data.user);
      return data.data.user;
    } else {
      AuthManager.setUser(data.user);
      return data.user;
    }
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}

/**
 * Get authorization header for API requests
 * @returns {Object} Headers object with Authorization
 */
export function getAuthHeaders() {
  const token = AuthManager.getToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
}

// Export AuthManager for advanced usage
export { AuthManager };
