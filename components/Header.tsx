import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, ChevronDownIcon, MenuIcon } from './icons/Icons';
import shapeLeftDown from '../assets/img/shapeleftdown.svg';
import shapeRightUp from '../assets/img/shaperightup.svg';
import profileIcon from '../assets/img/profile.svg';
import orangeProfileIcon from '../assets/img/orangeprofile.svg';
import outIcon from '../assets/img/out.svg';
import orangeOutIcon from '../assets/img/orangeout.svg';
import userImage from '../assets/img/user.jpeg';
import ConfirmationModal from './modals/ConfirmationModal';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
      // In a real app, you'd handle logout logic here
      console.log("User logged out.");
      setLogoutModalOpen(false);
  }

  return (
    <>
        <header className="relative bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6">
        {/* Background Shapes */}
        <img src={shapeLeftDown} alt="" className="absolute left-0 bottom-0 opacity-90 pointer-events-none" />
        <img src={shapeRightUp} alt="" className="absolute right-0 top-0 opacity-90 pointer-events-none" />

        {/* Header Content */}
        <div className="relative z-10 flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 focus:outline-none focus:text-gray-700">
                <MenuIcon className="h-6 w-6" />
            </button>
            <div className="relative text-gray-600 hidden md:block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                type="search"
                name="search"
                placeholder="Type to search..."
                className="w-full bg-transparent py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
                />
            </div>
        </div>
        <div className="relative z-10 flex items-center space-x-2 sm:space-x-5">
            <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-3 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <img 
                        src={userImage}
                        alt="User Avatar" 
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="text-left hidden md:block">
                        <p className="font-semibold text-sm text-gray-800">Thomas Anree</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 hidden md:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
                        <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-orange-500 transition-colors duration-150">
                            <img 
                                src={profileIcon} 
                                alt="Profile" 
                                className="w-5 h-5 mr-3 group-hover:hidden transition-opacity duration-150" 
                            />
                            <img 
                                src={orangeProfileIcon} 
                                alt="Profile" 
                                className="w-5 h-5 mr-3 hidden group-hover:block transition-opacity duration-150" 
                            />
                            Profil
                        </a>
                        <div className="border-t my-1"></div>
                        <a href="#" onClick={(e) => { e.preventDefault(); setLogoutModalOpen(true); setIsDropdownOpen(false); }} className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-orange-500 transition-colors duration-150">
                            <img 
                                src={outIcon} 
                                alt="Logout" 
                                className="w-5 h-5 mr-3 group-hover:hidden transition-opacity duration-150" 
                            />
                            <img 
                                src={orangeOutIcon} 
                                alt="Logout" 
                                className="w-5 h-5 mr-3 hidden group-hover:block transition-opacity duration-150" 
                            />
                            Keluar
                        </a>
                    </div>
                )}
            </div>
        </div>
        </header>
        <ConfirmationModal
            isOpen={isLogoutModalOpen}
            onClose={() => setLogoutModalOpen(false)}
            onConfirm={handleLogout}
            title="Kamu yakin mau keluar dari aplikasi🧐?"
            variant="logout"
            confirmText="Keluar"
        >
            <p>Apakah Kamu yakin ingin keluar dari akun? 🔒 Semua perubahan yang belum disimpan mungkin akan hilang.</p>
            <p>Kamu dapat masuk kembali kapan saja untuk melanjutkan. Tekan Keluar untuk melanjutkan 🚪 atau Batal jika ingin tetap berada di akun Kamu 😊.</p>
        </ConfirmationModal>
    </>
  );
};

export default Header;