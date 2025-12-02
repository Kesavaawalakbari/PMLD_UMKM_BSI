/* ==============================================
   PMLD UMKM BSI - Animation JavaScript
   ============================================== */

// Animation Controller
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
        this.setupCounterAnimations();
        this.setupTypewriterEffect();
    }

    setupScrollAnimations() {
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animate;
                const delay = element.dataset.delay || 0;

                setTimeout(() => {
                    this.triggerAnimation(element, animationType);
                }, delay);

                this.observer.unobserve(element);
            }
        });
    }

    triggerAnimation(element, type) {
        switch(type) {
            case 'fadeInUp':
                element.style.animation = 'fadeInUp 0.8s ease-out forwards';
                break;
            case 'fadeInDown':
                element.style.animation = 'fadeInDown 0.8s ease-out forwards';
                break;
            case 'fadeInLeft':
                element.style.animation = 'fadeInLeft 0.8s ease-out forwards';
                break;
            case 'fadeInRight':
                element.style.animation = 'fadeInRight 0.8s ease-out forwards';
                break;
            case 'scaleIn':
                element.style.animation = 'scaleIn 0.6s ease-out forwards';
                break;
            case 'slideUp':
                element.style.animation = 'slideUp 0.8s ease-out forwards';
                break;
            case 'rotateIn':
                element.style.animation = 'rotateIn 0.8s ease-out forwards';
                break;
            case 'bounceIn':
                element.style.animation = 'bounceIn 0.8s ease-out forwards';
                break;
            case 'flipInX':
                element.style.animation = 'flipInX 0.8s ease-out forwards';
                break;
            case 'zoomIn':
                element.style.animation = 'zoomIn 0.6s ease-out forwards';
                break;
            default:
                element.style.animation = 'fadeIn 0.6s ease-out forwards';
        }
        
        element.classList.add('animated');
    }

    setupHoverEffects() {
        // Service cards hover effect
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            this.addHoverEffect(card, 'lift');
        });

        // Testimonial cards hover effect
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach(card => {
            this.addHoverEffect(card, 'glow');
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            this.addButtonEffect(button);
        });
    }

    addHoverEffect(element, type) {
        switch(type) {
            case 'lift':
                element.addEventListener('mouseenter', () => {
                    element.style.transform = 'translateY(-10px)';
                    element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                });
                element.addEventListener('mouseleave', () => {
                    element.style.transform = 'translateY(0)';
                    element.style.boxShadow = '';
                });
                break;
            case 'glow':
                element.addEventListener('mouseenter', () => {
                    element.style.boxShadow = '0 0 30px rgba(0, 166, 81, 0.3)';
                });
                element.addEventListener('mouseleave', () => {
                    element.style.boxShadow = '';
                });
                break;
        }
    }

    addButtonEffect(button) {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    setupLoadingAnimations() {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(element => {
            this.addLoadingSpinner(element);
        });
    }

    addLoadingSpinner(element) {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        element.appendChild(spinner);
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
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

            // Format number based on value
            let displayValue = Math.floor(current);
            if (target >= 1000) {
                displayValue = this.formatLargeNumber(displayValue);
            }

            element.textContent = displayValue;
        }, stepDuration);
    }

    formatLargeNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            let index = 0;
            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(typeInterval);
                    // Blinking cursor
                    setInterval(() => {
                        element.style.borderRight = element.style.borderRight === 'none' 
                            ? '2px solid var(--primary-color)' 
                            : 'none';
                    }, 530);
                }
            }, 100);
        });
    }
}

// Particle System
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            count: options.count || 50,
            maxSize: options.maxSize || 4,
            minSize: options.minSize || 1,
            speed: options.speed || 1,
            color: options.color || '#00A651',
            ...options
        };
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.options.count; i++) {
            const particle = this.createParticle();
            this.particles.push(particle);
            this.container.appendChild(particle.element);
        }
    }

    createParticle() {
        const element = document.createElement('div');
        element.className = 'particle';
        
        const size = Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize;
        
        const particle = {
            element: element,
            x: Math.random() * this.container.offsetWidth,
            y: this.container.offsetHeight + 10,
            size: size,
            speed: Math.random() * this.options.speed + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            angle: Math.random() * Math.PI * 2,
            drift: Math.random() * 2 - 1
        };

        element.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${this.options.color};
            border-radius: 50%;
            opacity: ${particle.opacity};
            pointer-events: none;
        `;

        return particle;
    }

    animate() {
        this.particles.forEach((particle, index) => {
            particle.y -= particle.speed;
            particle.x += Math.sin(particle.angle) * particle.drift;
            particle.angle += 0.02;

            if (particle.y < -10 || particle.x < -10 || particle.x > this.container.offsetWidth + 10) {
                // Reset particle
                particle.x = Math.random() * this.container.offsetWidth;
                particle.y = this.container.offsetHeight + 10;
                particle.opacity = Math.random() * 0.5 + 0.3;
            }

            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Chart Animation
class ChartAnimator {
    static animateProgressBar(element, percentage, duration = 2000) {
        const progressBar = element.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.style.transition = `width ${duration}ms ease-out`;
            
            setTimeout(() => {
                progressBar.style.width = percentage + '%';
            }, 100);
        }
    }

    static animateCircularProgress(element, percentage, duration = 2000) {
        const circle = element.querySelector('.progress-circle');
        if (circle) {
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percentage / 100) * circumference;

            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference;
            circle.style.transition = `stroke-dashoffset ${duration}ms ease-out`;

            setTimeout(() => {
                circle.style.strokeDashoffset = offset;
            }, 100);
        }
    }

    static animateBarChart(container, data, duration = 1500) {
        const bars = container.querySelectorAll('.chart-bar');
        
        bars.forEach((bar, index) => {
            const height = data[index] || 0;
            bar.style.height = '0%';
            bar.style.transition = `height ${duration}ms ease-out`;
            
            setTimeout(() => {
                bar.style.height = height + '%';
            }, index * 200);
        });
    }
}

// Scroll Effects Manager
class ScrollEffectsManager {
    constructor() {
        this.elements = [];
        this.ticking = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupParallaxElements();
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateElements();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }

    setupParallaxElements() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            this.elements.push({
                element: element,
                speed: speed,
                type: 'parallax'
            });
        });

        // Setup fade elements
        const fadeElements = document.querySelectorAll('[data-fade]');
        fadeElements.forEach(element => {
            this.elements.push({
                element: element,
                type: 'fade'
            });
        });
    }

    updateElements() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;

        this.elements.forEach(item => {
            const { element, type, speed } = item;
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;

            if (type === 'parallax') {
                const yPos = -(scrollTop - elementTop) * speed;
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            } else if (type === 'fade') {
                const elementCenter = elementTop + rect.height / 2;
                const distanceFromCenter = Math.abs(scrollTop + windowHeight / 2 - elementCenter);
                const maxDistance = windowHeight;
                const opacity = 1 - Math.min(distanceFromCenter / maxDistance, 1);
                element.style.opacity = Math.max(opacity, 0);
            }
        });
    }
}

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 10;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
        });
    }

    addTrailPoint(x, y) {
        const point = document.createElement('div');
        point.className = 'mouse-trail-point';
        point.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--primary-color);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.7;
            transform: translate(-50%, -50%);
            animation: trailFade 0.8s ease-out forwards;
        `;

        document.body.appendChild(point);

        setTimeout(() => {
            point.remove();
        }, 800);
    }
}

// Page Transition Manager
class PageTransitionManager {
    constructor() {
        this.isTransitioning = false;
        this.init();
    }

    init() {
        // Add page enter animation
        document.body.classList.add('page-enter');
        
        setTimeout(() => {
            document.body.classList.add('page-enter-active');
            document.body.classList.remove('page-enter');
        }, 50);

        // Handle link clicks for smooth transitions
        this.setupLinkTransitions();
    }

    setupLinkTransitions() {
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!this.isTransitioning && !link.target) {
                    e.preventDefault();
                    this.transitionToPage(link.href);
                }
            });
        });
    }

    transitionToPage(url) {
        this.isTransitioning = true;
        
        document.body.classList.add('page-exit');
        
        setTimeout(() => {
            document.body.classList.add('page-exit-active');
        }, 50);

        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }
}

// Initialize Animation System
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Animation Controller
    const animationController = new AnimationController();
    
    // Initialize Particle System for hero section
    const heroParticles = document.querySelector('.hero .particles');
    if (heroParticles) {
        new ParticleSystem(heroParticles, {
            count: 30,
            maxSize: 3,
            minSize: 1,
            speed: 0.5,
            color: 'rgba(0, 166, 81, 0.6)'
        });
    }
    
    // Initialize Scroll Effects
    const scrollEffects = new ScrollEffectsManager();
    
    // Initialize Page Transitions
    const pageTransitions = new PageTransitionManager();
    
    // Initialize Mouse Trail (optional - can be disabled for performance)
    if (window.innerWidth > 1024) { // Only on desktop
        // const mouseTrail = new MouseTrail();
    }
    
    // Animate charts when they come into view
    const chartElements = document.querySelectorAll('.chart-container');
    const chartObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chartType = entry.target.dataset.chartType;
                
                switch(chartType) {
                    case 'progress':
                        ChartAnimator.animateProgressBar(entry.target, 85);
                        break;
                    case 'circular':
                        ChartAnimator.animateCircularProgress(entry.target, 95);
                        break;
                    case 'bar':
                        ChartAnimator.animateBarChart(entry.target, [60, 80, 45, 90, 75]);
                        break;
                }
                
                chartObserver.unobserve(entry.target);
            }
        });
    });
    
    chartElements.forEach(chart => {
        chartObserver.observe(chart);
    });
    
    console.log('Animation System Initialized');
});

// Add custom CSS for animations
const animationStyles = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        opacity: 1;
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes flipInX {
    from {
        transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
        opacity: 0;
    }
    40% {
        transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    }
    60% {
        transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
        opacity: 1;
    }
    80% {
        transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    }
    to {
        transform: perspective(400px);
        opacity: 1;
    }
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes trailFade {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.7;
    }
    100% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
}

.mouse-trail-point {
    animation: trailFade 0.8s ease-out forwards;
}

.page-enter {
    opacity: 0;
    transform: translateY(20px);
}

.page-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-exit {
    opacity: 1;
    transform: translateY(0);
}

.page-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
}
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);