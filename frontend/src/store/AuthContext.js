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
      console.warn('Failed to load user details from server:', err.message);
      if (authToken === 'mock_admin_123') {
        setUser({ id: 'admin_123', clerkId: 'mock_admin_123', name: 'ShopNex Admin', email: 'admin@shopnex.com', role: 'ADMIN' });
      } else if (authToken === 'mock_customer_123') {
        setUser({ id: 'customer_123', clerkId: 'mock_customer_123', name: 'John Doe', email: 'customer@shopnex.com', role: 'CUSTOMER' });
      } else {
        setUser(null);
      }
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
      console.warn('Backend login endpoint unavailable, using local session:', err.message);
      const fallbackUser = clerkId === 'mock_admin_123'
        ? { id: 'admin_123', clerkId: 'mock_admin_123', name: 'ShopNex Admin', email: 'admin@shopnex.com', role: 'ADMIN' }
        : { id: 'customer_123', clerkId: 'mock_customer_123', name: 'John Doe', email: 'customer@shopnex.com', role: 'CUSTOMER' };
      localStorage.setItem('shopnex_token', fallbackUser.clerkId);
      setToken(fallbackUser.clerkId);
      setUser(fallbackUser);
      return fallbackUser;
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
    const fallbackUser = role === 'ADMIN'
      ? { id: 'admin_123', clerkId: 'mock_admin_123', name: 'ShopNex Admin', email: 'admin@shopnex.com', role: 'ADMIN' }
      : { id: 'customer_123', clerkId: 'mock_customer_123', name: 'John Doe', email: 'customer@shopnex.com', role: 'CUSTOMER' };

    // Set state immediately for 0ms instant UI feedback
    setUser(fallbackUser);
    setToken(fallbackUser.clerkId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopnex_token', fallbackUser.clerkId);
    }
    setLoading(false);

    // Sync with server in background without blocking
    api.post('/auth/login', { clerkId: targetClerkId })
      .then((res) => {
        if (res?.success && res?.data) {
          setUser(res.data);
        }
      })
      .catch((err) => {
        console.warn('Background auth sync note:', err.message);
      });

    return fallbackUser;
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
