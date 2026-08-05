import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-900/40 rounded-2xl border border-white/5 aspect-[4/5] flex flex-col p-5">
            <div className="bg-slate-950 w-full aspect-square rounded-xl mb-4"></div>
            <div className="bg-slate-950 h-3 w-1/4 rounded-full mb-2"></div>
            <div className="bg-slate-950 h-4 w-3/4 rounded-full mb-3"></div>
            <div className="bg-slate-950 h-3.5 w-1/2 rounded-full mb-6"></div>
            <div className="mt-auto flex items-center justify-between">
              <div className="bg-slate-950 h-5 w-1/3 rounded-full"></div>
              <div className="bg-slate-950 h-9 w-9 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-sm font-semibold text-slate-400">No products found</span>
        <p className="text-xs text-slate-500 mt-1">Try modifying your query, search keywords, or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
