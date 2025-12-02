/**
 * Transaction Routes (Transaksi Module)
 * KONEK - BSI UMKM Centre
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/auth');

// Validation rules
const transactionValidation = [
    body('storeId')
        .optional()
        .isUUID().withMessage('ID toko tidak valid'),
    body('totalAmount')
        .isNumeric().withMessage('Total harus berupa angka')
        .custom(val => val >= 0).withMessage('Total tidak boleh negatif'),
    body('finalAmount')
        .isNumeric().withMessage('Total akhir harus berupa angka')
        .custom(val => val >= 0).withMessage('Total akhir tidak boleh negatif'),
    body('items')
        .optional()
        .isArray().withMessage('Items harus berupa array'),
    body('items.*.productId')
        .optional()
        .isUUID().withMessage('ID produk tidak valid'),
    body('items.*.quantity')
        .optional()
        .isInt({ min: 1 }).withMessage('Kuantitas harus minimal 1')
];

// All routes require authentication
router.use(protect);

// Transaction routes
router.get('/', transactionController.getTransactions);
router.get('/summary/daily', transactionController.getDailySummary);
router.get('/summary/monthly', transactionController.getMonthlySummary);
router.get('/:id', transactionController.getTransaction);
router.post('/', transactionValidation, transactionController.createTransaction);

// Owner only routes
router.put('/:id', restrictTo('owner'), transactionValidation, transactionController.updateTransaction);
router.delete('/:id', restrictTo('owner'), transactionController.deleteTransaction);

module.exports = router;
