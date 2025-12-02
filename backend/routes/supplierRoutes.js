/**
 * Supplier Routes (Pemasok Module)
 * KONEK - BSI UMKM Centre
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const supplierController = require('../controllers/supplierController');
const { protect, restrictTo } = require('../middleware/auth');

// Validation rules
const supplierValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama pemasok wajib diisi')
        .isLength({ min: 2, max: 200 }).withMessage('Nama pemasok harus 2-200 karakter'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Nomor telepon wajib diisi')
        .matches(/^[\d\-+() ]+$/).withMessage('Format nomor telepon tidak valid'),
    body('email')
        .optional()
        .isEmail().withMessage('Format email tidak valid'),
    body('address')
        .trim()
        .notEmpty().withMessage('Alamat wajib diisi')
];

// All routes require authentication and Owner role
router.use(protect);
router.use(restrictTo('owner'));

// Supplier routes
router.get('/', supplierController.getSuppliers);
router.get('/:id', supplierController.getSupplier);
router.post('/', supplierValidation, supplierController.createSupplier);
router.put('/:id', supplierValidation, supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
