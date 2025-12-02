/**
 * Supplier Controller (Pemasok Module)
 * KONEK - BSI UMKM Centre
 */

const Supplier = require('../models/Supplier');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/suppliers
 * @desc    Get all suppliers with pagination and filters
 * @access  Private (Owner only)
 */
exports.getSuppliers = async (req, res) => {
    try {
        const { search, city, page, limit, sortBy, sortOrder } = req.query;
        
        const result = await Supplier.findAll({
            search,
            city,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sortBy,
            sortOrder,
            isActive: true
        });

        res.status(200).json({
            success: true,
            message: result.suppliers.length > 0 ? 'Berhasil mengambil data pemasok' : 'Data tidak tersedia',
            data: result.suppliers,
            pagination: {
                total: result.total,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                totalPages: Math.ceil(result.total / (parseInt(limit) || 10))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching suppliers:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data pemasok',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/suppliers/:id
 * @desc    Get supplier by ID
 * @access  Private (Owner only)
 */
exports.getSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Pemasok tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data pemasok',
            data: supplier
        });
    } catch (error) {
        console.error('❌ Error fetching supplier:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data pemasok',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   POST /api/suppliers
 * @desc    Create new supplier
 * @access  Private (Owner only)
 */
exports.createSupplier = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal',
                errors: errors.array()
            });
        }

        const supplierData = {
            ...req.body,
            createdBy: req.userId
        };

        const supplier = await Supplier.create(supplierData);

        res.status(201).json({
            success: true,
            message: 'Pemasok berhasil ditambahkan',
            data: supplier
        });
    } catch (error) {
        console.error('❌ Error creating supplier:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan pemasok',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   PUT /api/suppliers/:id
 * @desc    Update supplier
 * @access  Private (Owner only)
 */
exports.updateSupplier = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Data pemasok tidak valid',
                errors: errors.array()
            });
        }

        const existingSupplier = await Supplier.findById(req.params.id);
        if (!existingSupplier) {
            return res.status(404).json({
                success: false,
                message: 'Pemasok tidak ditemukan'
            });
        }

        const supplier = await Supplier.update(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Pemasok berhasil diperbarui',
            data: supplier
        });
    } catch (error) {
        console.error('❌ Error updating supplier:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui pemasok',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   DELETE /api/suppliers/:id
 * @desc    Delete supplier
 * @access  Private (Owner only)
 */
exports.deleteSupplier = async (req, res) => {
    try {
        const existingSupplier = await Supplier.findById(req.params.id);
        if (!existingSupplier) {
            return res.status(404).json({
                success: false,
                message: 'Pemasok tidak ditemukan'
            });
        }

        await Supplier.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Pemasok berhasil dihapus'
        });
    } catch (error) {
        console.error('❌ Error deleting supplier:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus pemasok',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
