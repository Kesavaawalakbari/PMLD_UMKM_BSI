/**
 * Transaction Model - Supabase Implementation (Transaksi Module)
 * KONEK - BSI UMKM Centre
 * 
 * Handles all transaction operations
 */

const { supabaseAdmin } = require('../config/database');

class Transaction {
    /**
     * Create a new transaction
     * @param {Object} transactionData - Transaction data
     * @returns {Promise<Object>} Created transaction
     */
    static async create(transactionData) {
        try {
            // Generate transaction number
            const transactionNumber = await this.generateTransactionNumber();

            const { data, error } = await supabaseAdmin
                .from('transactions')
                .insert({
                    transaction_number: transactionNumber,
                    store_id: transactionData.storeId,
                    customer_name: transactionData.customerName,
                    customer_phone: transactionData.customerPhone,
                    total_amount: transactionData.totalAmount,
                    discount: transactionData.discount || 0,
                    tax: transactionData.tax || 0,
                    final_amount: transactionData.finalAmount,
                    payment_method: transactionData.paymentMethod,
                    payment_status: transactionData.paymentStatus || 'pending',
                    notes: transactionData.notes,
                    created_by: transactionData.createdBy,
                    status: 'active'
                })
                .select()
                .single();

            if (error) throw error;

            // Create transaction items
            if (transactionData.items && transactionData.items.length > 0) {
                const items = transactionData.items.map(item => ({
                    transaction_id: data.id,
                    product_id: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.quantity * item.price
                }));

                const { error: itemsError } = await supabaseAdmin
                    .from('transaction_items')
                    .insert(items);

                if (itemsError) throw itemsError;
            }

            return data;
        } catch (error) {
            console.error('❌ Error creating transaction:', error);
            throw error;
        }
    }

    /**
     * Generate unique transaction number
     * @returns {Promise<String>} Transaction number
     */
    static async generateTransactionNumber() {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TRX-${dateStr}-${randomStr}`;
    }

    /**
     * Find transaction by ID
     * @param {String} id - Transaction ID
     * @returns {Promise<Object|null>} Transaction or null
     */
    static async findById(id) {
        try {
            const { data, error } = await supabaseAdmin
                .from('transactions')
                .select(`
                    *,
                    store:store_id(id, name),
                    items:transaction_items(
                        id,
                        quantity,
                        price,
                        subtotal,
                        product:product_id(id, name, sku)
                    )
                `)
                .eq('id', id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            console.error('❌ Error finding transaction:', error);
            throw error;
        }
    }

    /**
     * Get all transactions with optional filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Object>} Transactions list with pagination
     */
    static async findAll(filters = {}) {
        try {
            let query = supabaseAdmin
                .from('transactions')
                .select(`
                    *,
                    store:store_id(id, name)
                `, { count: 'exact' });

            // Apply filters
            if (filters.search) {
                query = query.or(`transaction_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`);
            }
            if (filters.storeId) {
                query = query.eq('store_id', filters.storeId);
            }
            if (filters.paymentStatus) {
                query = query.eq('payment_status', filters.paymentStatus);
            }
            if (filters.dateFrom) {
                query = query.gte('created_at', filters.dateFrom);
            }
            if (filters.dateTo) {
                query = query.lte('created_at', filters.dateTo);
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
            return { transactions: data || [], total: count || 0 };
        } catch (error) {
            console.error('❌ Error fetching transactions:', error);
            throw error;
        }
    }

    /**
     * Update transaction
     * @param {String} id - Transaction ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated transaction
     */
    static async update(id, updateData) {
        try {
            const { data, error } = await supabaseAdmin
                .from('transactions')
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
            console.error('❌ Error updating transaction:', error);
            throw error;
        }
    }

    /**
     * Delete transaction (soft delete)
     * @param {String} id - Transaction ID
     * @returns {Promise<Boolean>} Success status
     */
    static async delete(id) {
        try {
            const { error } = await supabaseAdmin
                .from('transactions')
                .update({ 
                    status: 'deleted',
                    deleted_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('❌ Error deleting transaction:', error);
            throw error;
        }
    }

    /**
     * Get daily summary
     * @param {Date} date - Date for summary
     * @returns {Promise<Object>} Daily summary
     */
    static async getDailySummary(date) {
        try {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            const { data, error } = await supabaseAdmin
                .from('transactions')
                .select('final_amount, payment_status')
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .eq('status', 'active');

            if (error) throw error;

            const summary = {
                totalTransactions: data?.length || 0,
                totalAmount: data?.reduce((sum, t) => sum + (t.final_amount || 0), 0) || 0,
                paidTransactions: data?.filter(t => t.payment_status === 'paid').length || 0,
                pendingTransactions: data?.filter(t => t.payment_status === 'pending').length || 0
            };

            return summary;
        } catch (error) {
            console.error('❌ Error getting daily summary:', error);
            throw error;
        }
    }

    /**
     * Get monthly summary
     * @param {Number} year - Year
     * @param {Number} month - Month (1-12)
     * @returns {Promise<Object>} Monthly summary
     */
    static async getMonthlySummary(year, month) {
        try {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);

            const { data, error } = await supabaseAdmin
                .from('transactions')
                .select('final_amount, payment_status, created_at')
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .eq('status', 'active');

            if (error) throw error;

            // Group by day
            const dailyData = {};
            data?.forEach(t => {
                const day = new Date(t.created_at).getDate();
                if (!dailyData[day]) {
                    dailyData[day] = { count: 0, amount: 0 };
                }
                dailyData[day].count++;
                dailyData[day].amount += t.final_amount || 0;
            });

            return {
                totalTransactions: data?.length || 0,
                totalAmount: data?.reduce((sum, t) => sum + (t.final_amount || 0), 0) || 0,
                paidTransactions: data?.filter(t => t.payment_status === 'paid').length || 0,
                dailyBreakdown: dailyData
            };
        } catch (error) {
            console.error('❌ Error getting monthly summary:', error);
            throw error;
        }
    }
}

module.exports = Transaction;
