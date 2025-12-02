import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
    id: string;
    email: string;
    nama: string;
    role: 'owner' | 'karyawan';
    isActive: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    isOwner: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.getProfile();
            if (response.success && response.data) {
                setUser(response.data);
            } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await authAPI.login(email, password);
            
            if (response.success && response.data) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
            } else {
                throw new Error(response.message || 'Login gagal');
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login.html';
    };

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        isOwner: user?.role === 'owner',
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Higher-order component for protecting routes
 */
export const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    requiredRole?: 'owner' | 'karyawan'
) => {
    return function WithAuthComponent(props: P) {
        const { user, loading, isAuthenticated } = useAuth();

        if (loading) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            window.location.href = '/login.html';
            return null;
        }

        if (requiredRole === 'owner' && user?.role !== 'owner') {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
                        <p className="mt-2 text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};

export default AuthContext;
