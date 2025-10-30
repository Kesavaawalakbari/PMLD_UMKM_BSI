// Shopping Cart JavaScript - WooCommerce Integration
// BSI UMKM Centre

import { StoreAPI, CartManager } from './woocommerce-api.js';

// State management
const state = {
    cart: null,
    loading: false
};

// DOM Elements
const cartContent = document.getElementById('cartContent');
const cartItemCount = document.getElementById('cartItemCount');

// Initialize cart
async function init() {
    await loadCart();
    setupEventListeners();
}

// Load cart from WooCommerce
async function loadCart() {
    showLoading(true);
    
    try {
        const cart = await StoreAPI.getCart();
        state.cart = cart;
        
        // Update cache
        CartManager.updateCartCache(cart);
        
        renderCart();
    } catch (error) {
        console.error('Error loading cart:', error);
        showError('Gagal memuat keranjang. Silakan refresh halaman.');
    } finally {
        showLoading(false);
    }
}

// Render cart
function renderCart() {
    if (!state.cart || !state.cart.items || state.cart.items.length === 0) {
        showEmptyCart();
        return;
    }
    
    // Update item count
    cartItemCount.textContent = `${state.cart.items_count} item dalam keranjang`;
    
    // Render cart items and summary
    cartContent.innerHTML = `
        <div class="cart-items">
            ${state.cart.items.map(item => renderCartItem(item)).join('')}
        </div>
        <div class="cart-summary">
            ${renderCartSummary()}
        </div>
    `;
}

// Render single cart item
function renderCartItem(item) {
    return `
        <div class="cart-item" data-item-key="${item.key}">
            <img 
                src="${item.images && item.images.length > 0 ? item.images[0].src : '/assets/placeholder.jpg'}" 
                alt="${item.name}"
                class="item-image"
                onerror="this.src='/assets/placeholder.jpg'"
            >
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${formatPrice(item.prices.price)}</div>
                <div class="item-quantity">
                    <button 
                        class="qty-btn" 
                        onclick="updateQuantity('${item.key}', ${item.quantity.value - 1})"
                        ${item.quantity.value <= 1 ? 'disabled' : ''}
                    >
                        <i class="fas fa-minus"></i>
                    </button>
                    <input 
                        type="number" 
                        class="qty-input" 
                        value="${item.quantity.value}" 
                        min="1" 
                        max="${item.quantity.max_purchase || 999}"
                        onchange="updateQuantity('${item.key}', this.value)"
                    >
                    <button 
                        class="qty-btn" 
                        onclick="updateQuantity('${item.key}', ${item.quantity.value + 1})"
                        ${item.quantity.value >= (item.quantity.max_purchase || 999) ? 'disabled' : ''}
                    >
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button 
                class="item-remove" 
                onclick="removeItem('${item.key}')"
                title="Hapus dari keranjang"
            >
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// Render cart summary
function renderCartSummary() {
    const cart = state.cart;
    
    return `
        <h3 class="summary-title">Ringkasan Belanja</h3>
        
        <div class="summary-row">
            <span>Subtotal (${cart.items_count} item)</span>
            <span>${formatPrice(cart.totals.total_items)}</span>
        </div>
        
        ${cart.totals.total_discount > 0 ? `
            <div class="summary-row" style="color: #28a745;">
                <span>Diskon</span>
                <span>-${formatPrice(cart.totals.total_discount)}</span>
            </div>
        ` : ''}
        
        ${cart.totals.total_shipping > 0 ? `
            <div class="summary-row">
                <span>Ongkos Kirim</span>
                <span>${formatPrice(cart.totals.total_shipping)}</span>
            </div>
        ` : ''}
        
        ${cart.totals.total_tax > 0 ? `
            <div class="summary-row">
                <span>Pajak</span>
                <span>${formatPrice(cart.totals.total_tax)}</span>
            </div>
        ` : ''}
        
        <div class="summary-row total">
            <span>Total</span>
            <span>${formatPrice(cart.totals.total_price)}</span>
        </div>
        
        <button class="btn-checkout" onclick="proceedToCheckout()">
            <i class="fas fa-lock"></i> Lanjut ke Pembayaran
        </button>
        
        <div class="coupon-section">
            <label for="couponCode" style="display: block; margin-bottom: 10px; font-weight: 600;">
                Punya Kode Kupon?
            </label>
            <div class="coupon-input-group">
                <input 
                    type="text" 
                    id="couponCode" 
                    placeholder="Masukkan kode kupon"
                >
                <button class="btn-apply-coupon" onclick="applyCoupon()">
                    Gunakan
                </button>
            </div>
        </div>
    `;
}

// Update item quantity
window.updateQuantity = async function(itemKey, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) return;
    
    showLoading(true);
    
    try {
        const updatedCart = await StoreAPI.updateCartItem(itemKey, newQuantity);
        state.cart = updatedCart;
        CartManager.updateCartCache(updatedCart);
        renderCart();
        showNotification('Jumlah item berhasil diperbarui', 'success');
    } catch (error) {
        console.error('Error updating quantity:', error);
        showNotification('Gagal memperbarui jumlah item', 'error');
    } finally {
        showLoading(false);
    }
};

// Remove item from cart
window.removeItem = async function(itemKey) {
    if (!confirm('Hapus item ini dari keranjang?')) return;
    
    showLoading(true);
    
    try {
        const updatedCart = await StoreAPI.removeCartItem(itemKey);
        state.cart = updatedCart;
        CartManager.updateCartCache(updatedCart);
        renderCart();
        showNotification('Item berhasil dihapus dari keranjang', 'success');
    } catch (error) {
        console.error('Error removing item:', error);
        showNotification('Gagal menghapus item', 'error');
    } finally {
        showLoading(false);
    }
};

// Apply coupon code
window.applyCoupon = async function() {
    const couponInput = document.getElementById('couponCode');
    const couponCode = couponInput.value.trim();
    
    if (!couponCode) {
        showNotification('Masukkan kode kupon', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const updatedCart = await StoreAPI.applyCoupon(couponCode);
        state.cart = updatedCart;
        CartManager.updateCartCache(updatedCart);
        renderCart();
        showNotification('Kupon berhasil diterapkan!', 'success');
        couponInput.value = '';
    } catch (error) {
        console.error('Error applying coupon:', error);
        showNotification(error.message || 'Kode kupon tidak valid', 'error');
    } finally {
        showLoading(false);
    }
};

// Proceed to checkout
window.proceedToCheckout = function() {
    window.location.href = 'checkout.html';
};

// Continue shopping
window.continueShopping = function() {
    window.location.href = 'products.html';
};

// Show empty cart
function showEmptyCart() {
    cartItemCount.textContent = 'Keranjang belanja kosong';
    
    cartContent.innerHTML = `
        <div class="empty-cart" style="grid-column: 1 / -1;">
            <div><i class="fas fa-shopping-cart"></i></div>
            <h2>Keranjang Belanja Kosong</h2>
            <p>Belum ada produk dalam keranjang Anda</p>
            <button class="btn-continue-shopping" onclick="continueShopping()">
                <i class="fas fa-arrow-left"></i> Mulai Belanja
            </button>
        </div>
    `;
}

// Show loading overlay
function showLoading(show) {
    state.loading = show;
    
    let overlay = document.getElementById('loadingOverlay');
    
    if (show) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <div><i class="fas fa-spinner fa-spin"></i></div>
                    <p>Memproses...</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
    } else {
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
}

// Show error state
function showError(message) {
    cartContent.innerHTML = `
        <div class="empty-cart" style="grid-column: 1 / -1;">
            <div><i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i></div>
            <h2>Terjadi Kesalahan</h2>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn-continue-shopping">
                <i class="fas fa-redo"></i> Coba Lagi
            </button>
        </div>
    `;
}

// Format price to Indonesian Rupiah
function formatPrice(price) {
    if (!price) return 'Rp 0';
    
    // Handle WooCommerce price format (string with currency code)
    let numPrice = price;
    if (typeof price === 'string') {
        // Remove currency code and convert to number
        numPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    }
    
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numPrice / 100); // WooCommerce stores prices in cents
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
        z-index: 10001;
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

// Setup event listeners
function setupEventListeners() {
    // Listen for cart updates from other pages
    window.addEventListener('cart-updated', function(event) {
        state.cart = event.detail.cartData;
        renderCart();
    });
}

// Add animation styles
if (!document.getElementById('cart-animations')) {
    const style = document.createElement('style');
    style.id = 'cart-animations';
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
