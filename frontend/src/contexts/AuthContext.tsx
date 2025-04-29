import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// dit is de interface voor de gebruiker
interface User {
    id: number;
    username: string;
    email: string;
}

// dit is de interface voor de auth context
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

// dit maakt een nieuwe context aan
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// dit is de auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // dit zijn de states voor de gebruiker en loading status
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // dit effect checkt de authenticatie status bij het laden van de app
    useEffect(() => {
        checkAuth();
    }, []);

    // deze functie kijkt of de gebruiker is ingelogd
    const checkAuth = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/check');

            if (response.data && response.data.isAuthenticated && response.data.user) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (error: any) {
            if (error.response) {
                console.error('[AuthContext] /auth/check error status:', error.response.status);
                console.error('[AuthContext] /auth/check error data:', error.response.data);
            } else {
                console.error('[AuthContext] /auth/check non-HTTP error:', error.message);
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // deze functie logt de gebruiker in
    const login = async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        setUser(response.data.user);
    };

    // deze functie registreert een nieuwe gebruiker
    const register = async (username: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { username, email, password });
        setUser(response.data.user);
    };

    // deze functie logt de gebruiker uit
    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    // dit is de waarde die beschikbaar wordt gesteld aan de context
    const value = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// deze hook maakt de auth context beschikbaar voor andere componenten
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 