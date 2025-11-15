import React, { useState, useEffect } from 'react';
import { SearchIcon, EditIcon, DeleteIcon, LeftArrowIcon, RightArrowIcon } from '../components/icons/Icons';
import { ProductData } from '../types';
import AddProductModal from '../components/modals/AddProductModal';
import EditProductModal from '../components/modals/EditProductModal';
import { useToast } from '../context/ToastContext';
import SuccessModal from '../components/modals/SuccessModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import addProductIcon from '../assets/img/addproduct.svg';

const mockProductData: ProductData[] = [
    { 
        id: 'A001', 
        name: 'Basreng Turbo 4 silinder', 
        image: 'https://picsum.photos/seed/basreng/40/40', 
        category: 'FnB', 
        umkm: 'Basreng goreng...', 
        price: 10000, 
        sold: 22, 
        stock: 100,
        permitNumber: 'P-IRT 2063204012345-25',
        description: 'Basreng pedas dengan bumbu rahasia, dijamin ketagihan!',
        variations: [
            { name: 'Original', price: 10000, stock: 50 },
            { name: 'Pedas Daun Jeruk', price: 12000, stock: 50 }
        ]
    },
    // Add more mock data if needed
];

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const { addToast } = useToast();
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        setProducts(mockProductData);
        setLoading(false);
    }, 1500);
  }, []);

  const handleEditClick = (product: ProductData) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleAddProduct = (newProductData: Omit<ProductData, 'id' | 'sold' | 'image'>) => {
    const newProduct: ProductData = {
      ...newProductData,
      id: `A${String(products.length + 1).padStart(3, '0')}`,
      sold: 0,
      image: `https://picsum.photos/seed/${Math.random()}/40/40`,
    };
    setProducts([...products, newProduct]);
    setAddModalOpen(false);
    setSuccessModalOpen(true);
  };

  const handleUpdateProduct = (updatedProduct: ProductData) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditModalOpen(false);
    setSelectedProduct(null);
    setSuccessModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
      addToast('Produk berhasil dihapus!', 'error');
      setProductToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const calculateTotalStock = (product: ProductData) => {
    const mainStock = product.stock || 0;
    const variationStock = product.variations.reduce((acc, v) => acc + v.stock, 0);
    return mainStock + variationStock;
  }

  const renderTableContent = () => {
    const emptyRows = itemsPerPage - currentProducts.length;
    
    if (loading) {
      return (
        <>
          <tr>
            <td colSpan={7} className="text-center py-10">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-3 text-gray-500">Memuat produk...</span>
              </div>
            </td>
          </tr>
          {Array.from({ length: itemsPerPage - 1 }, (_, i) => (
            <tr key={`loading-${i}`} className="border-b border-gray-50">
              <td className="py-6 px-0">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
            </tr>
          ))}
        </>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <>
          <tr>
            <td colSpan={7} className="text-center py-10 text-gray-500">
              {searchQuery ? `Tidak ada produk dengan nama "${searchQuery}" yang ditemukan.` : 'Tidak ada produk yang ditemukan.'}
            </td>
          </tr>
          {Array.from({ length: itemsPerPage - 1 }, (_, i) => (
            <tr key={`empty-${i}`} className="border-b border-gray-50">
              <td className="py-6 px-0">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
              <td className="py-6 px-6">&nbsp;</td>
            </tr>
          ))}
        </>
      );
    }

    return (
      <>
        {currentProducts.map((product) => (
          <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-25 transition-colors">
            <td className="py-6 px-0 font-semibold text-gray-900">{product.id}</td>
            <td className="py-6 px-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-8 h-8 rounded-lg object-cover" />
                </div>
                <span className="font-medium text-gray-900">{product.name}</span>
              </div>
            </td>
            <td className="py-6 px-6 text-gray-600">{product.category}</td>
            <td className="py-6 px-6 font-semibold text-gray-900">Rp. {product.price.toLocaleString('id-ID')}</td>
            <td className="py-6 px-6 text-gray-600">{product.sold}</td>
            <td className="py-6 px-6 text-gray-600">{calculateTotalStock(product)}</td>
            <td className="py-6 px-6">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEditClick(product)} 
                  className="p-2 rounded-lg text-gray-400 hover:text-teal-500 hover:bg-teal-50 transition-all duration-200"
                >
                  <EditIcon className="w-5 h-5"/>
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)} 
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <DeleteIcon className="w-5 h-5"/>
                </button>
              </div>
            </td>
          </tr>
        ))}
        {Array.from({ length: emptyRows }, (_, i) => (
          <tr key={`empty-${i}`} className="border-b border-gray-50">
            <td className="py-6 px-0">&nbsp;</td>
            <td className="py-6 px-6">&nbsp;</td>
            <td className="py-6 px-6">&nbsp;</td>
            <td className="py-6 px-6">&nbsp;</td>
            <td className="py-6 px-6">&nbsp;</td>
            <td className="py-6 px-6">&nbsp;</td>
            <td className="py-6 px-6">&nbsp;</td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gray-50 px-6 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Produk</h1>
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-gray-400">Dashboard</span> <span className="mx-1">/</span> <span className="text-orange-500 font-medium">Kelola Produk</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Products Header */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <h2 className="text-xl font-semibold text-gray-900">Semua Produk</h2>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Cari produk" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-80 pl-12 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setAddModalOpen(true)}
                  className="bg-teal-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-teal-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                >
                  <img src={addProductIcon} alt="Add Product" className="w-5 h-5" />
                  <span>Tambah Produk Baru</span>
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
                    <th className="text-left py-4 px-0 text-sm font-semibold text-gray-600 min-w-[80px]">ID Produk</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[200px]">Nama Produk</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[120px]">Kategori</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[120px]">Harga</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[80px]">Terjual</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[80px]">Stok</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 min-w-[100px]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableContent()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-8 py-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}</span> of <span className="font-medium text-gray-700">{filteredProducts.length}</span>
              </p>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handlePrevious}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors" 
                  disabled={currentPage === 1}
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
                  className="px-4 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-50"
                  disabled={currentPage === totalPages}
                >
                  <RightArrowIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAddProduct={handleAddProduct} />
      {selectedProduct && <EditProductModal isOpen={isEditModalOpen} onClose={() => { setEditModalOpen(false); setSelectedProduct(null); }} product={selectedProduct} onUpdateProduct={handleUpdateProduct} />}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Data Kamu telah berhasil disimpan! 💾✨"
      >
        <p>Semua perubahan telah disimpan dan aman.</p>
        <p>Kamu bisa melanjutkan pekerjaan tanpa khawatir. 👍</p>
      </SuccessModal>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteProduct}
        title="Kamu yakin ingin menghapus baris data ini 🗑️ ?"
        variant="delete"
        confirmText="Hapus"
      >
        <p>Apakah Kamu yakin ingin menghapus baris data ini? 🗑️ Data yang dihapus tidak dapat dikembalikan. Pastikan data yang dipilih benar sebelum melanjutkan. Tekan Hapus untuk mengonfirmasi 🔥 atau Batal jika ingin mempertahankan data ini 😊.</p>
      </ConfirmationModal>
    </div>
  );
};

export default ManageProducts;