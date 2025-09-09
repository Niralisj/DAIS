import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../utils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // FIX: Change to REACT_APP_BACKEND_URL for Create React App compatibility
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const fetchUser = useCallback(async (userToken) => {
    if (!userToken || !BACKEND_URL) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error("Failed to fetch user:", response.status, response.statusText);
        setToken(null);
        localStorage.removeItem('jwtToken');
        setUser(null);
        handleError('Session expired. Please log in again.');
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setToken(null);
      localStorage.removeItem('jwtToken');
      setUser(null);
      handleError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.jwtToken) {
        setToken(result.jwtToken);
        localStorage.setItem('jwtToken', result.jwtToken);
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

      if (result.success && result.jwtToken) {
        setToken(result.jwtToken);
        localStorage.setItem('jwtToken', result.jwtToken);
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
