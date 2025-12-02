/**
 * Product Model - Supabase Implementation (Gudang Module)
 * KONEK - BSI UMKM Centre
 * 
 * Handles all product/warehouse operations
 */

const { supabaseAdmin } = require('../config/database');

class Product {
    /**
     * Create a new product
     * @param {Object} productData - Product data
     * @returns {Promise<Object>} Created product
     */
    static async create(productData) {
        try {
            const { data, error } = await supabaseAdmin
                .from('products')
                .insert({
                    name: productData.name,
                    description: productData.description,
                    category: productData.category,
                    price: productData.price,
                    stock: productData.stock,
                    min_stock: productData.minStock || 10,
                    sku: productData.sku,
                    unit: productData.unit || 'pcs',
                    image_url: productData.imageUrl,
                    permit_number: productData.permitNumber,
                    umkm_id: productData.umkmId,
                    created_by: productData.createdBy,
                    is_active: true
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error creating product:', error);
            throw error;
        }
    }

    /**
     * Find product by ID
     * @param {String} id - Product ID
     * @returns {Promise<Object|null>} Product or null
     */
    static async findById(id) {
        try {
            const { data, error } = await supabaseAdmin
                .from('products')
                .select('*, umkm:umkm_id(id, name)')
                .eq('id', id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            console.error('❌ Error finding product:', error);
            throw error;
        }
    }

    /**
     * Get all products with optional filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Products list
     */
    static async findAll(filters = {}) {
        try {
            let query = supabaseAdmin
                .from('products')
                .select('*, umkm:umkm_id(id, name)', { count: 'exact' });

            // Apply filters
            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
            }
            if (filters.category) {
                query = query.eq('category', filters.category);
            }
            if (filters.umkmId) {
                query = query.eq('umkm_id', filters.umkmId);
            }
            if (filters.isActive !== undefined) {
                query = query.eq('is_active', filters.isActive);
            }
            if (filters.lowStock) {
                query = query.lte('stock', filters.minStock || 10);
            }

            // Pagination
            const page = filters.page || 1;
            const limit = filters.limit || 10;
            const offset = (page - 1) * limit;
            query = query.range(offset, offset + limit - 1);

            // Sorting
            const sortBy = filters.sortBy || 'created_at';
            const sortOrder = filters.sortOrder === 'asc' ? true : false;
            query = query.order(sortBy, { ascending: sortOrder });

            const { data, error, count } = await query;

            if (error) throw error;
            return { products: data || [], total: count || 0 };
        } catch (error) {
            console.error('❌ Error fetching products:', error);
            throw error;
        }
    }

    /**
     * Update product
     * @param {String} id - Product ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated product
     */
    static async update(id, updateData) {
        try {
            const { data, error } = await supabaseAdmin
                .from('products')
                .update({
                    ...updateData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error updating product:', error);
            throw error;
        }
    }

    /**
     * Delete product (soft delete)
     * @param {String} id - Product ID
     * @returns {Promise<Boolean>} Success status
     */
    static async delete(id) {
        try {
            const { error } = await supabaseAdmin
                .from('products')
                .update({ 
                    is_active: false,
                    deleted_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('❌ Error deleting product:', error);
            throw error;
        }
    }

    /**
     * Get low stock products (almost out of stock)
     * @returns {Promise<Array>} Low stock products
     */
    static async getLowStock() {
        try {
            const { data, error } = await supabaseAdmin
                .from('products')
                .select('*, umkm:umkm_id(id, name)')
                .eq('is_active', true)
                .lte('stock', 'min_stock')
                .order('stock', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('❌ Error fetching low stock products:', error);
            throw error;
        }
    }

    /**
     * Get best selling products
     * @param {Number} limit - Number of products
     * @returns {Promise<Array>} Best selling products
     */
    static async getBestSellers(limit = 10) {
        try {
            const { data, error } = await supabaseAdmin
                .from('products')
                .select('*, umkm:umkm_id(id, name)')
                .eq('is_active', true)
                .order('sold', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('❌ Error fetching best sellers:', error);
            throw error;
        }
    }

    /**
     * Update stock
     * @param {String} id - Product ID
     * @param {Number} quantity - Quantity to add/subtract
     * @param {String} operation - 'add' or 'subtract'
     * @returns {Promise<Object>} Updated product
     */
    static async updateStock(id, quantity, operation = 'subtract') {
        try {
            const product = await this.findById(id);
            if (!product) throw new Error('Product not found');

            let newStock;
            if (operation === 'add') {
                newStock = product.stock + quantity;
            } else {
                newStock = product.stock - quantity;
                if (newStock < 0) throw new Error('Insufficient stock');
            }

            const { data, error } = await supabaseAdmin
                .from('products')
                .update({ stock: newStock, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error updating stock:', error);
            throw error;
        }
    }
}

module.exports = Product;
