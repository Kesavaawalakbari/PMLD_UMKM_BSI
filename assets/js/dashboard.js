/* ==============================================
   PMLD UMKM BSI - Dashboard JavaScript
   ============================================== */

class Dashboard {
    constructor() {
        this.sidebarCollapsed = false;
        this.currentPage = 'overview';
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.showPage('overview');
        this.updateDateTime();
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                if (pageId) {
                    this.showPage(pageId);
                    this.setActiveNavLink(link);
                }
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Action buttons
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        const messageBtn = document.getElementById('messageBtn');
        if (messageBtn) {
            messageBtn.addEventListener('click', () => this.showMessages());
        }

        // User menu
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', () => this.toggleUserMenu());
        }

        // Responsive sidebar
        if (window.innerWidth <= 1024) {
            this.sidebarCollapsed = true;
        }

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());

        // Click outside to close sidebar on mobile
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    initializeComponents() {
        // Initialize charts
        this.initCharts();
        
        // Initialize counters
        this.animateCounters();
        
        // Start real-time updates
        this.startRealTimeUpdates();
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        this.sidebarCollapsed = !this.sidebarCollapsed;
        
        if (sidebar) {
            sidebar.classList.toggle('active', !this.sidebarCollapsed);
        }
    }

    showPage(pageId) {
        // Hide all pages
        const allPages = document.querySelectorAll('.page-content');
        allPages.forEach(page => page.classList.remove('active'));

        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            
            // Update charts if showing overview
            if (pageId === 'overview') {
                setTimeout(() => this.updateCharts(), 100);
            }
        }
    }

    setActiveNavLink(activeLink) {
        // Remove active class from all links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to clicked link
        activeLink.classList.add('active');
    }

    handleSearch(query) {
        // Search functionality
        console.log('Searching for:', query);
        // Implement search logic here
        this.performSearch(query);
    }

    performSearch(query) {
        // Simulate search results
        if (query.length < 2) return;

        // You can implement actual search logic here
        const searchResults = [
            { type: 'product', name: 'Tas Rajut Handmade', category: 'Fashion' },
            { type: 'customer', name: 'Siti Nurhaliza', email: 'siti@email.com' },
            { type: 'order', id: '#ORD-2024-001', status: 'Completed' }
        ].filter(item => 
            item.name?.toLowerCase().includes(query.toLowerCase()) ||
            item.id?.toLowerCase().includes(query.toLowerCase())
        );

        console.log('Search results:', searchResults);
    }

    initCharts() {
        // Revenue Chart
        this.initRevenueChart();
        
        // Traffic Sources Chart
        this.initTrafficChart();
        
        // Mini charts for stat cards
        this.initMiniCharts();
    }

    initRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        // Sample data - replace with real data
        const revenueData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Pendapatan',
                data: [12500000, 19200000, 15800000, 22400000, 18900000, 25600000],
                borderColor: '#00A651',
                backgroundColor: 'rgba(0, 166, 81, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: revenueData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return 'Rp ' + context.parsed.y.toLocaleString('id-ID');
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'Rp ' + (value / 1000000) + 'M';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 6,
                        hoverRadius: 8
                    }
                }
            }
        });
    }

    initTrafficChart() {
        const ctx = document.getElementById('trafficChart');
        if (!ctx) return;

        const trafficData = {
            labels: ['Direct', 'Search Engine', 'Social Media', 'Referral', 'Email'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                    '#00A651',
                    '#3498DB',
                    '#9B59B6',
                    '#F39C12',
                    '#E74C3C'
                ],
                borderWidth: 0
            }]
        };

        this.charts.traffic = new Chart(ctx, {
            type: 'doughnut',
            data: trafficData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    initMiniCharts() {
        // Revenue mini chart
        const revenueCtx = document.getElementById('revenueMiniChart');
        if (revenueCtx) {
            this.charts.revenueMini = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['1', '2', '3', '4', '5', '6', '7'],
                    datasets: [{
                        data: [45, 52, 48, 61, 55, 67, 73],
                        borderColor: '#00A651',
                        backgroundColor: 'rgba(0, 166, 81, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    elements: {
                        point: { radius: 0 }
                    }
                }
            });
        }

        // Orders mini chart
        const ordersCtx = document.getElementById('ordersMiniChart');
        if (ordersCtx) {
            this.charts.ordersMini = new Chart(ordersCtx, {
                type: 'bar',
                data: {
                    labels: ['1', '2', '3', '4', '5', '6', '7'],
                    datasets: [{
                        data: [12, 19, 15, 22, 18, 25, 21],
                        backgroundColor: '#3498DB',
                        borderRadius: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    }
                }
            });
        }
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-value');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (counter.textContent.includes('Rp')) {
                        counter.textContent = 'Rp ' + Math.ceil(current).toLocaleString('id-ID');
                    } else if (counter.textContent.includes('%')) {
                        counter.textContent = Math.ceil(current) + '%';
                    } else {
                        counter.textContent = Math.ceil(current).toLocaleString('id-ID');
                    }
                    requestAnimationFrame(updateCounter);
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    updateCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.update === 'function') {
                chart.update('none');
            }
        });
    }

    startRealTimeUpdates() {
        // Update stats every 30 seconds
        setInterval(() => {
            this.updateRealTimeStats();
        }, 30000);

        // Update activity feed every 60 seconds
        setInterval(() => {
            this.updateActivityFeed();
        }, 60000);
    }

    updateRealTimeStats() {
        // Simulate real-time stat updates
        const stats = {
            revenue: Math.floor(Math.random() * 1000000) + 15000000,
            orders: Math.floor(Math.random() * 50) + 245,
            customers: Math.floor(Math.random() * 10) + 1240,
            conversion: (Math.random() * 2 + 8).toFixed(1)
        };

        // Update revenue
        const revenueElement = document.querySelector('.revenue-card .stat-value');
        if (revenueElement) {
            this.animateValueChange(revenueElement, stats.revenue, 'currency');
        }

        // Update orders
        const ordersElement = document.querySelector('.orders-card .stat-value');
        if (ordersElement) {
            this.animateValueChange(ordersElement, stats.orders, 'number');
        }

        // Update customers
        const customersElement = document.querySelector('.customers-card .stat-value');
        if (customersElement) {
            this.animateValueChange(customersElement, stats.customers, 'number');
        }

        // Update conversion
        const conversionElement = document.querySelector('.conversion-card .stat-value');
        if (conversionElement) {
            this.animateValueChange(conversionElement, stats.conversion, 'percentage');
        }
    }

    animateValueChange(element, newValue, type) {
        const currentValue = parseInt(element.textContent.replace(/[^\d.]/g, ''));
        const difference = newValue - currentValue;
        const steps = 20;
        const stepValue = difference / steps;
        let current = currentValue;

        const animate = () => {
            current += stepValue;
            
            if (type === 'currency') {
                element.textContent = 'Rp ' + Math.floor(current).toLocaleString('id-ID');
            } else if (type === 'percentage') {
                element.textContent = current.toFixed(1) + '%';
            } else {
                element.textContent = Math.floor(current).toLocaleString('id-ID');
            }

            if (Math.abs(current - newValue) > Math.abs(stepValue)) {
                requestAnimationFrame(animate);
            } else {
                if (type === 'currency') {
                    element.textContent = 'Rp ' + newValue.toLocaleString('id-ID');
                } else if (type === 'percentage') {
                    element.textContent = newValue + '%';
                } else {
                    element.textContent = newValue.toLocaleString('id-ID');
                }
            }
        };

        animate();
    }

    updateActivityFeed() {
        // Simulate new activity
        const activities = [
            {
                icon: 'fas fa-shopping-cart',
                text: 'Pesanan baru diterima',
                meta: 'Baru saja',
                status: 'info'
            },
            {
                icon: 'fas fa-user-plus',
                text: 'Pelanggan baru mendaftar',
                meta: '2 menit yang lalu',
                status: 'success'
            },
            {
                icon: 'fas fa-star',
                text: 'Review baru diterima',
                meta: '5 menit yang lalu',
                status: 'warning'
            }
        ];

        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            // Add new activity to the top
            const newActivity = this.createActivityItem(activities[Math.floor(Math.random() * activities.length)]);
            activityList.insertBefore(newActivity, activityList.firstChild);

            // Remove last activity if more than 5
            if (activityList.children.length > 5) {
                activityList.removeChild(activityList.lastChild);
            }
        }
    }

    createActivityItem(activity) {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-text">${activity.text}</p>
                <p class="activity-meta">${activity.meta}</p>
            </div>
            <div class="activity-status">
                <span class="status-badge ${activity.status}">Baru</span>
            </div>
        `;
        return item;
    }

    updateDateTime() {
        const updateTime = () => {
            const now = new Date();
            const timeElement = document.getElementById('currentTime');
            if (timeElement) {
                timeElement.textContent = now.toLocaleString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        };

        updateTime();
        setInterval(updateTime, 60000); // Update every minute
    }

    showNotifications() {
        // Show notification dropdown/modal
        console.log('Showing notifications');
        this.showToast('Anda memiliki 3 notifikasi baru', 'info');
    }

    showMessages() {
        // Show messages dropdown/modal
        console.log('Showing messages');
        this.showToast('Anda memiliki 2 pesan baru', 'info');
    }

    toggleUserMenu() {
        // Toggle user dropdown menu
        console.log('Toggling user menu');
    }

    handleResize() {
        if (window.innerWidth <= 1024) {
            this.sidebarCollapsed = true;
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
        }

        // Resize charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    handleOutsideClick(e) {
        if (window.innerWidth <= 1024) {
            const sidebar = document.querySelector('.sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            
            if (sidebar && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                this.sidebarCollapsed = true;
            }
        }
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

        // Add styles if not exist
        if (!document.getElementById('toastStyles')) {
            const style = document.createElement('style');
            style.id = 'toastStyles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    min-width: 300px;
                    animation: slideInRight 0.3s ease;
                }
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .toast-close {
                    position: absolute;
                    top: 8px;
                    right: 12px;
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    // Export data functionality
    exportData(type) {
        console.log(`Exporting ${type} data`);
        this.showToast(`Data ${type} sedang diunduh...`, 'info');
    }

    // Print functionality
    printDashboard() {
        window.print();
    }
}

// Utility functions
class DashboardUtils {
    static formatCurrency(amount) {
        return 'Rp ' + amount.toLocaleString('id-ID');
    }

    static formatNumber(number) {
        return number.toLocaleString('id-ID');
    }

    static formatDate(date) {
        return new Date(date).toLocaleDateString('id-ID');
    }

    static formatDateTime(date) {
        return new Date(date).toLocaleString('id-ID');
    }

    static calculatePercentage(value, total) {
        return ((value / total) * 100).toFixed(1);
    }

    static generateRandomData(length, min = 0, max = 100) {
        return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    }
}

// Chart.js default configuration
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
Chart.defaults.color = '#666';
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
Chart.defaults.plugins.tooltip.titleColor = '#fff';
Chart.defaults.plugins.tooltip.bodyColor = '#fff';
Chart.defaults.plugins.tooltip.cornerRadius = 8;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is required for dashboard functionality');
        return;
    }

    // Initialize dashboard
    window.dashboard = new Dashboard();
    
    // Make utility functions globally available
    window.DashboardUtils = DashboardUtils;
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close modals/sidebars
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    console.log('Dashboard initialized successfully');
});