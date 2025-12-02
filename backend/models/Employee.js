/**
 * Employee Model - Supabase Implementation (Karyawan Module)
 * KONEK - BSI UMKM Centre
 * 
 * Handles all employee operations (Owner only)
 */

const { supabaseAdmin } = require('../config/database');
const bcrypt = require('bcryptjs');

class Employee {
    /**
     * Create a new employee
     * @param {Object} employeeData - Employee data
     * @returns {Promise<Object>} Created employee
     */
    static async create(employeeData) {
        try {
            // Hash default password
            const salt = await bcrypt.genSalt(12);
            const defaultPassword = employeeData.password || 'Karyawan123';
            const hashedPassword = await bcrypt.hash(defaultPassword, salt);

            // Create auth user
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: employeeData.email.toLowerCase(),
                password: defaultPassword,
                email_confirm: true,
                user_metadata: {
                    nama: employeeData.name,
                    role: 'karyawan'
                }
            });

            if (authError) throw authError;

            // Create employee record
            const { data, error } = await supabaseAdmin
                .from('employees')
                .insert({
                    user_id: authData.user.id,
                    name: employeeData.name,
                    email: employeeData.email.toLowerCase(),
                    phone: employeeData.phone,
                    position: employeeData.position,
                    address: employeeData.address,
                    join_date: employeeData.joinDate || new Date().toISOString().split('T')[0],
                    salary: employeeData.salary,
                    status: 'active',
                    created_by: employeeData.createdBy,
                    must_change_password: true
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error creating employee:', error);
            throw error;
        }
    }

    /**
     * Find employee by ID
     * @param {String} id - Employee ID
     * @returns {Promise<Object|null>} Employee or null
     */
    static async findById(id) {
        try {
            const { data, error } = await supabaseAdmin
                .from('employees')
                .select('*')
                .eq('id', id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            console.error('❌ Error finding employee:', error);
            throw error;
        }
    }

    /**
     * Find employee by user ID
     * @param {String} userId - User ID
     * @returns {Promise<Object|null>} Employee or null
     */
    static async findByUserId(userId) {
        try {
            const { data, error } = await supabaseAdmin
                .from('employees')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            console.error('❌ Error finding employee by user ID:', error);
            throw error;
        }
    }

    /**
     * Get all employees with optional filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Object>} Employees list with pagination
     */
    static async findAll(filters = {}) {
        try {
            let query = supabaseAdmin
                .from('employees')
                .select('*', { count: 'exact' });

            // Apply filters
            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
            }
            if (filters.position) {
                query = query.eq('position', filters.position);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
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
            return { employees: data || [], total: count || 0 };
        } catch (error) {
            console.error('❌ Error fetching employees:', error);
            throw error;
        }
    }

    /**
     * Update employee
     * @param {String} id - Employee ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated employee
     */
    static async update(id, updateData) {
        try {
            const { data, error } = await supabaseAdmin
                .from('employees')
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
            console.error('❌ Error updating employee:', error);
            throw error;
        }
    }

    /**
     * Delete employee (soft delete - deactivate)
     * @param {String} id - Employee ID
     * @returns {Promise<Boolean>} Success status
     */
    static async delete(id) {
        try {
            // Get employee to find user_id
            const employee = await this.findById(id);
            if (!employee) throw new Error('Employee not found');

            // Deactivate auth user
            if (employee.user_id) {
                await supabaseAdmin.auth.admin.updateUserById(employee.user_id, {
                    user_metadata: { status: 'inactive' }
                });
            }

            // Soft delete employee record
            const { error } = await supabaseAdmin
                .from('employees')
                .update({ 
                    status: 'inactive',
                    deleted_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('❌ Error deleting employee:', error);
            throw error;
        }
    }
}

module.exports = Employee;
