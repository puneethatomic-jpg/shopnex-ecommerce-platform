'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  LogIn,
  Search,
  Command
} from 'lucide-react';

export function CartBadge({ count }) {
  return (
    <AnimatePresence mode="popLayout">
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white ring-2 ring-slate-950 shadow-[0_0_10px_rgba(124,58,237,0.5)]"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Navbar({ onOpenSearch }) {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount, openDrawer } = useCart();
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

        {/* Navigation links & Search Command Trigger */}
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

          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-3 px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-violet-500/30 rounded-xl text-xs text-slate-400 transition-all group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-400 transition-colors" />
            <span className="group-hover:text-slate-200">Search products...</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-500 bg-white/5 border border-white/10 rounded-md ml-2">
              <Command className="w-2.5 h-2.5" /> K
            </span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-slate-300 hover:text-violet-400 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

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

          {/* Mini Cart Drawer Trigger with Animated Pop & Bounce Badge */}
          <button 
            onClick={openDrawer} 
            className="relative p-2 text-slate-300 hover:text-violet-400 transition-colors flex items-center justify-center" 
            title="Open Mini Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <CartBadge count={itemCount} />
          </button>

          {/* User profile dropdown or Sign In CTA */}
          {user ? (
            <div className="relative border-l border-white/10 pl-3 md:pl-4">
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
