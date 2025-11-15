
import React, { useState } from 'react';
import { ChevronDownIcon, LeftArrowIcon, RightArrowIcon } from '../components/icons/Icons';
import { FinanceData } from '../types';
import ManualDisbursementModal from '../components/modals/ManualDisbursementModal';
import SuccessModal from '../components/modals/SuccessModal';
import addProductIcon from '../assets/img/addproduct.svg';

const mockFinanceData: FinanceData[] = [
    { id: 'B001', umkm: 'Basreng bakar by Hilni', totalProducts: 3, balance: 120000, disbursement: 120000, bank: 'Mandiri', accountNumber: '1020938091', date: '15/11/2025', status: 'Setuju' },
    { id: 'B002', umkm: 'Warung Seblak Teh Euis', totalProducts: 5, balance: 2500000, disbursement: 2000000, bank: 'BCA', accountNumber: '8887776665', date: '14/11/2025', status: 'Pending' },
    { id: 'B003', umkm: 'Kopi Senja Abadi', totalProducts: 2, balance: 750000, disbursement: 500000, bank: 'BRI', accountNumber: '1234567890', date: '13/11/2025', status: 'Setuju' },
    { id: 'B004', umkm: 'Bakso Pak Kumis', totalProducts: 4, balance: 1800000, disbursement: 1500000, bank: 'BNI', accountNumber: '9988776655', date: '12/11/2025', status: 'Rejected' },
    { id: 'B005', umkm: 'Gudeg Bu Tini', totalProducts: 6, balance: 3200000, disbursement: 2800000, bank: 'Mandiri', accountNumber: '5544332211', date: '11/11/2025', status: 'Setuju' },
    { id: 'B006', umkm: 'Sate Ayam Madura', totalProducts: 3, balance: 950000, disbursement: 800000, bank: 'BCA', accountNumber: '7766554433', date: '10/11/2025', status: 'Pending' }
];

const mockUmkmUsers: { [key: string]: { bank: string; accountNumber: string; totalIncome: number } } = {
    'Basreng bakar by Hilni': { bank: 'Mandiri', accountNumber: '1020938091', totalIncome: 120000 },
    'Warung Seblak Teh Euis': { bank: 'BCA', accountNumber: '8887776665', totalIncome: 2500000 },
    'Kopi Senja Abadi': { bank: 'BRI', accountNumber: '1234567890', totalIncome: 750000 },
    'Bakso Pak Kumis': { bank: 'BNI', accountNumber: '9988776655', totalIncome: 1800000 },
    'Gudeg Bu Tini': { bank: 'Mandiri', accountNumber: '5544332211', totalIncome: 3200000 },
    'Sate Ayam Madura': { bank: 'BCA', accountNumber: '7766554433', totalIncome: 950000 }
};

const ManageFinance: React.FC = () => {
    const [financeData, setFinanceData] = useState<FinanceData[]>(mockFinanceData);
    const [isManualModalOpen, setManualModalOpen] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5);

    // Calculate pagination
    const totalPages = Math.ceil(financeData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFinanceData = financeData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleAddDisbursement = (data: Omit<FinanceData, 'id' | 'totalProducts' | 'date' | 'status'>) => {
        const newEntry: FinanceData = {
            id: `B0${String(financeData.length + 10).padStart(2, '0')}`,
            umkm: data.umkm,
            totalProducts: 0,
            balance: data.balance,
            disbursement: data.disbursement,
            bank: data.bank,
            accountNumber: data.accountNumber,
            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            status: 'Setuju'
        };
        setFinanceData(prevData => [...prevData, newEntry]);
        setManualModalOpen(false);
        setSuccessModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="relative bg-gray-50 px-6 py-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Kelola Keuangan</h1>
                    </div>
                    <div className="text-sm text-gray-500">
                        <span className="text-gray-400">Dashboard</span> <span className="mx-1">/</span> <span className="text-orange-500 font-medium">Kelola Keuangan</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-6 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {/* Finance Header */}
                    <div className="px-8 py-6 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-6">
                                <h2 className="text-xl font-semibold text-gray-900">Request Pencairan Dana</h2>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => setManualModalOpen(true)} 
                                    className="bg-teal-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-teal-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                                >
                                    <img src={addProductIcon} alt="Add Manual Disbursement" className="w-5 h-5" />
                                    <span>Tambah Pencairan Manual</span>
                                </button>
                                <div className="relative">
                                    <button className="border border-gray-200 px-6 py-3 rounded-xl text-sm font-semibold flex items-center space-x-2 hover:bg-gray-50 transition-colors">
                                        <span>Request Pencairan Dana</span>
                                        <ChevronDownIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="px-8 py-6">
                        <div className="overflow-x-auto overflow-y-hidden">
                            <table className="w-full min-w-max">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-0 text-sm font-semibold text-gray-600 min-w-[100px]">ID Pencairan</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[180px]">UMKM</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[100px]">Total Produk</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[120px]">Saldo</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[120px]">Pencairan</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[100px]">Bank</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[120px]">Rekening</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[100px]">Tanggal</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[100px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentFinanceData.map((req) => (
                                        <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-25 transition-colors">
                                            <td className="py-6 px-0 font-semibold text-gray-900">{req.id}</td>
                                            <td className="py-6 px-6 font-medium text-gray-900">{req.umkm}</td>
                                            <td className="py-6 px-6 text-gray-600">{req.totalProducts}</td>
                                            <td className="py-6 px-6 font-semibold text-gray-900">Rp. {req.balance.toLocaleString('id-ID')}</td>
                                            <td className="py-6 px-6 font-semibold text-gray-900">Rp. {req.disbursement.toLocaleString('id-ID')}</td>
                                            <td className="py-6 px-6 text-gray-600">{req.bank}</td>
                                            <td className="py-6 px-6 text-gray-600">{req.accountNumber}</td>
                                            <td className="py-6 px-6 text-gray-600">{req.date}</td>
                                            <td className="py-6 px-6">
                                                <button className={`text-xs font-bold px-3 py-1 rounded-full ${
                                                    req.status === 'Setuju' ? 'bg-green-100 text-green-700' :
                                                    req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {req.status}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {Array.from({ length: itemsPerPage - currentFinanceData.length }, (_, i) => (
                                        <tr key={`empty-${i}`} className="border-b border-gray-50">
                                            <td className="py-6 px-0">&nbsp;</td>
                                            <td className="py-6 px-6">&nbsp;</td>
                                            <td className="py-6 px-6">&nbsp;</td>
                                            <td className="py-6 px-6">&nbsp;</td>
                                            <td className="py-6 px-6">&nbsp;</td>
                                            <td className="py-6 px-6">&nbsp;</td>
                                            <td className="py-6 px-6">&nbsp;</td>
                                            <td className="py-6 px-6">&nbsp;</td>
                                            <td className="py-6 px-6">&nbsp;</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-6 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">{startIndex + 1}-{Math.min(endIndex, financeData.length)}</span> of <span className="font-medium text-gray-700">{financeData.length}</span>
                            </p>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={handlePrevious}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                >
                                    <LeftArrowIcon className="w-5 h-5 text-gray-400" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    if (totalPages <= 5 || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-colors ${
                                                    currentPage === page 
                                                        ? 'text-white bg-orange-500' 
                                                        : 'hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                                        return <span key={page} className="px-2 py-2 text-gray-400">...</span>;
                                    }
                                    return null;
                                })}
                                <button 
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-50"
                                >
                                    <RightArrowIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ManualDisbursementModal
                isOpen={isManualModalOpen}
                onClose={() => setManualModalOpen(false)}
                onAddDisbursement={handleAddDisbursement}
                umkmUsers={mockUmkmUsers}
            />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title="Pencairan Dana Berhasil! 💸"
            >
                <p>Pencairan dana manual telah berhasil ditambahkan ke dalam daftar.</p>
                <p>Anda dapat melihat entri baru di tabel keuangan.</p>
            </SuccessModal>
        </div>
    );
};

export default ManageFinance;