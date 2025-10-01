const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * Generate JWT Token
 * @param {String} userId - User ID
 * @returns {String} JWT Token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
            issuer: 'BSI-UMKM-Centre'
        }
    );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
exports.register = async (req, res) => {
    try {
        // Validasi input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Validasi gagal',
                errors: errors.array().map(err => ({
                    field: err.path || err.param,
                    message: err.msg
                }))
            });
        }

        const { email, nama, password } = req.body;

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
            });
        }

        // Buat user baru
        const user = await User.create({
            email,
            nama,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        // Update last login
        await user.updateLastLogin();

        // Log untuk monitoring
        console.log(`✅ New user registered: ${email}`);

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil! Selamat datang di BSI UMKM Centre.',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        
        // Handle duplicate key error (jika index unik gagal)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        // Validasi input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: 'Validasi gagal',
                errors: errors.array().map(err => ({
                    field: err.path || err.param,
                    message: err.msg
                }))
            });
        }

        const { email, password } = req.body;

        // Cari user by email dan include password field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah. Silakan coba lagi.'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Akun Anda tidak aktif. Silakan hubungi administrator.'
            });
        }

        // Verifikasi password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah. Silakan coba lagi.'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Update last login
        await user.updateLastLogin();

        // Log untuk monitoring
        console.log(`✅ User logged in: ${email}`);

        res.status(200).json({
            success: true,
            message: 'Login berhasil! Selamat datang kembali.',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat login. Silakan coba lagi.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private (requires authentication)
 */
exports.getProfile = async (req, res) => {
    try {
        // req.userId sudah di-set oleh middleware protect
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Akun Anda tidak aktif'
            });
        }

        res.status(200).json({
            success: true,
            data: { 
                user: user.getPublicProfile() 
            }
        });

    } catch (error) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil profil',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
    try {
        const { nama } = req.body;

        if (!nama || nama.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Nama harus diisi minimal 2 karakter'
            });
        }

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        user.nama = nama.trim();
        await user.save();

        console.log(`✅ Profile updated: ${user.email}`);

        res.status(200).json({
            success: true,
            message: 'Profile berhasil diupdate',
            data: { 
                user: user.getPublicProfile() 
            }
        });

    } catch (error) {
        console.error('❌ Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat update profil',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side should remove token)
 * @access  Private
 */
exports.logout = async (req, res) => {
    try {
        // Dalam JWT, logout biasanya dilakukan di client-side dengan menghapus token
        // Bisa juga implementasi token blacklist jika diperlukan
        
        res.status(200).json({
            success: true,
            message: 'Logout berhasil'
        });

    } catch (error) {
        console.error('❌ Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat logout'
        });
    }
};
