/**
 * Employee Controller (Karyawan Module)
 * KONEK - BSI UMKM Centre
 */

const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/employees
 * @desc    Get all employees with pagination and filters
 * @access  Private (Owner only)
 */
exports.getEmployees = async (req, res) => {
    try {
        const { search, position, status, page, limit, sortBy, sortOrder } = req.query;
        
        const result = await Employee.findAll({
            search,
            position,
            status: status || 'active',
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sortBy,
            sortOrder
        });

        res.status(200).json({
            success: true,
            message: result.employees.length > 0 ? 'Berhasil mengambil data karyawan' : 'Data tidak tersedia',
            data: result.employees,
            pagination: {
                total: result.total,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                totalPages: Math.ceil(result.total / (parseInt(limit) || 10))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data karyawan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/employees/:id
 * @desc    Get employee by ID
 * @access  Private (Owner only)
 */
exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Karyawan tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data karyawan',
            data: employee
        });
    } catch (error) {
        console.error('❌ Error fetching employee:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data karyawan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   POST /api/employees
 * @desc    Create new employee
 * @access  Private (Owner only)
 */
exports.createEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak valid',
                errors: errors.array()
            });
        }

        const employeeData = {
            ...req.body,
            createdBy: req.userId
        };

        const employee = await Employee.create(employeeData);

        res.status(201).json({
            success: true,
            message: 'Karyawan berhasil ditambahkan',
            data: employee
        });
    } catch (error) {
        console.error('❌ Error creating employee:', error);
        
        // Check for duplicate email
        if (error.message?.includes('already registered')) {
            return res.status(400).json({
                success: false,
                message: 'Karyawan sudah terdaftar'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan karyawan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee
 * @access  Private (Owner only)
 */
exports.updateEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Data karyawan tidak valid',
                errors: errors.array()
            });
        }

        const existingEmployee = await Employee.findById(req.params.id);
        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Karyawan tidak ditemukan'
            });
        }

        const employee = await Employee.update(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Karyawan berhasil diperbarui',
            data: employee
        });
    } catch (error) {
        console.error('❌ Error updating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui karyawan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete employee (deactivate)
 * @access  Private (Owner only)
 */
exports.deleteEmployee = async (req, res) => {
    try {
        const existingEmployee = await Employee.findById(req.params.id);
        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Karyawan tidak ditemukan'
            });
        }

        await Employee.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Karyawan berhasil dihapus'
        });
    } catch (error) {
        console.error('❌ Error deleting employee:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus karyawan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
