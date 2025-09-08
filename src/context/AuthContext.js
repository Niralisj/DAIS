import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('jwtToken'));
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true); // Track initial user loading
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUser = useCallback(async (currentToken) => {
        if (!currentToken) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoadingUser(false); // Ensure loading stops even if no token
            return;
        }
        setIsLoadingUser(true);
        try {
            const API_BASE = import.meta.env.VITE_BACKEND_URL;

const response = await fetch(`${API_BASE}/api/user/me`, {
    headers: { Authorization: `Bearer ${currentToken}` },
});


            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                console.error('AuthContext: Failed to fetch user, clearing token');
                localStorage.removeItem('jwtToken');
                setToken(null); // Trigger re-render and clear state via useEffect
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('AuthContext: Error fetching user:', error);
            setUser(null); // Clear user on error
            setIsAuthenticated(false);
        } finally {
            setIsLoadingUser(false);
        }
    }, []);

    // Fetch user when token changes or on initial load
    useEffect(() => {
        console.log("AuthContext: Token changed or initial load, fetching user. Token:", token);
        fetchUser(token);
    }, [token, fetchUser]);

    const login = (newToken) => {
        console.log("AuthContext: Login called");
        localStorage.setItem('jwtToken', newToken);
        setToken(newToken); // This will trigger the useEffect to fetch the user
    };

    const logout = () => {
        console.log("AuthContext: Logout called");
        localStorage.removeItem('jwtToken');
        setToken(null); // This will trigger the useEffect which clears user/auth state
        setUser(null);
        setIsAuthenticated(false);
  
    };

    const value = {
        token,
        user,
        isAuthenticated,
        isLoadingUser, // Provide loading status for initial auth check
        login,
        logout,
        fetchUser 
    };

   


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};