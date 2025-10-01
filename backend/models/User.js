const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email wajib diisi'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Format email tidak valid'
        }
    },
    nama: {
        type: String,
        required: [true, 'Nama wajib diisi'],
        trim: true,
        minlength: [2, 'Nama minimal 2 karakter'],
        maxlength: [100, 'Nama maksimal 100 karakter']
    },
    password: {
        type: String,
        required: [true, 'Password wajib diisi'],
        minlength: [6, 'Password minimal 6 karakter'],
        select: false // Tidak akan diambil saat query default
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'Role harus berupa user atau admin'
        },
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Menambahkan createdAt dan updatedAt otomatis
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index untuk performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Middleware: Hash password sebelum save
userSchema.pre('save', async function(next) {
    // Hanya hash password jika field password dimodifikasi
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt dan hash password
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method: Compare password untuk login
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// Instance method: Update last login
userSchema.methods.updateLastLogin = async function() {
    this.lastLogin = new Date();
    await this.save({ validateBeforeSave: false });
};

// Instance method: Get public profile (tanpa password)
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        email: this.email,
        nama: this.nama,
        role: this.role,
        isActive: this.isActive,
        registeredAt: this.registeredAt,
        lastLogin: this.lastLogin
    };
};

// Static method: Find by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Virtual: Account age in days
userSchema.virtual('accountAge').get(function() {
    if (!this.registeredAt) return 0;
    const diffTime = Math.abs(new Date() - this.registeredAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
