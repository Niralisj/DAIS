import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../utils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // This useEffect now just checks for the token on initial load
    useEffect(() => {
        // If there's a token, we assume the user is logged in
        if (token) {
            // No need to fetch user data here, as it will be set by the login function
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
    
            const result = await response.json();
    
            if (result.success && result.jwtToken && result.userData) {
                // FIX: Set both the token and user data at the same time
                setToken(result.jwtToken);
                localStorage.setItem('jwtToken', result.jwtToken);
                setUser(result.userData); // <-- This is the key change!
                handleSuccess(result.message || 'Login successful!');
                return result;
            } else {
                throw new Error(result.message || 'Invalid credentials or server error.');
            }
        } catch (error) {
            console.error('Login error:', error);
            handleError(error.message || 'Something went wrong during login. Please try again later.');
            throw error;
        }
    };
    
    const signup = async (data) => {
        try {
            const response = await fetch(`${BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
    
            if (result.success && result.jwtToken && result.userData) {
                setToken(result.jwtToken);
                localStorage.setItem('jwtToken', result.jwtToken);
                setUser(result.userData);
                handleSuccess(result.message || 'Account created successfully!');
                return result;
            } else {
                throw new Error(result.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            handleError(error.message || 'Something went wrong during signup. Please try again later.');
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('jwtToken');
        setUser(null);
        navigate('/login');
    };

    const value = {
        token,
        user,
        loading,
        login,
        logout,
        signup
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};