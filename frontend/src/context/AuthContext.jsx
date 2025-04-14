//context api
import React, { createContext, useState, useEffect,useContext} from 'react';
export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(() => {
        // Initialize token from localStorage
        const storedToken = localStorage.getItem('token');
        return storedToken || null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    useEffect(() => {
        // Update localStorage and authentication state when token changes
        if (token) {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
        }
    }, [token]);

    const login = (newToken) => {
        if (!newToken) {
            console.error('No token provided to login');
            return;
        }
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};