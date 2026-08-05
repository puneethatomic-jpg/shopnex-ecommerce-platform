'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';
import { useCart } from '@/store/CartContext';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  ShieldCheck, 
  LayoutDashboard, 
  LogOut,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, switchRole, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();

  const isLinkActive = (path) => pathname === path;

  const handleRoleToggle = async () => {
    const targetRole = user?.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    await switchRole(targetRole);
    // Force reload page to refresh dashboard states
    window.location.reload();
  };

  return (
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
          className={`hover:text-violet-400 transition-colors ${isLinkActive('/') ? 'text-violet-400' : 'text-slate-300'}`}
        >
          Home
        </Link>
        <Link 
          href="/products" 
          className={`hover:text-violet-400 transition-colors ${isLinkActive('/products') ? 'text-violet-400' : 'text-slate-300'}`}
        >
          Shop
        </Link>
        <Link 
          href="/categories" 
          className={`hover:text-violet-400 transition-colors ${isLinkActive('/categories') ? 'text-violet-400' : 'text-slate-300'}`}
        >
          Categories
        </Link>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-5">
        {/* Developer Bypass Switch */}
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs">
          <span className="text-slate-400">Dev Role:</span>
          <button 
            onClick={handleRoleToggle}
            className="flex items-center gap-1 font-bold text-violet-400 hover:text-violet-300 transition-colors"
            title="Click to switch role"
          >
            {user?.role === 'ADMIN' ? (
              <>
                Admin <ToggleRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Customer <ToggleLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Dashboard link if admin */}
        {isAdmin && (
          <Link 
            href="/admin" 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 rounded-lg text-xs font-semibold border border-violet-500/20 transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
        )}

        {/* Wishlist */}
        <Link href="/wishlist" className="relative p-2 text-slate-300 hover:text-pink-400 transition-colors">
          <Heart className="w-5 h-5" />
        </Link>

        {/* Cart */}
        <Link href="/cart" className="relative p-2 text-slate-300 hover:text-violet-400 transition-colors">
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-violet-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
              {itemCount}
            </span>
          )}
        </Link>

        {/* User profile dropdown info */}
        {user ? (
          <div className="flex items-center gap-3 border-l border-white/10 pl-5">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-medium text-slate-200">{user.name}</span>
              <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-200 text-sm font-semibold capitalize">
              {user.name[0]}
            </div>
          </div>
        ) : (
          <Link href="/login" className="p-2 text-slate-300 hover:text-violet-400 transition-colors">
            <User className="w-5 h-5" />
          </Link>
        )}
      </div>
    </nav>
  );
}
