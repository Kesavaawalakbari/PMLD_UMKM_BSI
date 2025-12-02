/**
 * Supplier Model - Supabase Implementation (Pemasok Module)
 * KONEK - BSI UMKM Centre
 * 
 * Handles all supplier operations (Owner only)
 */

const { supabaseAdmin } = require('../config/database');

class Supplier {
    /**
     * Create a new supplier
     * @param {Object} supplierData - Supplier data
     * @returns {Promise<Object>} Created supplier
     */
    static async create(supplierData) {
        try {
            const { data, error } = await supabaseAdmin
                .from('suppliers')
                .insert({
                    name: supplierData.name,
                    contact_person: supplierData.contactPerson,
                    phone: supplierData.phone,
                    email: supplierData.email,
                    address: supplierData.address,
                    city: supplierData.city,
                    province: supplierData.province,
                    postal_code: supplierData.postalCode,
                    notes: supplierData.notes,
                    created_by: supplierData.createdBy,
                    is_active: true
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error creating supplier:', error);
            throw error;
        }
    }

    /**
     * Find supplier by ID
     * @param {String} id - Supplier ID
     * @returns {Promise<Object|null>} Supplier or null
     */
    static async findById(id) {
        try {
            const { data, error } = await supabaseAdmin
                .from('suppliers')
                .select('*')
                .eq('id', id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            console.error('❌ Error finding supplier:', error);
            throw error;
        }
    }

    /**
     * Get all suppliers with optional filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Object>} Suppliers list with pagination
     */
    static async findAll(filters = {}) {
        try {
            let query = supabaseAdmin
                .from('suppliers')
                .select('*', { count: 'exact' });

            // Apply filters
            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
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
            return { suppliers: data || [], total: count || 0 };
        } catch (error) {
            console.error('❌ Error fetching suppliers:', error);
            throw error;
        }
    }

    /**
     * Update supplier
     * @param {String} id - Supplier ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated supplier
     */
    static async update(id, updateData) {
        try {
            const { data, error } = await supabaseAdmin
                .from('suppliers')
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
            console.error('❌ Error updating supplier:', error);
            throw error;
        }
    }

    /**
     * Delete supplier (soft delete)
     * @param {String} id - Supplier ID
     * @returns {Promise<Boolean>} Success status
     */
    static async delete(id) {
        try {
            const { error } = await supabaseAdmin
                .from('suppliers')
                .update({ 
                    is_active: false,
                    deleted_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('❌ Error deleting supplier:', error);
            throw error;
        }
    }
}

module.exports = Supplier;
