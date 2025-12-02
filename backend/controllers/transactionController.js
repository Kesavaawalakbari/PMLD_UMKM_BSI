/**
 * Transaction Controller (Transaksi Module)
 * KONEK - BSI UMKM Centre
 */

const Transaction = require('../models/Transaction');
const Store = require('../models/Store');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with pagination and filters
 * @access  Private (Owner/Karyawan)
 */
exports.getTransactions = async (req, res) => {
    try {
        const { search, storeId, paymentStatus, dateFrom, dateTo, page, limit, sortBy, sortOrder } = req.query;
        
        const result = await Transaction.findAll({
            search,
            storeId,
            paymentStatus,
            dateFrom,
            dateTo,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sortBy,
            sortOrder,
            status: 'active'
        });

        res.status(200).json({
            success: true,
            message: result.transactions.length > 0 ? 'Berhasil mengambil data transaksi' : 'Data tidak tersedia',
            data: result.transactions,
            pagination: {
                total: result.total,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                totalPages: Math.ceil(result.total / (parseInt(limit) || 10))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data transaksi',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by ID
 * @access  Private (Owner/Karyawan)
 */
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaksi tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data transaksi',
            data: transaction
        });
    } catch (error) {
        console.error('❌ Error fetching transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data transaksi',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   POST /api/transactions
 * @desc    Create new transaction
 * @access  Private (Owner/Karyawan)
 */
exports.createTransaction = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal',
                errors: errors.array()
            });
        }

        // Verify store exists
        if (req.body.storeId) {
            const storeExists = await Store.exists(req.body.storeId);
            if (!storeExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Toko belum terdaftar'
                });
            }
        }

        // Verify products and stock
        if (req.body.items && req.body.items.length > 0) {
            for (const item of req.body.items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(400).json({
                        success: false,
                        message: `Produk dengan ID ${item.productId} tidak ditemukan`
                    });
                }
                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Stok produk ${product.name} tidak mencukupi`
                    });
                }
            }
        }

        const transactionData = {
            ...req.body,
            createdBy: req.userId
        };

        const transaction = await Transaction.create(transactionData);

        // Update product stock
        if (req.body.items && req.body.items.length > 0) {
            for (const item of req.body.items) {
                await Product.updateStock(item.productId, item.quantity, 'subtract');
            }
        }

        res.status(201).json({
            success: true,
            message: 'Transaksi berhasil ditambahkan',
            data: transaction
        });
    } catch (error) {
        console.error('❌ Error creating transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan transaksi',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction
 * @access  Private (Owner only)
 */
exports.updateTransaction = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Data transaksi tidak valid',
                errors: errors.array()
            });
        }

        const existingTransaction = await Transaction.findById(req.params.id);
        if (!existingTransaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaksi tidak ditemukan'
            });
        }

        const transaction = await Transaction.update(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Transaksi berhasil diperbarui',
            data: transaction
        });
    } catch (error) {
        console.error('❌ Error updating transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui transaksi',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction
 * @access  Private (Owner only)
 */
exports.deleteTransaction = async (req, res) => {
    try {
        const existingTransaction = await Transaction.findById(req.params.id);
        if (!existingTransaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaksi tidak ditemukan'
            });
        }

        await Transaction.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Transaksi berhasil dihapus'
        });
    } catch (error) {
        console.error('❌ Error deleting transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus transaksi',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/transactions/summary/daily
 * @desc    Get daily transaction summary
 * @access  Private (Owner/Karyawan)
 */
exports.getDailySummary = async (req, res) => {
    try {
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const summary = await Transaction.getDailySummary(date);

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil ringkasan transaksi harian',
            data: summary
        });
    } catch (error) {
        console.error('❌ Error fetching daily summary:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil ringkasan transaksi harian',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/transactions/summary/monthly
 * @desc    Get monthly transaction summary
 * @access  Private (Owner/Karyawan)
 */
exports.getMonthlySummary = async (req, res) => {
    try {
        const now = new Date();
        const year = parseInt(req.query.year) || now.getFullYear();
        const month = parseInt(req.query.month) || now.getMonth() + 1;
        
        const summary = await Transaction.getMonthlySummary(year, month);

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil ringkasan transaksi bulanan',
            data: summary
        });
    } catch (error) {
        console.error('❌ Error fetching monthly summary:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil ringkasan transaksi bulanan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
