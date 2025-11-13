// BSI UMKM Centre - Login Form Script

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Track input changes
    emailInput.addEventListener('input', function() {
        if (this.value) {
            this.classList.add('filled');
        } else {
            this.classList.remove('filled');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value) {
            this.classList.add('filled');
        } else {
            this.classList.remove('filled');
        }
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Simple validation
        if (!email || !password) {
            alert('Silakan isi email dan password');
            return;
        }

        // Log untuk testing
        console.log('Email:', email);
        console.log('Password:', password);
        
        // TODO: Integrasikan dengan backend API
        alert('Login submitted: ' + email);
    });
});
