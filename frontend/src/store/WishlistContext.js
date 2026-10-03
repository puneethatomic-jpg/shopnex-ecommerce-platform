'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('shopnex_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load wishlist from storage:', e);
    }
  }, []);

  const saveWishlist = (items) => {
    setWishlist(items);
    try {
      localStorage.setItem('shopnex_wishlist', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save wishlist to storage:', e);
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some(item => (
      item.product?.id === productId || 
      item.product?.slug === productId || 
      item.id === productId ||
      item.productId === productId
    ));
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const prodId = product.id || product.slug;
    const exists = isInWishlist(prodId);

    if (exists) {
      const updated = wishlist.filter(item => (
        item.product?.id !== prodId && 
        item.product?.slug !== prodId && 
        item.id !== prodId &&
        item.productId !== prodId
      ));
      saveWishlist(updated);
      toast.info(`Removed ${product.title} from wishlist`);
      if (user) {
        api.delete(`/wishlist/${prodId}`).catch(() => {});
      }
    } else {
      const wishlistItem = {
        id: `wish-${prodId}-${Date.now()}`,
        productId: prodId,
        product: product,
        createdAt: new Date().toISOString(),
      };
      const updated = [wishlistItem, ...wishlist];
      saveWishlist(updated);
      toast.success(`${product.title} saved to wishlist!`, {
        icon: '❤️',
      });
      if (user) {
        api.post('/wishlist', { productId: product.id }).catch(() => {});
      }
    }
  };

  const removeFromWishlist = (productId) => {
    if (!productId) return;
    const updated = wishlist.filter(item => (
      item.product?.id !== productId && 
      item.product?.slug !== productId && 
      item.id !== productId &&
      item.productId !== productId
    ));
    saveWishlist(updated);
    toast.info('Item removed from wishlist');
    if (user) {
      api.delete(`/wishlist/${productId}`).catch(() => {});
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
