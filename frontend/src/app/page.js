'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';
import RecommendationSection from '@/components/product/RecommendationSection';
import { ArrowRight, Laptop, Shirt, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { data: productRes, isLoading } = useQuery({
    queryKey: ['homeProducts'],
    queryFn: () => api.get('/products?limit=4'),
  });

  const products = productRes?.data || [];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-24 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-slate-950 min-h-[60vh]">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <span className="text-xs uppercase font-bold tracking-widest text-violet-400 bg-violet-500/10 px-4 py-1.5 rounded-full border border-violet-500/20 mb-6 animate-pulse">
          Flash Sale — Up to 30% Off
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1] mb-6">
          Next-Gen Shopping <br />
          <span className="text-gradient">Experience is Here</span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-xl mb-10 leading-relaxed">
          Welcome to ShopNex. Explore premium brands, fast checkout, responsive designs, and seamless order tracking.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/products" 
            className="glow-btn px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] flex items-center gap-2"
          >
            Shop Catalogue
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/categories" 
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all"
          >
            Browse Categories
          </Link>
        </div>
      </section>

      {/* Feature stats banner */}
      <section className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-4 p-6 bg-slate-900/30 border border-white/5 rounded-2xl">
          <div className="p-3 bg-violet-600/10 text-violet-400 border border-violet-500/10 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Free Delivery</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">On all order subtotals above $500</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-slate-900/30 border border-white/5 rounded-2xl">
          <div className="p-3 bg-violet-600/10 text-violet-400 border border-violet-500/10 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Secure Checkout</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Mock gateways validating transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-slate-900/30 border border-white/5 rounded-2xl">
          <div className="p-3 bg-violet-600/10 text-violet-400 border border-violet-500/10 rounded-xl">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Easy Returns</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Submit cancellation or refunds easily</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto w-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white">Featured Categories</h2>
            <span className="text-[10px] text-slate-500 mt-0.5">Browse curated catalog trees</span>
          </div>
          <Link href="/categories" className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
            See All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Electronics */}
          <Link 
            href="/products?category=electronics" 
            className="group relative h-48 rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40 p-6 flex flex-col justify-end hover:border-violet-500/20 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2.5 bg-violet-600 text-white rounded-lg">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Electronics</h3>
                <span className="text-[10px] text-slate-400">Laptops, Smartphones, and more</span>
              </div>
            </div>
          </Link>

          {/* Fashion */}
          <Link 
            href="/products?category=fashion" 
            className="group relative h-48 rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40 p-6 flex flex-col justify-end hover:border-violet-500/20 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-lg">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Fashion</h3>
                <span className="text-[10px] text-slate-400">T-Shirts, Shoes, and more</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto w-full">
        <RecommendationSection 
          title="AI Recommended For You"
          subtitle="Smart recommendations generated based on user preferences and sales activity"
          endpoint="/products/recommendations/user"
          icon={Sparkles}
        />
      </section>

      {/* Featured Products */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto w-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white">New Arrivals</h2>
            <span className="text-[10px] text-slate-500 mt-0.5">Fresh items updated recently</span>
          </div>
          <Link href="/products" className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
            Browse All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <ProductGrid products={products} loading={isLoading} />
      </section>
    </div>
  );
}
