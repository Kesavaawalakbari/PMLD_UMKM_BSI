import React, { useState } from 'react';
import { SearchIcon, EyeIcon, DeleteIcon, LeftArrowIcon, RightArrowIcon } from '../components/icons/Icons';
import { UmkmData } from '../types';
import addProductIcon from '../assets/img/addproduct.svg';

const mockUmkmData: UmkmData[] = [
    { id: 'C001', name: 'Basreng bakar by Hilni', totalProducts: 3, contact: '0819282910', balance: 120000, bank: 'Mandiri', accountNumber: '1020938091'},
    { id: 'C002', name: 'Warung Seblak Teh Euis', totalProducts: 5, contact: '0856789123', balance: 2500000, bank: 'BCA', accountNumber: '8887776665'},
    { id: 'C003', name: 'Kopi Senja Abadi', totalProducts: 2, contact: '0812345678', balance: 750000, bank: 'BRI', accountNumber: '1234567890'},
    { id: 'C004', name: 'Bakso Pak Kumis', totalProducts: 4, contact: '0898765432', balance: 1800000, bank: 'BNI', accountNumber: '9988776655'},
    { id: 'C005', name: 'Gudeg Bu Tini', totalProducts: 6, contact: '0877654321', balance: 3200000, bank: 'Mandiri', accountNumber: '5544332211'},
    { id: 'C006', name: 'Sate Ayam Madura', totalProducts: 3, contact: '0823456789', balance: 950000, bank: 'BCA', accountNumber: '7766554433'}
];

const ManageUmkm: React.FC = () => {
    const [umkmData] = useState<UmkmData[]>(mockUmkmData);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5);
    const [selectedUser, setSelectedUser] = useState<UmkmData | null>(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Filter users based on search query
    const filteredUsers = umkmData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUmkmData = filteredUsers.slice(startIndex, endIndex);

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

    const handleViewDetails = (user: UmkmData) => {
        setSelectedUser(user);
        setDetailModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="relative bg-gray-50 px-6 py-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Kelola UMKM</h1>
                    </div>
                    <div className="text-sm text-gray-500">
                        <span className="text-gray-400">Dashboard</span> <span className="mx-1">/</span> <span className="text-orange-500 font-medium">Kelola UMKM</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-6 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {/* UMKM Header */}
                    <div className="px-8 py-6 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-6">
                                <h2 className="text-xl font-semibold text-gray-900">Pengguna UMKM</h2>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                        <SearchIcon className="h-5 w-5 text-gray-400" />
                                    </span>
                                    <input 
                                        type="text" 
                                        placeholder="Cari pengguna UMKM" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-80 pl-12 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="bg-teal-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-teal-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2">
                                    <img src={addProductIcon} alt="Add User" className="w-5 h-5" />
                                    <span>Tambah Pengguna Baru</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="px-8 py-6">
                        <div className="overflow-x-auto overflow-y-hidden">
                            <table className="w-full min-w-max">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-0 text-sm font-semibold text-gray-600 min-w-[100px]">Customer ID</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[200px]">Nama UMKM</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[120px]">Total Produk</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[120px]">Kontak</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[140px]">Saldo</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[100px]">Bank</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[140px]">Rekening</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[100px]">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUmkmData.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-25 transition-colors">
                                            <td className="py-6 px-0 font-semibold text-gray-900">{user.id}</td>
                                            <td className="py-6 px-6 font-medium text-gray-900">{user.name}</td>
                                            <td className="py-6 px-6 text-gray-600">{user.totalProducts} produk</td>
                                            <td className="py-6 px-6 text-gray-600">{user.contact}</td>
                                            <td className="py-6 px-6 font-semibold text-gray-900">Rp. {user.balance.toLocaleString('id-ID')}</td>
                                            <td className="py-6 px-6 text-gray-600">{user.bank}</td>
                                            <td className="py-6 px-6 text-gray-600">{user.accountNumber}</td>
                                            <td className="py-6 px-6">
                                                <div className="flex items-center space-x-2">
                                                    <button 
                                                        onClick={() => handleViewDetails(user)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
                                                    >
                                                        <EyeIcon className="w-4 h-4"/>
                                                    </button>
                                                    <button className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200">
                                                        <DeleteIcon className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {Array.from({ length: itemsPerPage - currentUmkmData.length }, (_, i) => (
                                        <tr key={`empty-${i}`} className="border-b border-gray-50">
                                            <td className="py-6 px-0">&nbsp;</td>
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
                                <span className="font-medium text-gray-700">{startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}</span> of <span className="font-medium text-gray-700">{filteredUsers.length}</span>
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

            {/* User Details Modal */}
            {isDetailModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="px-8 py-6 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">Detail Pengguna UMKM</h2>
                                <button 
                                    onClick={() => setDetailModalOpen(false)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="px-8 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Customer ID</label>
                                        <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                            <span className="text-gray-900 font-medium">{selectedUser.id}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Nama UMKM</label>
                                        <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                            <span className="text-gray-900 font-medium">{selectedUser.name}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Total Produk</label>
                                        <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                            <span className="text-gray-900">{selectedUser.totalProducts} produk</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Nomor Kontak</label>
                                        <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                            <span className="text-gray-900">{selectedUser.contact}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Saldo Saat Ini</label>
                                        <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                                            <span className="text-green-800 font-bold text-lg">Rp. {selectedUser.balance.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Bank</label>
                                        <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                            <span className="text-gray-900 font-medium">{selectedUser.bank}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Nomor Rekening</label>
                                        <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                            <span className="text-gray-900 font-mono">{selectedUser.accountNumber}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Status</label>
                                        <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                Aktif
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Bergabung sejak</p>
                                        <p className="text-gray-900 font-medium">15 November 2025</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Terakhir aktif</p>
                                        <p className="text-gray-900 font-medium">2 jam yang lalu</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex justify-end space-x-3">
                                <button 
                                    onClick={() => setDetailModalOpen(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Tutup
                                </button>
                                <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                    Kelola UMKM
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUmkm;
