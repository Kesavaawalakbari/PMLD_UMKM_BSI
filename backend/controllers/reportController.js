/**
 * Report Controller (Laporan Module)
 * KONEK - BSI UMKM Centre
 */

const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const ExcelJS = require('exceljs');

/**
 * @route   GET /api/reports/daily
 * @desc    Get daily report
 * @access  Private (Owner only)
 */
exports.getDailyReport = async (req, res) => {
    try {
        const date = req.query.date ? new Date(req.query.date) : new Date();
        
        const transactionSummary = await Transaction.getDailySummary(date);
        const lowStockProducts = await Product.getLowStock();
        const bestSellers = await Product.getBestSellers(5);

        const report = {
            date: date.toISOString().split('T')[0],
            transactions: transactionSummary,
            lowStockAlerts: lowStockProducts.length,
            lowStockProducts: lowStockProducts.slice(0, 5),
            topProducts: bestSellers
        };

        res.status(200).json({
            success: true,
            message: transactionSummary.totalTransactions > 0 
                ? 'Berhasil mengambil laporan harian' 
                : 'Tidak ada data transaksi',
            data: report
        });
    } catch (error) {
        console.error('❌ Error fetching daily report:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil laporan harian',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/reports/monthly
 * @desc    Get monthly report
 * @access  Private (Owner only)
 */
exports.getMonthlyReport = async (req, res) => {
    try {
        const now = new Date();
        const year = parseInt(req.query.year) || now.getFullYear();
        const month = parseInt(req.query.month) || now.getMonth() + 1;

        const transactionSummary = await Transaction.getMonthlySummary(year, month);
        const bestSellers = await Product.getBestSellers(10);

        const report = {
            year,
            month,
            monthName: new Date(year, month - 1).toLocaleString('id-ID', { month: 'long' }),
            transactions: transactionSummary,
            topProducts: bestSellers
        };

        res.status(200).json({
            success: true,
            message: transactionSummary.totalTransactions > 0 
                ? 'Berhasil mengambil laporan bulanan' 
                : 'Tidak ada data transaksi',
            data: report
        });
    } catch (error) {
        console.error('❌ Error fetching monthly report:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil laporan bulanan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/reports/download/daily
 * @desc    Download daily report as Excel
 * @access  Private (Owner only)
 */
exports.downloadDailyReport = async (req, res) => {
    try {
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const dateStr = date.toISOString().split('T')[0];
        
        const transactionSummary = await Transaction.getDailySummary(date);
        
        // Get transactions for the day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const { transactions } = await Transaction.findAll({
            dateFrom: startDate.toISOString(),
            dateTo: endDate.toISOString(),
            limit: 1000
        });

        if (transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada data untuk diunduh'
            });
        }

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'KONEK - BSI UMKM Centre';
        workbook.created = new Date();

        // Summary sheet
        const summarySheet = workbook.addWorksheet('Ringkasan');
        summarySheet.columns = [
            { header: 'Metrik', key: 'metric', width: 30 },
            { header: 'Nilai', key: 'value', width: 20 }
        ];
        summarySheet.addRow({ metric: 'Tanggal', value: dateStr });
        summarySheet.addRow({ metric: 'Total Transaksi', value: transactionSummary.totalTransactions });
        summarySheet.addRow({ metric: 'Total Pendapatan', value: `Rp ${transactionSummary.totalAmount.toLocaleString('id-ID')}` });
        summarySheet.addRow({ metric: 'Transaksi Lunas', value: transactionSummary.paidTransactions });
        summarySheet.addRow({ metric: 'Transaksi Pending', value: transactionSummary.pendingTransactions });

        // Transactions sheet
        const transSheet = workbook.addWorksheet('Detail Transaksi');
        transSheet.columns = [
            { header: 'No. Transaksi', key: 'transaction_number', width: 25 },
            { header: 'Nama Pelanggan', key: 'customer_name', width: 25 },
            { header: 'Total', key: 'final_amount', width: 15 },
            { header: 'Status Pembayaran', key: 'payment_status', width: 18 },
            { header: 'Metode Pembayaran', key: 'payment_method', width: 18 },
            { header: 'Waktu', key: 'created_at', width: 20 }
        ];

        transactions.forEach(t => {
            transSheet.addRow({
                transaction_number: t.transaction_number,
                customer_name: t.customer_name || '-',
                final_amount: t.final_amount,
                payment_status: t.payment_status,
                payment_method: t.payment_method || '-',
                created_at: new Date(t.created_at).toLocaleString('id-ID')
            });
        });

        // Style headers
        [summarySheet, transSheet].forEach(sheet => {
            sheet.getRow(1).font = { bold: true };
            sheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF00A39D' }
            };
            sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        });

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Laporan_Harian_${dateStr}.xlsx`
        );

        // Write to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('❌ Error downloading daily report:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengunduh laporan harian',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/reports/download/monthly
 * @desc    Download monthly report as Excel
 * @access  Private (Owner only)
 */
exports.downloadMonthlyReport = async (req, res) => {
    try {
        const now = new Date();
        const year = parseInt(req.query.year) || now.getFullYear();
        const month = parseInt(req.query.month) || now.getMonth() + 1;
        
        const monthName = new Date(year, month - 1).toLocaleString('id-ID', { month: 'long' });
        const transactionSummary = await Transaction.getMonthlySummary(year, month);

        // Get all transactions for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const { transactions } = await Transaction.findAll({
            dateFrom: startDate.toISOString(),
            dateTo: endDate.toISOString(),
            limit: 10000
        });

        if (transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada data untuk diunduh'
            });
        }

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'KONEK - BSI UMKM Centre';
        workbook.created = new Date();

        // Summary sheet
        const summarySheet = workbook.addWorksheet('Ringkasan Bulanan');
        summarySheet.columns = [
            { header: 'Metrik', key: 'metric', width: 30 },
            { header: 'Nilai', key: 'value', width: 25 }
        ];
        summarySheet.addRow({ metric: 'Periode', value: `${monthName} ${year}` });
        summarySheet.addRow({ metric: 'Total Transaksi', value: transactionSummary.totalTransactions });
        summarySheet.addRow({ metric: 'Total Pendapatan', value: `Rp ${transactionSummary.totalAmount.toLocaleString('id-ID')}` });
        summarySheet.addRow({ metric: 'Transaksi Lunas', value: transactionSummary.paidTransactions });

        // Daily breakdown sheet
        const dailySheet = workbook.addWorksheet('Breakdown Harian');
        dailySheet.columns = [
            { header: 'Tanggal', key: 'date', width: 15 },
            { header: 'Jumlah Transaksi', key: 'count', width: 20 },
            { header: 'Total Pendapatan', key: 'amount', width: 25 }
        ];

        Object.entries(transactionSummary.dailyBreakdown || {}).forEach(([day, data]) => {
            dailySheet.addRow({
                date: `${day}/${month}/${year}`,
                count: data.count,
                amount: `Rp ${data.amount.toLocaleString('id-ID')}`
            });
        });

        // Transactions sheet
        const transSheet = workbook.addWorksheet('Detail Transaksi');
        transSheet.columns = [
            { header: 'No. Transaksi', key: 'transaction_number', width: 25 },
            { header: 'Tanggal', key: 'date', width: 15 },
            { header: 'Nama Pelanggan', key: 'customer_name', width: 25 },
            { header: 'Total', key: 'final_amount', width: 15 },
            { header: 'Status', key: 'payment_status', width: 15 }
        ];

        transactions.forEach(t => {
            transSheet.addRow({
                transaction_number: t.transaction_number,
                date: new Date(t.created_at).toLocaleDateString('id-ID'),
                customer_name: t.customer_name || '-',
                final_amount: t.final_amount,
                payment_status: t.payment_status
            });
        });

        // Style headers
        [summarySheet, dailySheet, transSheet].forEach(sheet => {
            sheet.getRow(1).font = { bold: true };
            sheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF00A39D' }
            };
            sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        });

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Laporan_Bulanan_${monthName}_${year}.xlsx`
        );

        // Write to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('❌ Error downloading monthly report:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengunduh laporan bulanan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/reports/dashboard
 * @desc    Get dashboard summary data
 * @access  Private (Owner/Karyawan)
 */
exports.getDashboardSummary = async (req, res) => {
    try {
        const today = new Date();
        
        // Get today's summary
        const dailySummary = await Transaction.getDailySummary(today);
        
        // Get this month's summary
        const monthlySummary = await Transaction.getMonthlySummary(
            today.getFullYear(),
            today.getMonth() + 1
        );

        // Get low stock products
        const lowStockProducts = await Product.getLowStock();
        
        // Get best sellers
        const bestSellers = await Product.getBestSellers(5);

        const dashboard = {
            today: {
                date: today.toISOString().split('T')[0],
                ...dailySummary
            },
            thisMonth: {
                year: today.getFullYear(),
                month: today.getMonth() + 1,
                monthName: today.toLocaleString('id-ID', { month: 'long' }),
                ...monthlySummary
            },
            alerts: {
                lowStock: lowStockProducts.length,
                lowStockProducts: lowStockProducts.slice(0, 5)
            },
            topProducts: bestSellers
        };

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data dashboard',
            data: dashboard
        });
    } catch (error) {
        console.error('❌ Error fetching dashboard summary:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dashboard',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
