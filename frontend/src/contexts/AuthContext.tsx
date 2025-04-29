import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// dit is de interface voor de gebruiker in register
interface User {
    id: number;
    username: string;
    email: string;
}

// dit is de interface voor de auth context
interface AuthContextType {
    // this means that the user can be a user or null
    user: User | null;
    isAuthenticated: boolean;
    // Promise<void> means that the login function will return without a success message.
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
            // This is a error log. "check error status" will see what the status is, like 401, 404, 500. Error data will show what the actual error is.
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

    // This is the value that is available for the context.
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

// This hook makes the auth context available for other components.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 