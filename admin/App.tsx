
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ManageUmkm from './pages/ManageUmkm';
import ManageFinance from './pages/ManageFinance';
import ManageProducts from './pages/ManageProducts';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import Bantuan from './pages/Bantuan';
import Settings from './pages/Settings';
import { Page, UserSubPage } from './types';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Loading spinner component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Memuat...</p>
    </div>
  </div>
);

// Access denied component for non-owner trying to access owner-only pages
const AccessDenied: React.FC = () => (
  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
    <div className="text-center p-8">
      <div className="text-6xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
      <p className="text-gray-600">Halaman ini hanya dapat diakses oleh Owner.</p>
    </div>
  </div>
);

// Main app content with auth check
const AppContent: React.FC = () => {
  const { user, loading, isAuthenticated, isOwner } = useAuth();
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [activeSubPage, setActiveSubPage] = useState<UserSubPage>('Penjualan');

  // Check authentication on mount
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login.html';
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const handleSetPage = (page: Page) => {
    setActivePage(page);
  };

  const handleSetSubPage = (subPage: UserSubPage) => {
    setActivePage('Kelola Pengguna');
    setActiveSubPage(subPage);
  };

  // Pages that require owner role
  const ownerOnlyPages: Page[] = ['Kelola UMKM', 'Kelola Keuangan'];

  const renderPage = () => {
    // Check if current page requires owner role
    if (ownerOnlyPages.includes(activePage) && !isOwner) {
      return <AccessDenied />;
    }

    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Kelola Produk':
        return <ManageProducts />;
      case 'Kelola Keuangan':
        return <ManageFinance />;
      case 'Kelola UMKM':
        return <ManageUmkm />;
      case 'Kelola Pengguna':
        return <ManageUsers activeSubPage={activeSubPage} />;
      case 'Bantuan':
        return <Bantuan />;
      case 'Pengaturan':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      activePage={activePage} 
      setActivePage={handleSetPage}
      activeSubPage={activeSubPage}
      setActiveSubPage={handleSetSubPage}
      userRole={user?.role}
    >
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
