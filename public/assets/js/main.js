/* ==============================================
   PMLD UMKM BSI - Main JavaScript
   ============================================== */

// Global Variables
let isScrolling = false;
let currentSection = 'beranda';
let animationCounter = 0;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Hide loading screen
    setTimeout(hideLoadingScreen, 1500);
    
    // Initialize components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeModals();
    initializeForms();
    initializeCounters();
    initializeParticles();
    initializeBackToTop();
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    console.log('PMLD UMKM BSI Application Initialized');
}

// Loading Screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Navigation Functions
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            setActiveNavLink(this);
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Scroll spy
    window.addEventListener('scroll', throttle(updateScrollSpy, 100));
    
    // Navbar scroll effect
    window.addEventListener('scroll', throttle(updateNavbarOnScroll, 100));
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

function setActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });
    
    if (currentSectionId !== currentSection) {
        currentSection = currentSectionId;
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

function updateNavbarOnScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', throttle(handleScrollEffects, 16));
}

function handleScrollEffects() {
    // Parallax effects
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    
    // Reveal animations
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Animations
function initializeAnimations() {
    // Animate floating shapes
    animateFloatingShapes();
    
    // Animate chart bars
    animateChartBars();
    
    // Animate progress circles
    animateProgressCircles();
    
    // Initialize intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const animationType = element.dataset.animation;
            
            switch(animationType) {
                case 'fadeIn':
                    element.classList.add('animate-fade-in');
                    break;
                case 'slideUp':
                    element.classList.add('animate-slide-in-up');
                    break;
                case 'scaleIn':
                    element.classList.add('animate-scale-in');
                    break;
                default:
                    element.classList.add('animate-fade-in');
            }
        }
    });
}

function animateFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const delay = index * 2;
        shape.style.animationDelay = `${delay}s`;
    });
}

function animateChartBars() {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = 'slideUp 1s ease-out forwards';
        }, index * 200);
    });
}

function animateProgressCircles() {
    const progressCircles = document.querySelectorAll('.circle-progress');
    
    progressCircles.forEach(circle => {
        const progress = circle.dataset.progress || 0;
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (progress / 100) * circumference;
        
        const progressBar = circle.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.strokeDasharray = circumference;
            progressBar.style.strokeDashoffset = offset;
        }
    });
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current).toLocaleString();
    }, stepDuration);
}

// Modal Functions
function initializeModals() {
    // Close modal when clicking overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        // Animate modal content
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        
        if (modalContent) {
            modalContent.style.animation = 'modalSlideOut 0.3s ease-out';
            
            setTimeout(() => {
                modal.classList.remove('active');
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        } else {
            modal.classList.remove('active');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    setTimeout(() => {
        openModal(targetModalId);
    }, 300);
}

// Form Functions
function initializeForms() {
    // Initialize all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        initializeForm(form);
    });
    
    // Password strength checker
    initializePasswordStrength();
    
    // Phone number formatting
    initializePhoneFormatting();
}

function initializeForm(form) {
    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(form)) {
            handleFormSubmission(form);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Field ini wajib diisi';
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Format email tidak valid';
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^(\+62|62|0)[\d\-\s]{8,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Format nomor telepon tidak valid';
        }
    }
    
    // Password validation
    if (type === 'password' && value) {
        if (value.length < 8) {
            isValid = false;
            errorMessage = 'Password minimal 8 karakter';
        }
    }
    
    // Display error
    displayFieldError(field, isValid ? '' : errorMessage);
    
    return isValid;
}

function displayFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    if (message) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function handleFormSubmission(form) {
    const formId = form.id;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }
    
    // Simulate API call
    setTimeout(() => {
        // Hide loading state
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
        
        // Handle different forms
        switch(formId) {
            case 'loginForm':
                handleLoginForm(form);
                break;
            case 'registerForm':
                handleRegisterForm(form);
                break;
            case 'demoForm':
                handleDemoForm(form);
                break;
            default:
                showNotification('Form berhasil dikirim!', 'success');
        }
    }, 2000);
}

function handleLoginForm(form) {
    const formData = new FormData(form);
    
    // Mock login validation
    const email = formData.get('email');
    const password = formData.get('password');
    
    if (email === 'demo@umkm.bsi.co.id' && password === 'demo123') {
        showNotification('Login berhasil! Mengarahkan ke dashboard...', 'success');
        setTimeout(() => {
            window.location.href = 'pages/dashboard.html';
        }, 1500);
    } else {
        showNotification('Email atau password salah!', 'error');
    }
}

function handleRegisterForm(form) {
    showNotification('Registrasi berhasil! Silakan cek email untuk verifikasi.', 'success');
    form.reset();
    setTimeout(() => {
        closeModal('registerModal');
        openModal('loginModal');
    }, 2000);
}

function handleDemoForm(form) {
    showNotification('Demo berhasil dijadwalkan! Tim kami akan menghubungi Anda segera.', 'success');
    form.reset();
    setTimeout(() => {
        closeModal('demoModal');
    }, 2000);
}

function initializePasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        const strengthContainer = input.parentNode.parentNode.querySelector('.password-strength');
        if (strengthContainer) {
            input.addEventListener('input', () => {
                updatePasswordStrength(input, strengthContainer);
            });
        }
    });
}

function updatePasswordStrength(input, container) {
    const password = input.value;
    const strengthBar = container.querySelector('.strength-fill');
    const strengthText = container.querySelector('.strength-text');
    
    let score = 0;
    let feedback = 'Sangat lemah';
    let color = '#E74C3C';
    
    // Length check
    if (password.length >= 8) score += 25;
    
    // Lowercase check
    if (/[a-z]/.test(password)) score += 25;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score += 25;
    
    // Number/Special char check
    if (/[\d\W]/.test(password)) score += 25;
    
    // Update feedback
    if (score >= 75) {
        feedback = 'Sangat kuat';
        color = '#27AE60';
    } else if (score >= 50) {
        feedback = 'Kuat';
        color = '#F39C12';
    } else if (score >= 25) {
        feedback = 'Lemah';
        color = '#E67E22';
    }
    
    // Update UI
    if (strengthBar) {
        strengthBar.style.width = `${score}%`;
        strengthBar.style.backgroundColor = color;
    }
    
    if (strengthText) {
        strengthText.textContent = feedback;
        strengthText.style.color = color;
    }
}

function initializePhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            // Add country code if needed
            if (value.startsWith('8')) {
                value = '62' + value;
            } else if (value.startsWith('0')) {
                value = '62' + value.substring(1);
            }
            
            // Format number
            if (value.startsWith('62')) {
                value = value.replace(/^62/, '+62 ');
                value = value.replace(/(\+62\s)(\d{3})(\d{4})(\d{4})/, '$1$2-$3-$4');
            }
            
            this.value = value;
        });
    });
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggle.className = 'fas fa-eye';
    }
}

// Particles
function initializeParticles() {
    createParticles();
}

function createParticles() {
    const particleContainer = document.querySelector('.particles');
    if (!particleContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning and timing
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particleContainer.appendChild(particle);
    }
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100));
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        default: return 'fas fa-info-circle';
    }
}

function closeNotification(closeBtn) {
    const notification = closeBtn.closest('.notification');
    if (notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

// Device Detection
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
    return window.innerWidth > 1024;
}

// Performance Monitoring
function logPerformance(label) {
    if (performance && performance.now) {
        console.log(`${label}: ${performance.now()}ms`);
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Don't show error to users in production
    if (window.location.hostname !== 'localhost') {
        return;
    }
    
    showNotification('Terjadi kesalahan. Silakan refresh halaman.', 'error');
});

// Unhandled Promise Rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});

// Export functions for global use
window.PMLD = {
    openModal,
    closeModal,
    switchModal,
    scrollToSection,
    scrollToTop,
    togglePassword,
    showNotification,
    formatCurrency,
    formatNumber
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}