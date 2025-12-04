import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            // Parse user from localStorage (saved by login.html)
            const userData = JSON.parse(storedUser);
            
            // Validate token hasn't expired
            try {
                const tokenData = JSON.parse(atob(token));
                if (tokenData.exp && tokenData.exp < Date.now()) {
                    throw new Error('Token expired');
                }
            } catch {
                // If token parsing fails, still try to use stored user
            }
            
            // Set user from localStorage
            setUser({
                id: userData.id,
                email: userData.email,
                nama: userData.nama || userData.email.split('@')[0],
                role: userData.role,
                isActive: true
            });
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

    const login = async (_email: string, _password: string) => {
        // Login is handled by login.html with Supabase
        // This function redirects to login page
        window.location.href = '/login.html';
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
