'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.success) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch cart when user authentication changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      await api.post('/cart', { productId, quantity });
      await fetchCart();
      setIsDrawerOpen(true); // Automatically open Slide-Over Mini Cart Drawer
    } catch (err) {
      alert(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      setLoading(true);
      await api.put(`/cart/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      alert(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      await api.delete(`/cart/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      alert(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (code) => {
    try {
      setCouponError('');
      const res = await api.get(`/coupons?code=${code}`);
      if (res.success) {
        setCoupon(res.data);
        return res.data;
      }
    } catch (err) {
      setCoupon(null);
      setCouponError(err.message || 'Invalid coupon code');
      throw err;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const clearCart = () => {
    setCart(null);
    setCoupon(null);
  };

  // Calculations
  const cartItems = cart?.items || [];
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const finalPrice = item.product.price - item.product.discount;
    return acc + finalPrice * item.quantity;
  }, 0);

  const discountAmount = coupon ? (subtotal * coupon.discount) / 100 : 0;
  const shippingFee = subtotal > 500 || subtotal === 0 ? 0 : 15.0;
  const taxAmount = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shippingFee + taxAmount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        loading,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        total,
        coupon,
        couponError,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
