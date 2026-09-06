'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from './ProductCard';
import { Sparkles, Bot, Zap, Flame, Award, Tag } from 'lucide-react';

export default function RecommendationSection({ 
  title = "AI Recommended For You", 
  subtitle = "Tailored choices generated using smart similarity scoring",
  endpoint = "/products/recommendations/trending",
  icon: Icon = Sparkles
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: recRes, isLoading } = useQuery({
    queryKey: ['recommendations', endpoint],
    queryFn: () => api.get(endpoint),
    staleTime: 60 * 1000,
  });

  const rawProducts = recRes?.data || [];

  // Filter products based on selected preference pill
  const filteredProducts = rawProducts.filter((product) => {
    const finalPrice = product.price - product.discount;
    if (activeFilter === 'under100') return finalPrice <= 100;
    if (activeFilter === 'highRated') {
      const avg = product.reviews?.length 
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length 
        : 5.0;
      return avg >= 4.5;
    }
    if (activeFilter === 'bigSavings') return product.discount > 0;
    return true;
  });

  const filterPills = [
    { id: 'all', label: '🔥 All AI Picks', icon: Flame },
    { id: 'under100', label: '⚡ Under $100', icon: Zap },
    { id: 'highRated', label: '✨ High Rated', icon: Award },
    { id: 'bigSavings', label: '🏷️ Big Savings', icon: Tag },
  ];

  if (!isLoading && rawProducts.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6 w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/20 text-violet-300 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <Icon className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
              <span className="px-2 py-0.5 bg-gradient-to-r from-violet-600/20 to-pink-600/20 text-violet-300 border border-violet-500/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Bot className="w-3 h-3" /> AI Engine
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5">{subtitle}</span>
          </div>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border flex items-center gap-1.5 ${
                activeFilter === pill.id
                  ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] scale-105'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-violet-500/30'
              }`}
            >
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid view with AI match tags */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-900/40 rounded-2xl border border-white/5 aspect-[4/5]"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-12 bg-slate-950/40 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
          <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
          <span className="text-sm font-semibold text-slate-300">No matching products under this filter</span>
          <button 
            onClick={() => setActiveFilter('all')}
            className="mt-3 text-xs text-violet-400 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative flex flex-col">
              {/* AI Match Badge */}
              <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 bg-slate-950/90 backdrop-blur-md border border-violet-500/30 rounded-lg flex items-center gap-1 text-[10px] font-bold text-violet-300 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{product.matchPercentage || 94}% Match</span>
              </div>

              <ProductCard product={product} />

              {/* AI Recommendation Reason */}
              {product.aiReason && (
                <span className="mt-2 text-[10px] text-slate-400 italic px-1 line-clamp-1">
                  💡 {product.aiReason}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
