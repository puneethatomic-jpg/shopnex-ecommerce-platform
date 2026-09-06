'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Command, Tag, ArrowRight, Sparkles, Laptop, Shirt, Gamepad2, Home as HomeIcon } from 'lucide-react';
import api from '@/lib/api';

export default function CommandSearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      fetchCategories();
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err.message);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(query)}`);
        if (res.success) {
          setResults(res.data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err.message);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (slug) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  const handleSelectCategory = (categorySlug) => {
    onClose();
    router.push(`/products?category=${categorySlug}`);
  };

  if (!isOpen) return null;

  const quickCategories = [
    { name: 'Electronics', slug: 'electronics', icon: Laptop },
    { name: 'Fashion', slug: 'fashion', icon: Shirt },
    { name: 'Gaming', slug: 'gaming', icon: Gamepad2 },
    { name: 'Home & Kitchen', slug: 'home-kitchen', icon: HomeIcon },
  ];

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 md:pt-28 px-4 animate-in fade-in duration-200">
      {/* Backdrop overlay listener */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Top Search Bar Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-violet-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a product, brand, category (e.g. Wireless, Sneakers)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white p-1"
            >
              Clear
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded-md">
            <Command className="w-3 h-3" /> ESC
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Quick Categories Bar when no query */}
          {!query && (
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 px-1">
                Explore Categories
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quickCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => handleSelectCategory(cat.slug)}
                      className="flex flex-col items-center justify-center p-3 bg-slate-950/60 hover:bg-violet-600/10 border border-white/5 hover:border-violet-500/30 rounded-xl transition-all group"
                    >
                      <Icon className="w-5 h-5 text-violet-400 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-slate-300 group-hover:text-white">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Trending suggestions */}
              <div className="mt-2 border-t border-white/5 pt-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 px-1 block mb-2">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Pro Wireless Headphones', 'Smart Fitness Watch', 'Mechanical Gaming Keyboard', 'Running Shoes'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-violet-600/20 text-xs font-medium text-slate-300 hover:text-white border border-white/5 rounded-full transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-violet-400" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Searching ShopNex catalogue...</span>
            </div>
          )}

          {/* Results List */}
          {!loading && query && results.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 px-1">
                Products ({results.length})
              </span>
              <div className="flex flex-col gap-2">
                {results.map((product) => {
                  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';
                  const finalPrice = product.price - product.discount;

                  return (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="flex items-center gap-4 p-2.5 bg-slate-950/60 hover:bg-violet-600/10 border border-white/5 hover:border-violet-500/30 rounded-xl transition-all text-left group"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 border border-white/5">
                        <Image src={imageUrl} alt={product.title} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                            {product.title}
                          </span>
                          {product.category && (
                            <span className="px-2 py-0.5 text-[9px] font-semibold bg-white/5 text-slate-400 rounded-md uppercase tracking-wider flex-shrink-0">
                              {product.category.name}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-right flex-shrink-0">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-violet-400">
                            ${finalPrice.toFixed(2)}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-[10px] text-slate-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No results message */}
          {!loading && query && results.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 gap-2">
              <Search className="w-8 h-8 text-slate-600 mb-1" />
              <span className="text-sm font-semibold text-slate-300">No products matching "{query}"</span>
              <span className="text-xs text-slate-500">Try searching for keywords like "laptop", "shoes", or "headphone".</span>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 border-t border-white/5 bg-slate-950 text-[10px] text-slate-500 flex items-center justify-between">
          <span>Quick command search empowered by ShopNex AI</span>
          <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 bg-white/10 rounded">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
