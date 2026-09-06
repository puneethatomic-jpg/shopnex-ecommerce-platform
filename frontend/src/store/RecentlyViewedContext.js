'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext(null);

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shopnex_recently_viewed');
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse recently viewed history', e);
    }
  }, []);

  const addRecentlyViewed = (product) => {
    if (!product || !product.id) return;

    setRecentlyViewed((prev) => {
      // Filter out duplicate if already exists
      const filtered = prev.filter((item) => item.id !== product.id);
      // Prepend newly viewed product, keep top 8 items
      const updated = [product, ...filtered].slice(0, 8);

      try {
        localStorage.setItem('shopnex_recently_viewed', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recently viewed item', e);
      }
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem('shopnex_recently_viewed');
    } catch (e) {}
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
