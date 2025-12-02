/**
 * API Utilities for Admin Panel
 * BSI UMKM Centre - KONEK System
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

/**
 * Create headers with authentication
 */
const createHeaders = (includeContentType = true): HeadersInit => {
    const headers: HeadersInit = {};
    
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }
    
    return headers;
};

/**
 * Handle API response
 */
const handleResponse = async (response: Response) => {
    const data = await response.json();
    
    if (!response.ok) {
        if (response.status === 401) {
            // Token expired or invalid - redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        }
        throw new Error(data.message || 'An error occurred');
    }
    
    return data;
};

/**
 * API client with common methods
 */
export const apiClient = {
    /**
     * GET request
     */
    get: async (endpoint: string, params?: Record<string, string>) => {
        let url = `${API_BASE_URL}${endpoint}`;
        
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: createHeaders(),
        });
        
        return handleResponse(response);
    },
    
    /**
     * POST request
     */
    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(data),
        });
        
        return handleResponse(response);
    },
    
    /**
     * PUT request
     */
    put: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(data),
        });
        
        return handleResponse(response);
    },
    
    /**
     * PATCH request
     */
    patch: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: createHeaders(),
            body: JSON.stringify(data),
        });
        
        return handleResponse(response);
    },
    
    /**
     * DELETE request
     */
    delete: async (endpoint: string) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: createHeaders(),
        });
        
        return handleResponse(response);
    },
    
    /**
     * Download file
     */
    download: async (endpoint: string, filename: string) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('Download failed');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
};

/**
 * Authentication API
 */
export const authAPI = {
    login: (email: string, password: string) =>
        apiClient.post('/auth/login', { email, password }),
    
    register: (email: string, nama: string, password: string) =>
        apiClient.post('/auth/register', { email, nama, password }),
    
    getProfile: () =>
        apiClient.get('/auth/me'),
    
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }
};

/**
 * Products API (Gudang Module)
 */
export const productsAPI = {
    getAll: (params?: { page?: number; limit?: number; search?: string; category?: string }) =>
        apiClient.get('/products', params as Record<string, string>),
    
    getById: (id: string) =>
        apiClient.get(`/products/${id}`),
    
    create: (data: {
        name: string;
        description?: string;
        category: string;
        price: number;
        stock: number;
        min_stock?: number;
        unit?: string;
        permit_number?: string;
    }) => apiClient.post('/products', data),
    
    update: (id: string, data: any) =>
        apiClient.put(`/products/${id}`, data),
    
    delete: (id: string) =>
        apiClient.delete(`/products/${id}`),
    
    updateStock: (id: string, quantity: number, type: 'add' | 'subtract') =>
        apiClient.patch(`/products/${id}/stock`, { quantity, type }),
    
    getLowStock: () =>
        apiClient.get('/products/alerts/low-stock'),
    
    getBestSellers: () =>
        apiClient.get('/products/stats/best-sellers')
};

/**
 * Suppliers API (Pemasok Module) - Owner only
 */
export const suppliersAPI = {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
        apiClient.get('/suppliers', params as Record<string, string>),
    
    getById: (id: string) =>
        apiClient.get(`/suppliers/${id}`),
    
    create: (data: {
        name: string;
        contact_person?: string;
        phone: string;
        email?: string;
        address: string;
        city?: string;
        province?: string;
        postal_code?: string;
        notes?: string;
    }) => apiClient.post('/suppliers', data),
    
    update: (id: string, data: any) =>
        apiClient.put(`/suppliers/${id}`, data),
    
    delete: (id: string) =>
        apiClient.delete(`/suppliers/${id}`)
};

/**
 * Transactions API (Transaksi Module)
 */
export const transactionsAPI = {
    getAll: (params?: { 
        page?: number; 
        limit?: number; 
        startDate?: string; 
        endDate?: string;
        store_id?: string;
        payment_status?: string;
    }) => apiClient.get('/transactions', params as Record<string, string>),
    
    getById: (id: string) =>
        apiClient.get(`/transactions/${id}`),
    
    create: (data: {
        store_id?: string;
        customer_name?: string;
        customer_phone?: string;
        items: { product_id: string; quantity: number }[];
        discount?: number;
        tax?: number;
        payment_method?: string;
        notes?: string;
    }) => apiClient.post('/transactions', data),
    
    update: (id: string, data: any) =>
        apiClient.put(`/transactions/${id}`, data),
    
    delete: (id: string) =>
        apiClient.delete(`/transactions/${id}`),
    
    getDailySummary: (date?: string) =>
        apiClient.get('/transactions/summary/daily', date ? { date } : undefined),
    
    getMonthlySummary: (year?: number, month?: number) => {
        const params: Record<string, string> = {};
        if (year) params.year = year.toString();
        if (month) params.month = month.toString();
        return apiClient.get('/transactions/summary/monthly', params);
    }
};

/**
 * Stores API (Toko Module)
 */
export const storesAPI = {
    getAll: (params?: { page?: number; limit?: number; search?: string; city?: string }) =>
        apiClient.get('/stores', params as Record<string, string>),
    
    getById: (id: string) =>
        apiClient.get(`/stores/${id}`),
    
    create: (data: {
        name: string;
        category?: string;
        address: string;
        city?: string;
        province?: string;
        postal_code?: string;
        phone?: string;
        email?: string;
        owner_name?: string;
        operating_hours?: Record<string, { open: string; close: string }>;
        notes?: string;
    }) => apiClient.post('/stores', data),
    
    update: (id: string, data: any) =>
        apiClient.put(`/stores/${id}`, data),
    
    delete: (id: string) =>
        apiClient.delete(`/stores/${id}`)
};

/**
 * Employees API (Karyawan Module) - Owner only
 */
export const employeesAPI = {
    getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
        apiClient.get('/employees', params as Record<string, string>),
    
    getById: (id: string) =>
        apiClient.get(`/employees/${id}`),
    
    create: (data: {
        name: string;
        email: string;
        phone: string;
        position: string;
        address?: string;
        join_date?: string;
        salary?: number;
    }) => apiClient.post('/employees', data),
    
    update: (id: string, data: any) =>
        apiClient.put(`/employees/${id}`, data),
    
    delete: (id: string) =>
        apiClient.delete(`/employees/${id}`),
    
    resetPassword: (id: string) =>
        apiClient.post(`/employees/${id}/reset-password`, {})
};

/**
 * Reports API (Laporan Module)
 */
export const reportsAPI = {
    getSales: (params: { startDate: string; endDate: string; store_id?: string }) =>
        apiClient.get('/reports/sales', params as Record<string, string>),
    
    getInventory: () =>
        apiClient.get('/reports/inventory'),
    
    downloadSales: (startDate: string, endDate: string, format: 'xlsx' | 'pdf' = 'xlsx') => {
        const filename = `laporan-penjualan-${startDate}-${endDate}.${format}`;
        return apiClient.download(`/reports/download/sales?startDate=${startDate}&endDate=${endDate}&format=${format}`, filename);
    },
    
    downloadInventory: (format: 'xlsx' | 'pdf' = 'xlsx') => {
        const filename = `laporan-stok-${new Date().toISOString().split('T')[0]}.${format}`;
        return apiClient.download(`/reports/download/inventory?format=${format}`, filename);
    },
    
    downloadTransactions: (startDate: string, endDate: string, format: 'xlsx' | 'pdf' = 'xlsx') => {
        const filename = `laporan-transaksi-${startDate}-${endDate}.${format}`;
        return apiClient.download(`/reports/download/transactions?startDate=${startDate}&endDate=${endDate}&format=${format}`, filename);
    }
};

/**
 * Dashboard API (Beranda Module)
 */
export const dashboardAPI = {
    getSummary: async () => {
        const [dailySummary, monthlySummary, lowStock, bestSellers] = await Promise.all([
            transactionsAPI.getDailySummary(),
            transactionsAPI.getMonthlySummary(),
            productsAPI.getLowStock(),
            productsAPI.getBestSellers()
        ]);
        
        return {
            daily: dailySummary.data,
            monthly: monthlySummary.data,
            lowStock: lowStock.data,
            bestSellers: bestSellers.data
        };
    }
};

export default apiClient;
