/**
 * Report Routes (Laporan Module)
 * KONEK - BSI UMKM Centre
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Dashboard summary - accessible by both Owner and Karyawan
router.get('/dashboard', reportController.getDashboardSummary);

// Reports - Owner only
router.get('/daily', restrictTo('owner'), reportController.getDailyReport);
router.get('/monthly', restrictTo('owner'), reportController.getMonthlyReport);
router.get('/download/daily', restrictTo('owner'), reportController.downloadDailyReport);
router.get('/download/monthly', restrictTo('owner'), reportController.downloadMonthlyReport);

module.exports = router;
