/**
 * Store Model - Supabase Implementation (Toko Module)
 * KONEK - BSI UMKM Centre
 * 
 * Handles all store operations
 */

const { supabaseAdmin } = require('../config/database');

class Store {
    /**
     * Create a new store
     * @param {Object} storeData - Store data
     * @returns {Promise<Object>} Created store
     */
    static async create(storeData) {
        try {
            const { data, error } = await supabaseAdmin
                .from('stores')
                .insert({
                    name: storeData.name,
                    category: storeData.category,
                    address: storeData.address,
                    city: storeData.city,
                    province: storeData.province,
                    postal_code: storeData.postalCode,
                    phone: storeData.phone,
                    email: storeData.email,
                    owner_name: storeData.ownerName,
                    operating_hours: storeData.operatingHours,
                    notes: storeData.notes,
                    created_by: storeData.createdBy,
                    is_active: true
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error creating store:', error);
            throw error;
        }
    }

    /**
     * Find store by ID
     * @param {String} id - Store ID
     * @returns {Promise<Object|null>} Store or null
     */
    static async findById(id) {
        try {
            const { data, error } = await supabaseAdmin
                .from('stores')
                .select('*')
                .eq('id', id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            console.error('❌ Error finding store:', error);
            throw error;
        }
    }

    /**
     * Check if store exists (for transaction validation)
     * @param {String} id - Store ID
     * @returns {Promise<Boolean>} Exists status
     */
    static async exists(id) {
        try {
            const { data, error } = await supabaseAdmin
                .from('stores')
                .select('id')
                .eq('id', id)
                .eq('is_active', true)
                .single();

            if (error && error.code === 'PGRST116') return false;
            if (error) throw error;
            return !!data;
        } catch (error) {
            console.error('❌ Error checking store:', error);
            throw error;
        }
    }

    /**
     * Get all stores with optional filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Object>} Stores list with pagination
     */
    static async findAll(filters = {}) {
        try {
            let query = supabaseAdmin
                .from('stores')
                .select('*', { count: 'exact' });

            // Apply filters
            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,address.ilike.%${filters.search}%,owner_name.ilike.%${filters.search}%`);
            }
            if (filters.category) {
                query = query.eq('category', filters.category);
            }
            if (filters.city) {
                query = query.eq('city', filters.city);
            }
            if (filters.isActive !== undefined) {
                query = query.eq('is_active', filters.isActive);
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
            return { stores: data || [], total: count || 0 };
        } catch (error) {
            console.error('❌ Error fetching stores:', error);
            throw error;
        }
    }

    /**
     * Update store
     * @param {String} id - Store ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated store
     */
    static async update(id, updateData) {
        try {
            const { data, error } = await supabaseAdmin
                .from('stores')
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
            console.error('❌ Error updating store:', error);
            throw error;
        }
    }

    /**
     * Delete store (soft delete)
     * @param {String} id - Store ID
     * @returns {Promise<Boolean>} Success status
     */
    static async delete(id) {
        try {
            const { error } = await supabaseAdmin
                .from('stores')
                .update({ 
                    is_active: false,
                    deleted_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('❌ Error deleting store:', error);
            throw error;
        }
    }
}

module.exports = Store;
