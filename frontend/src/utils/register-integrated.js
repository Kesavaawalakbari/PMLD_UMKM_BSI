// BSI UMKM Centre - Registration Form Script (WooCommerce Integrated)
// Integrated with WooCommerce/WordPress User Registration

import { register, isAuthenticated } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    
    // Check if already authenticated - redirect to dashboard
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Form elements
    const registrationForm = document.getElementById('registrationForm');
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('nama');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const phoneInput = document.getElementById('phone'); // Optional field
    const submitBtn = registrationForm ? registrationForm.querySelector('button[type="submit"]') : null;
    
    // Error message elements
    const emailError = document.getElementById('emailError');
    const nameError = document.getElementById('namaError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    // Validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namePattern = /^[a-zA-Z\s]{2,50}$/;

    // Validation functions
    function validateEmail(email) {
        if (!email.trim()) {
            return 'Email wajib diisi';
        }
        if (!emailPattern.test(email)) {
            return 'Format email tidak valid';
        }
        return null;
    }

    function validateName(name) {
        if (!name.trim()) {
            return 'Nama wajib diisi';
        }
        if (name.trim().length < 2) {
            return 'Nama minimal 2 karakter';
        }
        if (!namePattern.test(name)) {
            return 'Nama hanya boleh berisi huruf dan spasi';
        }
        return null;
    }

    function validatePassword(password) {
        if (!password) {
            return 'Password wajib diisi';
        }
        if (password.length < 6) {
            return 'Password minimal 6 karakter';
        }
        // Additional security checks
        if (!/[a-zA-Z]/.test(password)) {
            return 'Password harus mengandung huruf';
        }
        return null;
    }

    function validateConfirmPassword(password, confirmPassword) {
        if (!confirmPassword) {
            return 'Konfirmasi password wajib diisi';
        }
        if (password !== confirmPassword) {
            return 'Konfirmasi password tidak sesuai';
        }
        return null;
    }

    // Real-time validation
    function showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    function clearError(input, errorElement) {
        input.classList.remove('error', 'success');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    function showFormError(message) {
        // Create form-level error alert
        let formError = document.querySelector('.form-error-alert');
        if (!formError) {
            formError = document.createElement('div');
            formError.className = 'form-error-alert';
            formError.style.cssText = `
                background: #fee;
                border-left: 4px solid #dc3545;
                color: #dc3545;
                padding: 12px 16px;
                margin-bottom: 20px;
                border-radius: 4px;
                font-size: 14px;
                animation: slideDown 0.3s ease-out;
            `;
            registrationForm.insertBefore(formError, registrationForm.firstChild);
        }
        formError.textContent = message;
        formError.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formError.style.display = 'none';
        }, 5000);
    }

    function showFormSuccess(message) {
        let formSuccess = document.querySelector('.form-success-alert');
        if (!formSuccess) {
            formSuccess = document.createElement('div');
            formSuccess.className = 'form-success-alert';
            formSuccess.style.cssText = `
                background: #d4edda;
                border-left: 4px solid #28a745;
                color: #155724;
                padding: 12px 16px;
                margin-bottom: 20px;
                border-radius: 4px;
                font-size: 14px;
                animation: slideDown 0.3s ease-out;
            `;
            registrationForm.insertBefore(formSuccess, registrationForm.firstChild);
        }
        formSuccess.textContent = message;
        formSuccess.style.display = 'block';
    }

    // Input event listeners for real-time validation
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const error = validateEmail(this.value);
            if (this.value === '') {
                clearError(this, emailError);
            } else if (error) {
                showError(this, emailError, error);
            } else {
                showSuccess(this, emailError);
            }
        });
    }

    if (nameInput) {
        nameInput.addEventListener('input', function() {
            const error = validateName(this.value);
            if (this.value === '') {
                clearError(this, nameError);
            } else if (error) {
                showError(this, nameError, error);
            } else {
                showSuccess(this, nameError);
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const error = validatePassword(this.value);
            if (this.value === '') {
                clearError(this, passwordError);
            } else if (error) {
                showError(this, passwordError, error);
            } else {
                showSuccess(this, passwordError);
            }
            
            // Also revalidate confirm password if it has a value
            if (confirmPasswordInput && confirmPasswordInput.value) {
                const confirmError = validateConfirmPassword(this.value, confirmPasswordInput.value);
                if (confirmError) {
                    showError(confirmPasswordInput, confirmPasswordError, confirmError);
                } else {
                    showSuccess(confirmPasswordInput, confirmPasswordError);
                }
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const error = validateConfirmPassword(passwordInput.value, this.value);
            if (this.value === '') {
                clearError(this, confirmPasswordError);
            } else if (error) {
                showError(this, confirmPasswordError, error);
            } else {
                showSuccess(this, confirmPasswordError);
            }
        });
    }

    // Form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide previous errors
            const formError = document.querySelector('.form-error-alert');
            if (formError) formError.style.display = 'none';
            
            // Validate all fields
            const emailErr = validateEmail(emailInput.value);
            const nameErr = validateName(nameInput.value);
            const passwordErr = validatePassword(passwordInput.value);
            const confirmPasswordErr = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
            
            // Show errors if any
            if (emailErr) showError(emailInput, emailError, emailErr);
            if (nameErr) showError(nameInput, nameError, nameErr);
            if (passwordErr) showError(passwordInput, passwordError, passwordErr);
            if (confirmPasswordErr) showError(confirmPasswordInput, confirmPasswordError, confirmPasswordErr);
            
            // Stop if there are errors
            if (emailErr || nameErr || passwordErr || confirmPasswordErr) {
                showFormError('Harap perbaiki kesalahan pada form');
                return;
            }
            
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses Pendaftaran...';
                
                try {
                    // Register with WooCommerce/WordPress
                    const userData = {
                        email: emailInput.value.trim(),
                        name: nameInput.value.trim(),
                        password: passwordInput.value,
                        phone: phoneInput ? phoneInput.value.trim() : ''
                    };
                    
                    const user = await register(userData);
                    
                    // Show success message
                    showFormSuccess('Pendaftaran berhasil! Mengarahkan ke dashboard...');
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Berhasil!';
                    submitBtn.style.background = '#28a745';
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                    
                } catch (error) {
                    // Show error
                    const errorMessage = error.message || 'Pendaftaran gagal. Silakan coba lagi.';
                    showFormError(errorMessage);
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
        });
    }
    
    // Handle input state for better UX
    const allInputs = document.querySelectorAll('.form-input');
    allInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Initial state check
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Add animation keyframes dynamically
    if (!document.getElementById('register-animations')) {
        const style = document.createElement('style');
        style.id = 'register-animations';
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
