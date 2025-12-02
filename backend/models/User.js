/**
 * User Model - Supabase Implementation
 * BSI UMKM Centre
 * 
 * This module provides user operations using Supabase as the database.
 * Authentication is handled by Supabase Auth.
 */

const { supabaseAdmin } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * User Model Class
 * Provides static methods for user operations
 */
class User {
    /**
     * Create a new user
     * @param {Object} userData - User data (email, nama, password)
     * @returns {Promise<Object>} Created user
     */
    static async create({ email, nama, password }) {
        try {
            // Hash password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            // First, create auth user in Supabase Auth
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: email.toLowerCase(),
                password: password,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    nama: nama
                }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    const error = new Error('Email sudah terdaftar');
                    error.code = 11000;
                    throw error;
                }
                throw authError;
            }

            // Then create user profile in users table
            const { data: userData, error: dbError } = await supabaseAdmin
                .from('users')
                .insert({
                    id: authData.user.id,
                    email: email.toLowerCase(),
                    nama: nama,
                    password: hashedPassword,
                    role: 'user',
                    is_active: true,
                    registered_at: new Date().toISOString()
                })
                .select()
                .single();

            if (dbError) {
                // Rollback: delete auth user if profile creation fails
                await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
                throw dbError;
            }

            return new UserInstance(userData);
        } catch (error) {
            console.error('Create user error:', error);
            throw error;
        }
    }

    /**
     * Find user by email
     * @param {string} email - User email
     * @returns {Promise<Object|null>} User or null
     */
    static async findByEmail(email) {
        try {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('email', email.toLowerCase())
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            return data ? new UserInstance(data) : null;
        } catch (error) {
            console.error('Find by email error:', error);
            return null;
        }
    }

    /**
     * Find user by ID
     * @param {string} id - User ID
     * @returns {Promise<Object|null>} User or null
     */
    static async findById(id) {
        try {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            return data ? new UserInstance(data) : null;
        } catch (error) {
            console.error('Find by ID error:', error);
            return null;
        }
    }

    /**
     * Find one user with password (for login)
     * @param {Object} query - Query object
     * @returns {Promise<Object|null>} User with password
     */
    static async findOne(query) {
        try {
            let queryBuilder = supabaseAdmin.from('users').select('*');

            if (query.email) {
                queryBuilder = queryBuilder.eq('email', query.email.toLowerCase());
            }

            const { data, error } = await queryBuilder.single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            return data ? new UserInstance(data) : null;
        } catch (error) {
            console.error('Find one error:', error);
            return null;
        }
    }
}

/**
 * User Instance Class
 * Represents a single user with instance methods
 */
class UserInstance {
    constructor(data) {
        this.id = data.id;
        this._id = data.id; // Compatibility with existing code
        this.email = data.email;
        this.nama = data.nama;
        this.password = data.password;
        this.role = data.role || 'user';
        this.isActive = data.is_active !== false;
        this.lastLogin = data.last_login;
        this.registeredAt = data.registered_at || data.created_at;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    /**
     * Compare password for login
     * @param {string} candidatePassword - Password to compare
     * @returns {Promise<boolean>} Is password valid
     */
    async comparePassword(candidatePassword) {
        try {
            return await bcrypt.compare(candidatePassword, this.password);
        } catch (error) {
            console.error('Compare password error:', error);
            return false;
        }
    }

    /**
     * Update last login timestamp
     */
    async updateLastLogin() {
        try {
            await supabaseAdmin
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', this.id);
        } catch (error) {
            console.error('Update last login error:', error);
        }
    }

    /**
     * Get public profile (without sensitive data)
     * @returns {Object} Public profile
     */
    getPublicProfile() {
        return {
            id: this.id,
            email: this.email,
            nama: this.nama,
            role: this.role,
            isActive: this.isActive,
            registeredAt: this.registeredAt,
            lastLogin: this.lastLogin
        };
    }

    /**
     * Save/update user data
     * @param {Object} options - Save options
     */
    async save(options = {}) {
        try {
            const updateData = {
                nama: this.nama,
                role: this.role,
                is_active: this.isActive,
                updated_at: new Date().toISOString()
            };

            if (this.lastLogin) {
                updateData.last_login = this.lastLogin;
            }

            await supabaseAdmin
                .from('users')
                .update(updateData)
                .eq('id', this.id);
        } catch (error) {
            console.error('Save user error:', error);
            throw error;
        }
    }
}

// Add select method for compatibility
User.findOne = function(query) {
    const chainable = {
        _query: query,
        async select(fields) {
            const user = await User.findOne(this._query);
            return user;
        }
    };
    
    // Return promise that resolves to user
    return {
        select: async (fields) => {
            try {
                let queryBuilder = supabaseAdmin.from('users').select('*');
                
                if (query.email) {
                    queryBuilder = queryBuilder.eq('email', query.email.toLowerCase());
                }

                const { data, error } = await queryBuilder.single();

                if (error && error.code !== 'PGRST116') {
                    throw error;
                }

                return data ? new UserInstance(data) : null;
            } catch (error) {
                console.error('Find one with select error:', error);
                return null;
            }
        }
    };
};

module.exports = User;
