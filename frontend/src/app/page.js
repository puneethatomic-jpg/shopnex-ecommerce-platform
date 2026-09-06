'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';
import RecommendationSection from '@/components/product/RecommendationSection';
import { ArrowRight, Laptop, Shirt, Gamepad2, Home as HomeIcon, ShieldCheck, Truck, RefreshCw, Sparkles, Command, Search, Flame, Zap } from 'lucide-react';

export default function HomePage() {
  const { data: productRes, isLoading } = useQuery({
    queryKey: ['homeProducts'],
    queryFn: () => api.get('/products?limit=8'),
  });

  const products = productRes?.data || [];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 md:px-12 flex flex-col items-center justify-center text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-slate-950 to-slate-950 min-h-[55vh]">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6 text-violet-300 text-xs font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>ShopNex 2.0 — Next-Gen E-Commerce Experience</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Elevate Your Shopping <br />
          <span className="text-gradient">With AI-Powered Discovery</span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-xl mb-10 leading-relaxed">
          Discover curated products across Electronics, Fashion, Gaming, and Home Essentials with instant AI recommendations and frictionless checkout.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            href="/products" 
            className="glow-btn px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] flex items-center gap-2"
          >
            Explore Full Catalogue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Feature stats banner */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4 p-3">
            <div className="p-3 bg-violet-600/20 text-violet-400 border border-violet-500/20 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Free Express Shipping</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Unlocked on all cart orders above $500</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Encrypted Payment Guarantee</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Mock gateways & card validations</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Hassle-Free 30-Day Returns</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Instant order cancellation & refunds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetrical Bento Grid Categories Section */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto w-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Category Showcase</h2>
              <span className="px-2 py-0.5 bg-violet-600/20 text-violet-300 border border-violet-500/30 rounded-full text-[10px] font-bold">
                BENTO GRID
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1">Explore our high-demand product collections</span>
          </div>
          <Link href="/categories" className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[480px]">
          {/* Big 2x2 Feature Banner Card (Electronics Flash Sale) */}
          <Link 
            href="/products?category=electronics" 
            className="md:col-span-2 group relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 flex flex-col justify-between p-8 hover:border-violet-500/40 hover:shadow-[0_0_40px_rgba(124,58,237,0.2)] transition-all duration-500 min-h-[320px] md:min-h-full"
          >
            {/* Background Image with Dark Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200" 
                alt="Electronics Banner" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
            </div>

            {/* Top Badges */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 bg-violet-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300" /> Featured 2x2 Block
              </span>
              <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-white/10 text-violet-300 text-xs font-bold rounded-xl">
                Up to 30% Off
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 flex flex-col gap-2 mt-auto pt-16">
              <div className="p-3 bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-2xl w-fit backdrop-blur-md">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                Electronics & Next-Gen Laptops
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md line-clamp-2">
                High-performance ultrabooks, noise-canceling headphones, and smart devices designed for speed and productivity.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-violet-400 group-hover:translate-x-1 transition-transform">
                <span>Shop Tech Deals</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Right Column (Stacked 1x1 Cards) */}
          <div className="flex flex-col gap-6">
            {/* Fashion Card (1x1) */}
            <Link 
              href="/products?category=fashion" 
              className="flex-1 group relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 flex flex-col justify-between p-6 hover:border-pink-500/40 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-all duration-500 min-h-[220px]"
            >
              <div className="absolute inset-0 z-0">
                <Image 
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800" 
                  alt="Fashion" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="p-2.5 bg-pink-600/30 text-pink-300 border border-pink-500/30 rounded-xl backdrop-blur-md">
                  <Shirt className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-950/80 px-2.5 py-1 border border-white/10 rounded-lg">
                  1x1 Block
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-1 mt-auto">
                <h4 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                  Fashion & Streetwear
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1">Trendy apparel, sneakers & accessories.</p>
              </div>
            </Link>

            {/* Gaming Card (1x1) */}
            <Link 
              href="/products?category=gaming" 
              className="flex-1 group relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 flex flex-col justify-between p-6 hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-500 min-h-[220px]"
            >
              <div className="absolute inset-0 z-0">
                <Image 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800" 
                  alt="Gaming" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="p-2.5 bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl backdrop-blur-md">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-950/80 px-2.5 py-1 border border-white/10 rounded-lg">
                  1x1 Block
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-1 mt-auto">
                <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Gaming & Esports Gear
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1">Keyboards, mice, and immersive audio.</p>
              </div>
            </Link>
          </div>
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
            <h2 className="text-2xl font-extrabold text-white tracking-tight">New Arrivals</h2>
            <span className="text-xs text-slate-400 mt-1">Freshly updated items in catalogue</span>
          </div>
          <Link href="/products" className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={products} loading={isLoading} />
      </section>
    </div>
  );
}
