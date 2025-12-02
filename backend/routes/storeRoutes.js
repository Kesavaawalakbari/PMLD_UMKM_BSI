/**
 * Store Routes (Toko Module)
 * KONEK - BSI UMKM Centre
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const storeController = require('../controllers/storeController');
const { protect, restrictTo } = require('../middleware/auth');

// Validation rules
const storeValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama toko wajib diisi')
        .isLength({ min: 2, max: 200 }).withMessage('Nama toko harus 2-200 karakter'),
    body('category')
        .trim()
        .notEmpty().withMessage('Kategori wajib diisi'),
    body('address')
        .trim()
        .notEmpty().withMessage('Alamat wajib diisi'),
    body('phone')
        .optional()
        .matches(/^[\d\-+() ]+$/).withMessage('Format nomor telepon tidak valid'),
    body('email')
        .optional()
        .isEmail().withMessage('Format email tidak valid')
];

// All routes require authentication
router.use(protect);

// Store routes - Read access for all authenticated users
router.get('/', storeController.getStores);
router.get('/:id', storeController.getStore);

// Owner only routes for create, update, delete
router.post('/', restrictTo('owner'), storeValidation, storeController.createStore);
router.put('/:id', restrictTo('owner'), storeValidation, storeController.updateStore);
router.delete('/:id', restrictTo('owner'), storeController.deleteStore);

module.exports = router;
