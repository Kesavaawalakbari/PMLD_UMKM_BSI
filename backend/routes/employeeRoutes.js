/**
 * Employee Routes (Karyawan Module)
 * KONEK - BSI UMKM Centre
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const employeeController = require('../controllers/employeeController');
const { protect, restrictTo } = require('../middleware/auth');

// Validation rules
const employeeValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama karyawan wajib diisi')
        .isLength({ min: 2, max: 100 }).withMessage('Nama karyawan harus 2-100 karakter'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email wajib diisi')
        .isEmail().withMessage('Format email tidak valid'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Nomor telepon wajib diisi')
        .matches(/^[\d\-+() ]+$/).withMessage('Format nomor telepon tidak valid'),
    body('position')
        .trim()
        .notEmpty().withMessage('Posisi wajib diisi')
];

// All routes require authentication and Owner role
router.use(protect);
router.use(restrictTo('owner'));

// Employee routes
router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployee);
router.post('/', employeeValidation, employeeController.createEmployee);
router.put('/:id', employeeValidation, employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
