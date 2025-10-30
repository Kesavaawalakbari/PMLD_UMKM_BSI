// BSI UMKM Centre - Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
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
    
    // Form Submit Handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Validation
            if (!email) {
                alert('Email tidak boleh kosong');
                emailInput.focus();
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Format email tidak valid');
                emailInput.focus();
                return;
            }
            
            if (!password) {
                alert('Password tidak boleh kosong');
                passwordInput.focus();
                return;
            }
            
            if (!validatePassword(password)) {
                alert('Password minimal 6 karakter');
                passwordInput.focus();
                return;
            }
            
            // Mock Login Process
            btnLogin.disabled = true;
            btnLogin.textContent = 'Loading...';
            
            setTimeout(() => {
                alert('Login berhasil! Mengarahkan ke dashboard...');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }, 2000);
        });
    }
    
    // Register Button Handler
    if (btnRegister) {
        btnRegister.addEventListener('click', function() {
            window.location.href = 'register.html';
        });
    }
    
});
