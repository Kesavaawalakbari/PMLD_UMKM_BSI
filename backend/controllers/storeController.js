/**
 * Store Controller (Toko Module)
 * KONEK - BSI UMKM Centre
 */

const Store = require('../models/Store');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/stores
 * @desc    Get all stores with pagination and filters
 * @access  Private (Owner/Karyawan)
 */
exports.getStores = async (req, res) => {
    try {
        const { search, category, city, page, limit, sortBy, sortOrder } = req.query;
        
        const result = await Store.findAll({
            search,
            category,
            city,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sortBy,
            sortOrder,
            isActive: true
        });

        res.status(200).json({
            success: true,
            message: result.stores.length > 0 ? 'Berhasil mengambil data toko' : 'Data tidak tersedia',
            data: result.stores,
            pagination: {
                total: result.total,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                totalPages: Math.ceil(result.total / (parseInt(limit) || 10))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching stores:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data toko',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/stores/:id
 * @desc    Get store by ID
 * @access  Private (Owner/Karyawan)
 */
exports.getStore = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Toko tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data toko',
            data: store
        });
    } catch (error) {
        console.error('❌ Error fetching store:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data toko',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   POST /api/stores
 * @desc    Create new store
 * @access  Private (Owner only)
 */
exports.createStore = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak valid',
                errors: errors.array()
            });
        }

        const storeData = {
            ...req.body,
            createdBy: req.userId
        };

        const store = await Store.create(storeData);

        res.status(201).json({
            success: true,
            message: 'Toko berhasil ditambahkan',
            data: store
        });
    } catch (error) {
        console.error('❌ Error creating store:', error);
        
        // Check for duplicate store
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: 'Toko sudah terdaftar'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan toko',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   PUT /api/stores/:id
 * @desc    Update store
 * @access  Private (Owner only)
 */
exports.updateStore = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Data toko tidak valid',
                errors: errors.array()
            });
        }

        const existingStore = await Store.findById(req.params.id);
        if (!existingStore) {
            return res.status(404).json({
                success: false,
                message: 'Toko tidak ditemukan'
            });
        }

        const store = await Store.update(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Toko berhasil diperbarui',
            data: store
        });
    } catch (error) {
        console.error('❌ Error updating store:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui toko',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   DELETE /api/stores/:id
 * @desc    Delete store
 * @access  Private (Owner only)
 */
exports.deleteStore = async (req, res) => {
    try {
        const existingStore = await Store.findById(req.params.id);
        if (!existingStore) {
            return res.status(404).json({
                success: false,
                message: 'Toko tidak ditemukan'
            });
        }

        await Store.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Toko berhasil dihapus'
        });
    } catch (error) {
        console.error('❌ Error deleting store:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus toko',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
