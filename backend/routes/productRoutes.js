/**
 * Product Routes (Gudang Module)
 * KONEK - BSI UMKM Centre
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// Validation rules
const productValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama produk wajib diisi')
        .isLength({ min: 2, max: 200 }).withMessage('Nama produk harus 2-200 karakter'),
    body('category')
        .trim()
        .notEmpty().withMessage('Kategori wajib diisi'),
    body('price')
        .isNumeric().withMessage('Harga harus berupa angka')
        .custom(val => val >= 0).withMessage('Harga tidak boleh negatif'),
    body('stock')
        .isInt({ min: 0 }).withMessage('Stok harus berupa angka positif')
];

// All routes require authentication
router.use(protect);

// Product routes
router.get('/', productController.getProducts);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/best-sellers', productController.getBestSellers);
router.get('/:id', productController.getProduct);
router.post('/', productValidation, productController.createProduct);
router.put('/:id', productValidation, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/stock', productController.updateStock);

module.exports = router;
