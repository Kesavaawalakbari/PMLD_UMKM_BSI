const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * Validation Rules
 */

// Validasi untuk registrasi
const registerValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email wajib diisi')
        .isEmail().withMessage('Format email tidak valid')
        .normalizeEmail()
        .isLength({ max: 100 }).withMessage('Email terlalu panjang'),
    
    body('nama')
        .trim()
        .notEmpty().withMessage('Nama wajib diisi')
        .isLength({ min: 2 }).withMessage('Nama minimal 2 karakter')
        .isLength({ max: 100 }).withMessage('Nama maksimal 100 karakter')
        .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Nama hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung'),
    
    body('password')
        .trim()
        .notEmpty().withMessage('Password wajib diisi')
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
        .isLength({ max: 50 }).withMessage('Password maksimal 50 karakter')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password harus mengandung kombinasi huruf besar, huruf kecil, atau angka'),
    
    body('confirmPassword')
        .trim()
        .notEmpty().withMessage('Konfirmasi password wajib diisi')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Konfirmasi password tidak sesuai dengan password');
            }
            return true;
        })
];

// Validasi untuk login
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email wajib diisi')
        .isEmail().withMessage('Format email tidak valid')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .notEmpty().withMessage('Password wajib diisi')
];

// Validasi untuk update profile
const updateProfileValidation = [
    body('nama')
        .trim()
        .notEmpty().withMessage('Nama wajib diisi')
        .isLength({ min: 2 }).withMessage('Nama minimal 2 karakter')
        .isLength({ max: 100 }).withMessage('Nama maksimal 100 karakter')
        .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Nama hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung')
];

/**
 * Routes
 */

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', registerValidation, authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, authController.login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private (requires authentication)
router.get('/profile', protect, authController.getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfileValidation, authController.updateProfile);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, authController.logout);

// @route   GET /api/auth/test
// @desc    Test authentication
// @access  Private
router.get('/test', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authentication test successful',
        user: req.user.getPublicProfile()
    });
});

// @route   GET /api/auth/admin/test
// @desc    Test admin access
// @access  Private (Admin only)
router.get('/admin/test', protect, restrictTo('admin'), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Admin access granted',
        user: req.user.getPublicProfile()
    });
});

module.exports = router;
