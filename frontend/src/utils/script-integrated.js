// BSI UMKM Centre - Login Page JavaScript (WooCommerce Integrated)
// Integrated with WooCommerce/WordPress Authentication

import { login, isAuthenticated } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    
    // Check if already authenticated - redirect to dashboard
    if (isAuthenticated()) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || 'dashboard.html';
        window.location.href = redirect;
        return;
    }
    
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const btnLogin = document.querySelector('.btn-login');
    const btnRegister = document.querySelector('.btn-register');
    
    // Input State Management - Dynamic Border Colors
    function handleInputState(input) {
        // Check if input has value
        if (input.value.trim() !== '') {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }
    }
    
    // Add event listeners for all form inputs
    const allInputs = document.querySelectorAll('.form-input');
    allInputs.forEach(input => {
        // Check initial state
        handleInputState(input);
        
        // On input change (real-time)
        input.addEventListener('input', function() {
            handleInputState(this);
        });
        
        // On focus out (blur) - secondary check
        input.addEventListener('blur', function() {
            setTimeout(() => handleInputState(this), 10);
        });
        
        // On keyup for better responsiveness
        input.addEventListener('keyup', function() {
            handleInputState(this);
        });
    });
    
    // Validation Functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validatePassword(password) {
        return password.length >= 6;
    }
    
    // Error Display Functions
    function showError(message) {
        // Create error alert if not exists
        let errorAlert = document.querySelector('.error-alert');
        if (!errorAlert) {
            errorAlert = document.createElement('div');
            errorAlert.className = 'error-alert';
            errorAlert.style.cssText = `
                background: #fee;
                border-left: 4px solid #dc3545;
                color: #dc3545;
                padding: 12px 16px;
                margin-bottom: 20px;
                border-radius: 4px;
                font-size: 14px;
                animation: slideDown 0.3s ease-out;
            `;
            loginForm.insertBefore(errorAlert, loginForm.firstChild);
        }
        errorAlert.textContent = message;
        errorAlert.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorAlert.style.display = 'none';
        }, 5000);
    }
    
    function showSuccess(message) {
        // Create success alert if not exists
        let successAlert = document.querySelector('.success-alert');
        if (!successAlert) {
            successAlert = document.createElement('div');
            successAlert.className = 'success-alert';
            successAlert.style.cssText = `
                background: #d4edda;
                border-left: 4px solid #28a745;
                color: #155724;
                padding: 12px 16px;
                margin-bottom: 20px;
                border-radius: 4px;
                font-size: 14px;
                animation: slideDown 0.3s ease-out;
            `;
            loginForm.insertBefore(successAlert, loginForm.firstChild);
        }
        successAlert.textContent = message;
        successAlert.style.display = 'block';
    }
    
    // Form Submit Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide previous errors
            const errorAlert = document.querySelector('.error-alert');
            if (errorAlert) errorAlert.style.display = 'none';
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Validation
            if (!email) {
                showError('Email tidak boleh kosong');
                emailInput.focus();
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Format email tidak valid');
                emailInput.focus();
                return;
            }
            
            if (!password) {
                showError('Password tidak boleh kosong');
                passwordInput.focus();
                return;
            }
            
            if (!validatePassword(password)) {
                showError('Password minimal 6 karakter');
                passwordInput.focus();
                return;
            }
            
            // Show loading state
            btnLogin.disabled = true;
            const originalText = btnLogin.textContent;
            btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            
            try {
                // Authenticate with WooCommerce/WordPress
                const user = await login(email, password);
                
                // Store remember me preference
                if (rememberCheckbox && rememberCheckbox.checked) {
                    localStorage.setItem('bsi_remember_email', email);
                } else {
                    localStorage.removeItem('bsi_remember_email');
                }
                
                // Show success message
                showSuccess('Login berhasil! Mengarahkan ke dashboard...');
                btnLogin.innerHTML = '<i class="fas fa-check"></i> Berhasil!';
                btnLogin.style.background = '#28a745';
                
                // Redirect to intended page or dashboard
                setTimeout(() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect') || 'dashboard.html';
                    window.location.href = redirect;
                }, 1500);
                
            } catch (error) {
                // Show error
                const errorMessage = error.message || 'Login gagal. Periksa email dan password Anda.';
                showError(errorMessage);
                
                // Reset button
                btnLogin.disabled = false;
                btnLogin.innerHTML = originalText;
            }
        });
    }
    
    // Register Button Handler
    if (btnRegister) {
        btnRegister.addEventListener('click', function() {
            window.location.href = 'register.html';
        });
    }
    
    // Remember me functionality
    const rememberedEmail = localStorage.getItem('bsi_remember_email');
    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        handleInputState(emailInput);
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }
    
    // Add animation keyframes dynamically
    if (!document.getElementById('login-animations')) {
        const style = document.createElement('style');
        style.id = 'login-animations';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
});
