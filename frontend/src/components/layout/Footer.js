import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Globe, Share2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12 px-6 md:px-12 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-violet-400" />
            <span className="text-xl font-bold tracking-tight text-white">ShopNex</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            A state-of-the-art e-commerce platform built with Next.js, Express, PostgreSQL and Redis caching. Experience premium design and seamless flow.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold text-white">Categories</span>
          <div className="flex flex-col gap-2.5 text-xs text-slate-400">
            <Link href="/products?category=electronics" className="hover:text-violet-400 transition-colors">Electronics</Link>
            <Link href="/products?category=fashion" className="hover:text-violet-400 transition-colors">Fashion</Link>
            <Link href="/products?category=laptops" className="hover:text-violet-400 transition-colors">Laptops</Link>
            <Link href="/products?category=shoes" className="hover:text-violet-400 transition-colors">Shoes</Link>
          </div>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold text-white">Resources</span>
          <div className="flex flex-col gap-2.5 text-xs text-slate-400">
            <Link href="/products" className="hover:text-violet-400 transition-colors">Browse Shop</Link>
            <Link href="/cart" className="hover:text-violet-400 transition-colors">View Cart</Link>
            <Link href="/wishlist" className="hover:text-violet-400 transition-colors">My Wishlist</Link>
            <Link href="/profile" className="hover:text-violet-400 transition-colors">My Account</Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold text-white">Newsletter</span>
          <p className="text-xs text-slate-400 leading-relaxed">
            Subscribe to our newsletter to receive the latest updates, promotions, and new arrivals.
          </p>
          <div className="flex items-center gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500/50 w-full"
            />
            <button className="px-3 py-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white rounded-lg text-xs font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-slate-500">
          © {new Date().getFullYear()} ShopNex. All rights reserved.
        </span>
        <div className="flex items-center gap-6 text-slate-500 text-xs">
          <a href="#" className="hover:text-white transition-colors"><Share2 className="w-4 h-4" /></a>
          <a href="#" className="hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by Antigravity
          </span>
        </div>
      </div>
    </footer>
  );
}
