'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { Laptop, Shirt, ChevronRight, Tags, Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  const { data: categoryRes, isLoading } = useQuery({
    queryKey: ['categoriesList'],
    queryFn: () => api.get('/categories'),
  });

  const categories = categoryRes?.data || [];

  // Helper to map category slugs to icons
  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'electronics':
        return <Laptop className="w-6 h-6 text-violet-400" />;
      case 'fashion':
        return <Shirt className="w-6 h-6 text-blue-400" />;
      default:
        return <Tags className="w-6 h-6 text-emerald-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-20 max-w-4xl mx-auto w-full flex flex-col gap-10 items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        <span className="text-xs text-slate-500">Loading categories hierarchy...</span>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto w-full flex flex-col gap-10">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Categories Directory</h1>
        <span className="text-xs text-slate-500 mt-0.5">Browse products through structured departments</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-6 hover:border-violet-500/20 transition-all">
            {/* Parent Category Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  {getCategoryIcon(cat.slug)}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-white leading-none">{cat.name}</h3>
                  <span className="text-[10px] text-slate-500 mt-1.5 uppercase font-semibold tracking-wider">Parent Department</span>
                </div>
              </div>

              <Link 
                href={`/products?category=${cat.slug}`}
                className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-0.5"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Subcategories */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Subcategories</span>
              
              {cat.children && cat.children.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {cat.children.map((sub) => (
                    <Link 
                      key={sub.id} 
                      href={`/products?category=${sub.slug}`}
                      className="flex items-center justify-between bg-slate-950 border border-white/5 hover:border-white/10 hover:bg-white/5 rounded-xl px-4 py-3 text-xs text-slate-300 transition-all"
                    >
                      <span className="font-semibold text-slate-200">{sub.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-600 italic">No subcategories cataloged.</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
