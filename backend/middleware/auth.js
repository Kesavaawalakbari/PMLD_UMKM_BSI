const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware untuk proteksi route yang memerlukan authentication
 * Verifikasi JWT token dari header Authorization
 */
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Ambil token dari header Authorization
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Format: "Bearer TOKEN_STRING"
            token = req.headers.authorization.split(' ')[1];
        }

        // Cek apakah token ada
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Anda belum login. Silakan login terlebih dahulu untuk mengakses resource ini.'
            });
        }

        try {
            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Cek apakah user masih ada di database
            const user = await User.findById(decoded.userId);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User dengan token ini tidak ditemukan. Silakan login kembali.'
                });
            }

            // Cek apakah akun masih aktif
            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Akun Anda tidak aktif. Silakan hubungi administrator.'
                });
            }

            // Set user info ke request object untuk digunakan di controller
            req.userId = decoded.userId;
            req.user = user;

            next();

        } catch (jwtError) {
            // Handle berbagai jenis JWT errors
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token Anda sudah kadaluarsa. Silakan login kembali.',
                    expiredAt: jwtError.expiredAt
                });
            }

            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token tidak valid. Silakan login kembali.'
                });
            }

            throw jwtError; // Re-throw jika error lain
        }

    } catch (error) {
        console.error('❌ Authentication middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication gagal. Silakan login kembali.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Middleware untuk membatasi akses berdasarkan role
 * Harus dipanggil setelah middleware protect
 * @param  {...string} roles - Role yang diizinkan (contoh: 'admin', 'user')
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user sudah di-set oleh middleware protect
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Anda harus login terlebih dahulu'
            });
        }

        // Cek apakah role user ada dalam daftar role yang diizinkan
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki permission untuk mengakses resource ini'
            });
        }

        next();
    };
};

/**
 * Middleware optional authentication
 * Tidak akan return error jika tidak ada token, hanya set req.user jika ada
 */
exports.optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            // Tidak ada token, lanjutkan tanpa set user
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            
            if (user && user.isActive) {
                req.userId = decoded.userId;
                req.user = user;
            }
        } catch (jwtError) {
            // Ignore JWT errors untuk optional auth
            console.log('Optional auth: Invalid or expired token');
        }

        next();

    } catch (error) {
        console.error('❌ Optional auth middleware error:', error);
        next(); // Continue anyway
    }
};
