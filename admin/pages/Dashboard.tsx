import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, SearchIcon, DownloadIcon, SendIcon, DeleteIcon, DotsHorizontalIcon, LeftArrowIcon, RightArrowIcon } from '../components/icons/Icons';
import { TopProductData, InboxMessageData, SalesData } from '../types';
import DonutChart from '../components/DonutChart';
import { AnimatedStatCard, StatCardSkeleton } from '../components/AnimatedStatCard';

// Animation variants for stagger effects
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    },
};

const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.05,
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    }),
    hover: {
        backgroundColor: 'rgba(13, 148, 136, 0.05)',
        transition: { duration: 0.2 },
    },
};

// --- MOCK DATA (Will be replaced with Supabase) ---
const mockSales: SalesData[] = [
    { id: 'S001', userName: 'Andi', status: 'Selesai', productCount: 2, orderDate: '01/07/2024', receiptNumber: 'IDX1', price: 150000 },
    { id: 'S002', userName: 'Budi', status: 'Selesai', productCount: 1, orderDate: '03/07/2024', receiptNumber: 'IDX2', price: 75000 },
    { id: 'S003', userName: 'Citra', status: 'Selesai', productCount: 3, orderDate: '03/07/2024', receiptNumber: 'IDX3', price: 220000 },
    { id: 'S004', userName: 'Dewi', status: 'Selesai', productCount: 5, orderDate: '25/07/2024', receiptNumber: 'IDX4', price: 300000 },
    { id: 'S005', userName: 'Eka', status: 'Selesai', productCount: 2, orderDate: '25/07/2024', receiptNumber: 'IDX5', price: 125000 },
    { id: 'S006', userName: 'Fani', status: 'Selesai', productCount: 1, orderDate: '25/07/2024', receiptNumber: 'IDX6', price: 52000 },
    { id: 'S007', userName: 'Gita', status: 'Selesai', productCount: 4, orderDate: '15/06/2024', receiptNumber: 'IDX7', price: 400000 },
    { id: 'S008', userName: 'Hadi', status: 'Selesai', productCount: 2, orderDate: '20/06/2024', receiptNumber: 'IDX8', price: 180000 },
    { id: 'S009', userName: 'Test User', status: 'Selesai', productCount: 33, orderDate: '20/05/2024', receiptNumber: 'IDX9', price: 10777 },
];

// Stat Card Icons
const CalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const WalletIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z"/>
    </svg>
);

const TrendingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
    </svg>
);


const Calendar: React.FC<{
    onDateSelect: (date: Date) => void;
    onClose: () => void;
}> = ({ onDateSelect, onClose }) => {
    const [date, setDate] = useState(new Date());

    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const changeMonth = (amount: number) => {
        setDate(new Date(date.getFullYear(), date.getMonth() + amount, 1));
    };

    const handleDateClick = (day: number) => {
        const selected = new Date(date.getFullYear(), date.getMonth(), day);
        onDateSelect(selected);
        onClose();
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-full right-0 mt-2 bg-white p-4 rounded-lg shadow-2xl border z-20 w-72"
        >
            <div className="flex justify-between items-center mb-4">
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => changeMonth(-1)} 
                    className="p-1 rounded-full hover:bg-gray-100"
                >&lt;</motion.button>
                <div className="font-bold text-gray-700">{monthNames[date.getMonth()]} {date.getFullYear()}</div>
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => changeMonth(1)} 
                    className="p-1 rounded-full hover:bg-gray-100"
                >&gt;</motion.button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
            <motion.div 
                className="grid grid-cols-7 gap-1 mt-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    return (
                        <motion.button 
                            key={day}
                            variants={itemVariants}
                            whileHover={{ scale: 1.15, backgroundColor: 'rgba(13, 148, 136, 0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDateClick(day)}
                            className="p-2 text-sm text-center rounded-full hover:bg-teal-100"
                        >
                            {day}
                        </motion.button>
                    );
                })}
            </motion.div>
        </motion.div>
    );
};


const mockTopProducts: TopProductData[] = [
    { name: 'Batik Tulis Yogya', image: 'https://picsum.photos/seed/batik1/40/40', category: 'Fashion', price: 450000, clicks: 156 },
    { name: 'Kerajinan Perak', image: 'https://picsum.photos/seed/perak1/40/40', category: 'Aksesoris', price: 275000, clicks: 98 },
    { name: 'Kopi Arabika Merapi', image: 'https://picsum.photos/seed/kopi1/40/40', category: 'Makanan', price: 85000, clicks: 72 },
];

const mockInboxMessages: InboxMessageData[] = [
    { id: '1', sender: 'Dewi Sartika', subject: 'Pertanyaan tentang pembayaran cicilan', date: '17 Jan, 2025', read: false, starred: false },
    { id: '2', sender: 'Ahmad Yani', subject: 'Kendala pengajuan pinjaman modal', date: '16 Jan, 2025', read: false, starred: false },
    { id: '3', sender: 'Sri Mulyani', subject: 'Update status verifikasi UMKM', date: '15 Jan, 2025', read: true, starred: false },
    { id: '4', sender: 'Budi Santoso', subject: 'Konfirmasi jadwal pelatihan bisnis', date: '14 Jan, 2025', read: true, starred: true },
    { id: '5', sender: 'Rina Wijaya', subject: 'Request laporan penjualan bulanan', date: '13 Jan, 2025', read: true, starred: false },
];

const visitorData = [
    { name: 'Desktop', value: 65, color: '#0d9488' }, // teal-600
    { name: 'Mobile', value: 45, color: '#f97316' }, // orange-500
    { name: 'Tablet', value: 34, color: '#2dd4bf' }, // teal-400
    { name: 'Lainnya', value: 12, color: '#f59e0b' }  // amber-500
];

const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
};

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'incoming' | 'done'>('incoming');
    const [selectedDate, setSelectedDate] = useState(new Date()); // Use current date
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const calendarContainerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: { revenue: 0, orders: 0 },
        month: { revenue: 0, orders: 0 },
        day: { revenue: 0, orders: 0 },
    });

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const isSameDay = (d1: Date, d2: Date) =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();

        // Day stats
        const dayFilteredSales = mockSales.filter(sale => isSameDay(parseDate(sale.orderDate), selectedDate));
        const dayRevenue = dayFilteredSales.reduce((sum, sale) => sum + sale.price, 0);
        const dayOrders = dayFilteredSales.reduce((sum, sale) => sum + sale.productCount, 0);

        // Month stats
        const monthFilteredSales = mockSales.filter(sale => {
            const saleDate = parseDate(sale.orderDate);
            return saleDate.getFullYear() === selectedDate.getFullYear() && saleDate.getMonth() === selectedDate.getMonth();
        });
        const monthRevenue = monthFilteredSales.reduce((sum, sale) => sum + sale.price, 0);
        const monthOrders = monthFilteredSales.reduce((sum, sale) => sum + sale.productCount, 0);

        // Total stats
        const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.price, 0);
        const totalOrders = mockSales.reduce((sum, sale) => sum + sale.productCount, 0);
        
        setStats({
            total: { revenue: totalRevenue, orders: totalOrders },
            month: { revenue: monthRevenue, orders: monthOrders },
            day: { revenue: dayRevenue, orders: dayOrders },
        });

    }, [selectedDate]);
    
     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarContainerRef.current && !calendarContainerRef.current.contains(event.target as Node)) {
                setCalendarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header Cards */}
            <div className="relative" ref={calendarContainerRef}>
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {isLoading ? (
                        <>
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </>
                    ) : (
                        <>
                            <AnimatedStatCard 
                                title="Total Saldo Midtrans" 
                                value={stats.total.revenue}
                                percentageChange={12.5}
                                isPositive={true}
                                icon={<WalletIcon />}
                                iconBgColor="#0d9488"
                                formatAsCurrency={true}
                                delay={0}
                            />
                            <AnimatedStatCard 
                                title={`Pendapatan Bulan ${selectedDate.toLocaleString('id-ID', { month: 'long' })}`}
                                value={stats.month.revenue}
                                percentageChange={8.3}
                                isPositive={true}
                                icon={<CalendarIcon />}
                                iconBgColor="#f97316"
                                formatAsCurrency={true}
                                delay={0.1}
                            />
                            <AnimatedStatCard 
                                title={`Pendapatan ${selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`}
                                value={stats.day.revenue}
                                percentageChange={-2.1}
                                isPositive={false}
                                icon={<TrendingIcon />}
                                iconBgColor="#10b981"
                                formatAsCurrency={true}
                                delay={0.2}
                            />
                        </>
                    )}
                </motion.div>
                <AnimatePresence>
                    {isCalendarOpen && <Calendar onDateSelect={setSelectedDate} onClose={() => setCalendarOpen(false)} />}
                </AnimatePresence>
            </div>

            {/* Analytics and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <motion.div 
                    className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
                    whileHover={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Analitik Pengunjung</h3>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-sm text-gray-600 border rounded-md px-3 py-1 flex items-center"
                        >
                            Bulanan <ChevronDownIcon className="w-4 h-4 ml-2" />
                        </motion.button>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <DonutChart data={visitorData} visitors={2548} />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, type: 'spring' }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12 bg-white px-3 py-1 text-xs font-semibold text-green-600 border border-green-200 rounded-full"
                            >
                                +20.93%
                            </motion.div>
                        </div>
                        <motion.div 
                            className="grid grid-cols-2 gap-x-8 gap-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {visitorData.map((item) => (
                                <motion.div 
                                    key={item.name} 
                                    className="flex items-center"
                                    variants={itemVariants}
                                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                    <motion.div 
                                        className="w-3 h-3 rounded-full mr-3" 
                                        style={{ backgroundColor: item.color }}
                                        whileHover={{ scale: 1.5 }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.value}%</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
                <motion.div 
                    className="bg-white p-6 rounded-lg shadow-md"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.4 }}
                    whileHover={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Produk Paling Diminati</h3>
                    <div className="text-xs text-gray-400 uppercase grid grid-cols-4 gap-2 mb-2 px-2">
                        <span>Nama Produk</span>
                        <span>Kategori</span>
                        <span>Harga</span>
                        <span className="text-right">Klik</span>
                    </div>
                    <motion.div 
                        className="space-y-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {mockTopProducts.map((product, index) => (
                            <motion.div 
                                key={index} 
                                className="grid grid-cols-4 gap-2 items-center text-sm p-2 rounded-md cursor-pointer"
                                custom={index}
                                variants={tableRowVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                            >
                                <div className="flex items-center space-x-2">
                                    <motion.img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-8 h-8 rounded-md object-cover"
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                    />
                                    <span className="text-gray-800 font-medium truncate">{product.name}</span>
                                </div>
                                <span className="text-gray-500">{product.category}</span>
                                <span className="text-gray-800 font-medium">Rp {product.price.toLocaleString('id-ID')}</span>
                                <span className="text-gray-500 text-right">{product.clicks}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.button 
                        whileHover={{ scale: 1.02, backgroundColor: '#0d9488' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-teal-500 text-white mt-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Kelola Produk
                    </motion.button>
                </motion.div>
            </div>

            {/* Bantuan Pengguna */}
            <motion.div 
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
            >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                         <div className="flex border border-gray-200 rounded-lg p-0.5">
                            <motion.button 
                                onClick={() => setActiveTab('incoming')} 
                                className={`px-4 py-1.5 rounded-md text-sm font-medium ${activeTab === 'incoming' ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Pertanyaan Masuk
                            </motion.button>
                            <motion.button 
                                onClick={() => setActiveTab('done')} 
                                className={`px-4 py-1.5 rounded-md text-sm font-medium ${activeTab === 'done' ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Selesai
                            </motion.button>
                         </div>
                         <div className="flex items-center space-x-1 text-gray-500">
                             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-100 rounded-md"><DownloadIcon className="w-5 h-5"/></motion.button>
                             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-100 rounded-md"><SendIcon className="w-5 h-5"/></motion.button>
                             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-100 rounded-md"><DeleteIcon className="w-5 h-5"/></motion.button>
                             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-100 rounded-md"><DotsHorizontalIcon className="w-5 h-5"/></motion.button>
                         </div>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon className="h-4 w-4 text-gray-400" />
                        </span>
                        <input type="text" placeholder="Cari pengguna, email, alamat..." className="w-full md:w-64 pl-9 pr-4 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-500"/>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 w-12"><input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" /></th>
                                <th className="px-4 py-3 font-medium text-gray-500">Pengirim</th>
                                <th className="px-4 py-3 font-medium text-gray-500">Subjek</th>
                                <th className="px-4 py-3 font-medium text-gray-500 text-right">Tanggal</th>
                            </tr>
                        </thead>
                        <motion.tbody
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {mockInboxMessages.map((msg, index) => (
                                <motion.tr 
                                    key={msg.id} 
                                    className={`border-b cursor-pointer ${!msg.read ? 'font-semibold text-gray-800' : 'text-gray-500'}`}
                                    custom={index}
                                    variants={tableRowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                >
                                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" /></td>
                                    <td className="px-4 py-3">{msg.sender}</td>
                                    <td className="px-4 py-3">{msg.subject}</td>
                                    <td className="px-4 py-3 text-right">{msg.date}</td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
                    <p>Menampilkan <span className="font-semibold text-gray-700">1-5</span> dari <span className="font-semibold text-gray-700">29</span></p>
                    <div className="flex items-center space-x-1">
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" 
                            disabled
                        >
                            <LeftArrowIcon className="w-5 h-5" />
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 rounded-md text-white bg-teal-600"
                        >1</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1 rounded-md hover:bg-gray-100">2</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1 rounded-md hover:bg-gray-100">3</motion.button>
                        <span className="px-2 py-1">...</span>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1 rounded-md hover:bg-gray-100">8</motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-md hover:bg-gray-100"
                        >
                            <RightArrowIcon className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;