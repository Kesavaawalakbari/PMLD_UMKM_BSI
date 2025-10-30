// Products Page JavaScript - WooCommerce Integration
// BSI UMKM Centre Product Catalog

import { StoreAPI, CartManager } from './woocommerce-api.js';

// State management
const state = {
    products: [],
    categories: [],
    currentPage: 1,
    perPage: 12,
    totalProducts: 0,
    totalPages: 0,
    filters: {
        category: '',
        search: '',
        orderBy: 'date',
        order: 'desc'
    }
};

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const searchInput = document.getElementById('searchInput');
const paginationContainer = document.getElementById('pagination');

// Initialize page
async function init() {
    showLoading();
    
    try {
        // Load categories
        await loadCategories();
        
        // Load products
        await loadProducts();
        
        // Setup event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Gagal memuat data produk. Silakan refresh halaman.');
    }
}

// Load categories from WooCommerce
async function loadCategories() {
    try {
        const categories = await StoreAPI.getCategories();
        state.categories = categories;
        
        // Populate category filter
        categoryFilter.innerHTML = '<option value="">Semua Kategori</option>';
        categories.forEach(category => {
            if (category.count > 0) { // Only show categories with products
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = `${category.name} (${category.count})`;
                categoryFilter.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load products with current filters
async function loadProducts() {
    showLoading();
    
    try {
        const params = {
            page: state.currentPage,
            perPage: state.perPage,
            category: state.filters.category,
            search: state.filters.search,
            orderBy: state.filters.orderBy,
            order: state.filters.order
        };
        
        const response = await StoreAPI.getProducts(params);
        
        state.products = response.items || response;
        state.totalProducts = response.total || response.length;
        state.totalPages = Math.ceil(state.totalProducts / state.perPage);
        
        renderProducts();
        renderPagination();
        
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Gagal memuat produk. Silakan coba lagi.');
    }
}

// Render products grid
function renderProducts() {
    if (!state.products || state.products.length === 0) {
        showEmpty();
        return;
    }
    
    productsGrid.innerHTML = state.products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
                <img 
                    src="${product.images && product.images.length > 0 ? product.images[0].src : '/assets/placeholder.jpg'}" 
                    alt="${product.name}"
                    class="product-image"
                    onerror="this.src='/assets/placeholder.jpg'"
                >
                ${product.on_sale ? '<span class="product-badge">SALE</span>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">
                    ${product.categories && product.categories.length > 0 ? product.categories[0].name : 'Produk'}
                </div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price ${product.on_sale ? 'on-sale' : ''}">
                    ${product.on_sale ? `
                        <span class="sale-price">${formatPrice(product.sale_price)}</span>
                        <span class="regular-price">${formatPrice(product.regular_price)}</span>
                    ` : formatPrice(product.price)}
                </div>
                <div class="product-actions">
                    <button 
                        class="btn-add-cart" 
                        onclick="addToCart(${product.id})"
                        ${product.stock_status !== 'instock' ? 'disabled' : ''}
                    >
                        <i class="fas fa-shopping-cart"></i>
                        ${product.stock_status === 'instock' ? 'Tambah ke Keranjang' : 'Stok Habis'}
                    </button>
                    <button 
                        class="btn-view-details" 
                        onclick="viewProduct(${product.id})"
                    >
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Format price to Indonesian Rupiah
function formatPrice(price) {
    if (!price) return 'Rp 0';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numPrice);
}

// Add product to cart
window.addToCart = async function(productId) {
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    
    try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menambahkan...';
        
        const cart = await StoreAPI.addToCart(productId, 1);
        
        // Update cart count
        CartManager.updateCartCache(cart);
        
        // Show success feedback
        btn.innerHTML = '<i class="fas fa-check"></i> Ditambahkan!';
        btn.style.background = '#28a745';
        
        // Show notification
        showNotification('Produk berhasil ditambahkan ke keranjang!', 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        btn.innerHTML = originalText;
        btn.disabled = false;
        showNotification('Gagal menambahkan ke keranjang. Silakan coba lagi.', 'error');
    }
};

// View product details
window.viewProduct = function(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
};

// Render pagination
function renderPagination() {
    if (state.totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button 
            onclick="goToPage(${state.currentPage - 1})" 
            ${state.currentPage === 1 ? 'disabled' : ''}
        >
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;
    
    // Page numbers (show max 5 pages)
    const startPage = Math.max(1, state.currentPage - 2);
    const endPage = Math.min(state.totalPages, state.currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += '<button onclick="goToPage(1)">1</button>';
        if (startPage > 2) {
            paginationHTML += '<button disabled>...</button>';
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button 
                onclick="goToPage(${i})" 
                class="${i === state.currentPage ? 'active' : ''}"
            >
                ${i}
            </button>
        `;
    }
    
    if (endPage < state.totalPages) {
        if (endPage < state.totalPages - 1) {
            paginationHTML += '<button disabled>...</button>';
        }
        paginationHTML += `<button onclick="goToPage(${state.totalPages})">${state.totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button 
            onclick="goToPage(${state.currentPage + 1})" 
            ${state.currentPage === state.totalPages ? 'disabled' : ''}
        >
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Go to specific page
window.goToPage = function(page) {
    if (page < 1 || page > state.totalPages || page === state.currentPage) return;
    state.currentPage = page;
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Setup event listeners
function setupEventListeners() {
    // Category filter
    categoryFilter.addEventListener('change', function() {
        state.filters.category = this.value;
        state.currentPage = 1;
        loadProducts();
    });
    
    // Sort filter
    sortFilter.addEventListener('change', function() {
        const [orderBy, order] = this.value.split('-');
        state.filters.orderBy = orderBy;
        state.filters.order = order;
        state.currentPage = 1;
        loadProducts();
    });
    
    // Search input with debounce
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.filters.search = this.value.trim();
            state.currentPage = 1;
            loadProducts();
        }, 500); // Wait 500ms after user stops typing
    });
}

// Show loading state
function showLoading() {
    productsGrid.innerHTML = `
        <div class="loading-state" style="grid-column: 1 / -1;">
            <div><i class="fas fa-spinner fa-spin"></i></div>
            <p>Memuat produk...</p>
        </div>
    `;
    paginationContainer.innerHTML = '';
}

// Show empty state
function showEmpty() {
    productsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <div><i class="fas fa-box-open"></i></div>
            <h3>Tidak ada produk ditemukan</h3>
            <p>Coba ubah filter atau kata kunci pencarian Anda</p>
        </div>
    `;
    paginationContainer.innerHTML = '';
}

// Show error state
function showError(message) {
    productsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <div><i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i></div>
            <h3>Terjadi Kesalahan</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn-primary" style="margin-top: 20px;">
                <i class="fas fa-redo"></i> Coba Lagi
            </button>
        </div>
    `;
    paginationContainer.innerHTML = '';
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
if (!document.getElementById('notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
