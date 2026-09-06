'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize token and fetch user details on load
  useEffect(() => {
    const localToken = localStorage.getItem('shopnex_token');
    if (localToken) {
      setToken(localToken);
      fetchUser(localToken);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken) => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      if (res.success) {
        setUser(res.data);
      }
    } catch (err) {
      console.error('Failed to load user details:', err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (clerkId) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { clerkId });
      if (res.success) {
        localStorage.setItem('shopnex_token', res.data.clerkId);
        setToken(res.data.clerkId);
        setUser(res.data);
        return res.data;
      }
    } catch (err) {
      console.error('Login error:', err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      localStorage.removeItem('shopnex_token');
      setToken(null);
      setUser(null);
    }
  };

  // Helper method for switching role instantly (for demonstration/mock testing)
  const switchRole = async (role) => {
    const targetClerkId = role === 'ADMIN' ? 'mock_admin_123' : 'mock_customer_123';
    return login(targetClerkId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
