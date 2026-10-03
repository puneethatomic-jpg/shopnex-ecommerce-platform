'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { FALLBACK_PRODUCTS } from '../lib/fallbackData';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Load local cart items on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopnex_cart_items');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse cart items from local storage:', e);
    }
  }, []);

  // Save cart items to LocalStorage
  const saveCart = (items) => {
    setCartItems(items);
    try {
      localStorage.setItem('shopnex_cart_items', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart items to local storage:', e);
    }
  };

  // Helper to resolve product object from ID or object
  const resolveProduct = (productOrId) => {
    if (!productOrId) return null;
    if (typeof productOrId === 'object' && productOrId.title) {
      return productOrId;
    }
    const id = typeof productOrId === 'string' ? productOrId : productOrId.id;
    const found = FALLBACK_PRODUCTS.find(p => p.id === id || p.slug === id);
    if (found) return found;
    return {
      id: id || 'item-' + Date.now(),
      title: 'ShopNex Product',
      price: 99.0,
      discount: 0,
      images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }],
    };
  };

  const addToCart = async (productOrId, quantity = 1) => {
    const product = resolveProduct(productOrId);
    if (!product) return;

    const prodId = product.id || product.slug;
    const existingIndex = cartItems.findIndex(
      item => item.product?.id === prodId || item.product?.slug === prodId || item.productId === prodId
    );

    let updated;
    if (existingIndex > -1) {
      updated = cartItems.map((item, idx) => {
        if (idx === existingIndex) {
          return { ...item, quantity: item.quantity + quantity };
        }
        return item;
      });
    } else {
      const newItem = {
        id: `cart-item-${prodId}-${Date.now()}`,
        productId: prodId,
        quantity: Math.max(1, quantity),
        product: product,
      };
      updated = [newItem, ...cartItems];
    }

    saveCart(updated);
    setIsDrawerOpen(true);

    // Sync to backend if authenticated
    if (user) {
      api.post('/cart', { productId: prodId, quantity }).catch(() => {});
    }
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const updated = cartItems.map(item => {
      if (item.id === cartItemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    saveCart(updated);
    if (user) {
      api.put(`/cart/${cartItemId}`, { quantity: newQuantity }).catch(() => {});
    }
  };

  const removeFromCart = (cartItemId) => {
    const updated = cartItems.filter(item => item.id !== cartItemId);
    saveCart(updated);
    toast.info('Item removed from cart');
    if (user) {
      api.delete(`/cart/${cartItemId}`).catch(() => {});
    }
  };

  const applyCoupon = async (code) => {
    try {
      setCouponError('');
      const cleanCode = code?.trim()?.toUpperCase();
      if (cleanCode === 'WELCOME10') {
        const c = { code: 'WELCOME10', discount: 10 };
        setCoupon(c);
        return c;
      }
      if (cleanCode === 'SAVE20') {
        const c = { code: 'SAVE20', discount: 20 };
        setCoupon(c);
        return c;
      }

      const res = await api.get(`/coupons?code=${cleanCode}`);
      if (res.success && res.data) {
        setCoupon(res.data);
        return res.data;
      }
      throw new Error('Invalid coupon code');
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
    saveCart([]);
    setCoupon(null);
  };

  // Live Cart Calculations
  const itemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    const discount = item.product?.discount || 0;
    const finalPrice = Math.max(0, price - discount);
    return acc + finalPrice * (item.quantity || 1);
  }, 0);

  const discountAmount = coupon ? (subtotal * coupon.discount) / 100 : 0;
  const shippingFee = subtotal > 500 || subtotal === 0 ? 0 : 15.0;
  const taxAmount = (subtotal - discountAmount) * 0.08;
  const total = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

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
