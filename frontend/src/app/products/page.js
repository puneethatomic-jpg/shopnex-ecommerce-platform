'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh] text-xs text-slate-500">
        Loading Catalogue...
      </div>
    }>
      <ProductsCatalog />
    </Suspense>
  );
}

function ProductsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search parameters states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Sync state from query URL when it changes (e.g. navigation back/forward)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || 'latest');
    setPage(parseInt(searchParams.get('page') || '1'));
  }, [searchParams]);

  // Query database
  const { data: productRes, isLoading } = useQuery({
    queryKey: ['products', search, category, minPrice, maxPrice, sort, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', '8');
      return api.get(`/products?${params.toString()}`);
    },
  });

  const { data: categoryRes } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories'),
  });

  const products = productRes?.data || [];
  const pagination = productRes?.pagination || { total: 0, pages: 1 };
  const categoriesList = categoryRes?.data || [];

  const updateURL = (newParams) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') {
        current.delete(k);
      } else {
        current.set(k, v.toString());
      }
    });
    router.push(`/products?${current.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    updateURL({ search, page: 1 });
  };

  const handleCategorySelect = (slug) => {
    const val = category === slug ? '' : slug;
    setCategory(val);
    setPage(1);
    updateURL({ category: val, page: 1 });
  };

  const handleSortSelect = (val) => {
    setSort(val);
    setPage(1);
    updateURL({ sort: val, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPage(newPage);
    updateURL({ page: newPage });
  };

  return (
    <div className="px-6 md:px-12 py-12 max-w-6xl mx-auto w-full flex flex-col gap-10">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tight">Product Catalogue</h1>
          <span className="text-xs text-slate-500 mt-0.5">Showing {products.length} of {pagination.total} results</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500/50"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
        </form>
      </div>

      {/* Main Grid & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="flex flex-col gap-8 bg-slate-900/20 border border-white/5 rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <SlidersHorizontal className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Filters</h3>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-300">Category</h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              {categoriesList.map((cat) => (
                <div key={cat.id} className="flex flex-col gap-1">
                  <button 
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`text-left font-medium hover:text-violet-400 transition-colors ${
                      category === cat.slug ? 'text-violet-400 font-bold' : ''
                    }`}
                  >
                    {cat.name}
                  </button>
                  {cat.children && cat.children.length > 0 && (
                    <div className="pl-3 flex flex-col gap-1.5 border-l border-white/5 ml-1 mt-1">
                      {cat.children.map((child) => (
                        <button 
                          key={child.id}
                          onClick={() => handleCategorySelect(child.slug)}
                          className={`text-left text-[11px] hover:text-violet-400 transition-colors ${
                            category === child.slug ? 'text-violet-400 font-bold' : ''
                          }`}
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col gap-3 border-t border-white/5 pt-6">
            <h4 className="text-xs font-bold text-slate-300">Price Range</h4>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <span className="text-slate-600">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
            <button 
              onClick={() => updateURL({ minPrice, maxPrice, page: 1 })}
              className="mt-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold transition-all"
            >
              Apply Price
            </button>
          </div>

          {/* Sort Selection */}
          <div className="flex flex-col gap-3 border-t border-white/5 pt-6">
            <h4 className="text-xs font-bold text-slate-300">Sort By</h4>
            <select 
              value={sort}
              onChange={(e) => handleSortSelect(e.target.value)}
              className="px-2.5 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white focus:outline-none"
            >
              <option value="latest">Latest Arrivals</option>
              <option value="price_asc">Price Low → High</option>
              <option value="price_desc">Price High → Low</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <div className="lg:col-span-3 flex flex-col gap-10">
          <ProductGrid products={products} loading={isLoading} />

          {/* Pagination controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 border-t border-white/5 pt-8">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 border border-white/10 bg-slate-900/40 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400 font-semibold">
                Page {page} of {pagination.pages}
              </span>
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.pages}
                className="p-2 border border-white/10 bg-slate-900/40 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
