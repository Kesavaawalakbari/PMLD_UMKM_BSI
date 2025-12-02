import React, { useState } from 'react';
import { UserIcon, BellIcon, SunIcon } from '../components/icons/Icons';
import ToggleSwitch from '../components/ToggleSwitch';
import { useToast } from '../context/ToastContext';

const Settings: React.FC = () => {
    const { addToast } = useToast();
    const [profile, setProfile] = useState({
        name: 'Thomas Anree',
        email: 'thomas.anree@example.com',
        password: ''
    });
    
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        text: true,
    });

    const [appearance, setAppearance] = useState('Light');

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({...prev, [name]: value}));
    }

    const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveChanges = () => {
        // In a real app, you would make an API call here.
        addToast('Pengaturan berhasil disimpan!', 'success');
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Pengaturan</h2>
                <div className="text-sm text-gray-500 mt-1">
                    <span className="text-gray-400">Dashboard</span> / Pengaturan
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Profile and Appearance */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Settings */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center"><UserIcon className="w-6 h-6 mr-3 text-teal-600"/> Pengaturan Profil</h3>
                        <div className="flex items-center mb-6">
                            <img src="https://i.ibb.co/6Hk2c5v/man-avatar-scaled.jpg" alt="Admin Avatar" className="w-20 h-20 rounded-full object-cover mr-6" />
                            <div>
                                <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors">Ubah Foto</button>
                                <p className="text-xs text-gray-500 mt-2">JPG, GIF atau PNG. Ukuran maks 800K.</p>
                            </div>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                                    <input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi Baru</label>
                                    <input type="password" id="password" name="password" placeholder="ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó" value={profile.password} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500" />
                                </div>
                            </div>
                            <div className="mt-8 text-right">
                                <button type="submit" className="bg-orange-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-500 transition-colors">Simpan Perubahan</button>
                            </div>
                        </form>
                    </div>

                     {/* Appearance Settings */}
                     <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center"><SunIcon className="w-6 h-6 mr-3 text-teal-600"/> Tampilan</h3>
                         <div className="space-y-4">
                            <p className="text-sm text-gray-600">Pilih tema tampilan untuk dashboard Anda.</p>
                            <div className="flex space-x-4">
                                <button onClick={() => setAppearance('Light')} className={`w-full p-4 border-2 rounded-lg text-center ${appearance === 'Light' ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200'}`}>
                                    <span className="font-semibold">Light Mode</span>
                                </button>
                                <button onClick={() => setAppearance('Dark')} className={`w-full p-4 border-2 rounded-lg text-center bg-gray-700 text-white ${appearance === 'Dark' ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-700'}`}>
                                    <span className="font-semibold">Dark Mode</span>
                                </button>
                            </div>
                         </div>
                    </div>

                </div>
                
                {/* Column 2: Notifications */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center"><BellIcon className="w-6 h-6 mr-3 text-teal-600"/> Notifikasi</h3>
                        <div className="space-y-6">
                            <ToggleSwitch label="Email Notifikasi" enabled={notifications.email} onChange={(val) => handleNotificationChange('email', val)} />
                            <ToggleSwitch label="Push Notifikasi" enabled={notifications.push} onChange={(val) => handleNotificationChange('push', val)} />
                            <ToggleSwitch label="Pesan Teks" enabled={notifications.text} onChange={(val) => handleNotificationChange('text', val)} />
                        </div>
                        <div className="mt-8 text-right">
                            <button onClick={handleSaveChanges} className="bg-orange-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-500 transition-colors">Simpan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
