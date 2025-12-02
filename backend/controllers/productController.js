/**
 * Product Controller (Gudang Module)
 * KONEK - BSI UMKM Centre
 */

const Product = require('../models/Product');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filters
 * @access  Private (Owner/Karyawan)
 */
exports.getProducts = async (req, res) => {
    try {
        const { search, category, umkmId, page, limit, sortBy, sortOrder, lowStock } = req.query;
        
        const result = await Product.findAll({
            search,
            category,
            umkmId,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sortBy,
            sortOrder,
            lowStock: lowStock === 'true',
            isActive: true
        });

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data produk',
            data: result.products,
            pagination: {
                total: result.total,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                totalPages: Math.ceil(result.total / (parseInt(limit) || 10))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data produk',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Private (Owner/Karyawan)
 */
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data produk',
            data: product
        });
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data produk',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private (Owner/Karyawan)
 */
exports.createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal',
                errors: errors.array()
            });
        }

        const productData = {
            ...req.body,
            createdBy: req.userId
        };

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: 'Produk berhasil ditambahkan',
            data: product
        });
    } catch (error) {
        console.error('❌ Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan produk',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private (Owner/Karyawan)
 */
exports.updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Data produk tidak valid',
                errors: errors.array()
            });
        }

        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        const product = await Product.update(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Produk berhasil diperbarui',
            data: product
        });
    } catch (error) {
        console.error('❌ Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui produk',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private (Owner/Karyawan)
 */
exports.deleteProduct = async (req, res) => {
    try {
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        await Product.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Produk berhasil dihapus'
        });
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus produk',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/products/low-stock
 * @desc    Get products with low stock
 * @access  Private (Owner/Karyawan)
 */
exports.getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.getLowStock();

        res.status(200).json({
            success: true,
            message: products.length > 0 ? 'Produk hampir habis ditemukan' : 'Tidak ada produk hampir habis',
            data: products
        });
    } catch (error) {
        console.error('❌ Error fetching low stock products:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data produk hampir habis',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/products/best-sellers
 * @desc    Get best selling products
 * @access  Private (Owner/Karyawan)
 */
exports.getBestSellers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const products = await Product.getBestSellers(limit);

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil produk terlaris',
            data: products
        });
    } catch (error) {
        console.error('❌ Error fetching best sellers:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data produk terlaris',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Update product stock
 * @access  Private (Owner/Karyawan)
 */
exports.updateStock = async (req, res) => {
    try {
        const { quantity, operation } = req.body;

        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Kuantitas harus berupa angka positif'
            });
        }

        const product = await Product.updateStock(req.params.id, quantity, operation);

        res.status(200).json({
            success: true,
            message: 'Stok berhasil diperbarui',
            data: product
        });
    } catch (error) {
        console.error('❌ Error updating stock:', error);
        
        if (error.message === 'Insufficient stock') {
            return res.status(400).json({
                success: false,
                message: 'Stok tidak mencukupi'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui stok',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
