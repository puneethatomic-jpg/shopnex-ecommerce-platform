'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';
import { useCart } from '@/store/CartContext';
import AuthModal from '../auth/AuthModal';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  ShieldCheck, 
  LayoutDashboard, 
  LogOut,
  PackageCheck,
  ChevronDown,
  LogIn
} from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLinkActive = (path) => pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <ShoppingBag className="w-6 h-6 text-violet-400 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-bold tracking-tight text-gradient">ShopNex</span>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link 
            href="/" 
            className={`hover:text-violet-400 transition-colors ${isLinkActive('/') ? 'text-violet-400 font-bold' : 'text-slate-300'}`}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className={`hover:text-violet-400 transition-colors ${isLinkActive('/products') ? 'text-violet-400 font-bold' : 'text-slate-300'}`}
          >
            Shop
          </Link>
          <Link 
            href="/categories" 
            className={`hover:text-violet-400 transition-colors ${isLinkActive('/categories') ? 'text-violet-400 font-bold' : 'text-slate-300'}`}
          >
            Categories
          </Link>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          {/* Dashboard link if admin */}
          {isAdmin && (
            <Link 
              href="/admin" 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 rounded-xl text-xs font-semibold border border-violet-500/20 transition-all shadow-[0_0_15px_rgba(124,58,237,0.15)]"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          )}

          {/* Wishlist */}
          <Link href="/wishlist" className="relative p-2 text-slate-300 hover:text-pink-400 transition-colors" title="Wishlist">
            <Heart className="w-5 h-5" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 text-slate-300 hover:text-violet-400 transition-colors" title="Shopping Cart">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-violet-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User profile dropdown or Sign In CTA */}
          {user ? (
            <div className="relative border-l border-white/10 pl-4">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 bg-slate-900 border border-white/10 hover:border-violet-500/30 rounded-xl text-xs text-slate-200 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold uppercase">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight line-clamp-1">{user.name}</span>
                  <span className={`text-[9px] font-bold uppercase ${isAdmin ? 'text-amber-400' : 'text-violet-400'}`}>
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div 
                  onMouseLeave={() => setUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 text-xs z-50 backdrop-blur-xl"
                >
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold"
                  >
                    <User className="w-4 h-4 text-violet-400" />
                    My Profile
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all font-semibold"
                  >
                    <PackageCheck className="w-4 h-4 text-emerald-400" />
                    Order History
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-amber-300 hover:text-amber-200 hover:bg-white/5 rounded-xl transition-all font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-white/5 my-1"></div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-semibold w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="glow-btn px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_15px_rgba(124,58,237,0.25)] flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In / Register
            </button>
          )}
        </div>
      </nav>

      {/* Auth Modal Overlay */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}
