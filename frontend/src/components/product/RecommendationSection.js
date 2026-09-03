'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from './ProductCard';
import { Sparkles, Bot } from 'lucide-react';

export default function RecommendationSection({ 
  title = "AI Recommended For You", 
  subtitle = "Tailored choices generated using smart similarity scoring",
  endpoint = "/products/recommendations/trending",
  icon: Icon = Sparkles
}) {
  const { data: recRes, isLoading } = useQuery({
    queryKey: ['recommendations', endpoint],
    queryFn: () => api.get(endpoint),
    staleTime: 60 * 1000,
  });

  const products = recRes?.data || [];

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/20 text-violet-300 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <Icon className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
              <span className="px-2 py-0.5 bg-gradient-to-r from-violet-600/20 to-pink-600/20 text-violet-300 border border-violet-500/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Bot className="w-3 h-3" /> AI Powered
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5">{subtitle}</span>
          </div>
        </div>
      </div>

      {/* Grid view with AI match tags */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-900/40 rounded-2xl border border-white/5 aspect-[4/5]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative flex flex-col">
              {/* AI Match Badge */}
              <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 bg-slate-950/90 backdrop-blur-md border border-violet-500/30 rounded-lg flex items-center gap-1 text-[10px] font-bold text-violet-300 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{product.matchPercentage || 92}% Match</span>
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
