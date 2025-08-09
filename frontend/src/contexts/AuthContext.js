import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUserProfile = useCallback(async () => {
    try {
      // Temporary mock profile for testing
      const mockAdmin = {
        id: '1',
        username: 'admin',
        email: 'admin@motorrepairshop.com',
        role: 'admin',
        lastLogin: new Date()
      };
      setUser(mockAdmin);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token, fetchUserProfile]);

  const login = async (username, password) => {
    // Mock login - no API calls
    if (username === 'admin' && password === 'admin123') {
      const mockToken = 'mock-jwt-token-123';
      const mockAdmin = {
        id: '1',
        username: 'admin',
        email: 'admin@motorrepairshop.com',
        role: 'admin',
        lastLogin: new Date()
      };
      
      setToken(mockToken);
      setUser(mockAdmin);
      localStorage.setItem('token', mockToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      toast.success('Login successful! (Mock Mode)');
      return { success: true };
    } else {
      toast.error('Invalid credentials. Use admin/admin123');
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const changePassword = async (currentPassword, newPassword) => {
    // Mock password change - no API calls
    if (currentPassword === 'admin123') {
      toast.success('Password changed successfully! (Mock Mode)');
      return { success: true };
    } else {
      toast.error('Current password is incorrect');
      return { success: false, error: 'Current password is incorrect' };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    changePassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
