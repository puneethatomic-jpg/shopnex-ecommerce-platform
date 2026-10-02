'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, ArrowRight, Lock, Mail, ShoppingBag, Sparkles, KeyRound, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthGateway() {
  const { user, switchRole } = useAuth();
  const router = useRouter();

  const [hasEntered, setHasEntered] = useState(false);
  const [activeTab, setActiveTab] = useState('portal'); // 'portal' | 'credentials'
  const [role, setRole] = useState('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionEntered = sessionStorage.getItem('shopnex_portal_entered') === 'true';
      const localEntered = localStorage.getItem('shopnex_portal_entered') === 'true';
      if (sessionEntered || localEntered || user) {
        setHasEntered(true);
      }
    }
  }, [user]);

  if (hasEntered) {
    return null;
  }

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shopnex_portal_entered', 'true');
      localStorage.setItem('shopnex_portal_entered', 'true');
    }
    setHasEntered(true);
  };

  const handleQuickEnter = async (targetRole) => {
    setIsSubmitting(true);
    try {
      await switchRole(targetRole);
    } catch (err) {
      console.warn('Switch role warning:', err);
    } finally {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('shopnex_portal_entered', 'true');
        localStorage.setItem('shopnex_portal_entered', 'true');
      }
      setHasEntered(true);
      setIsSubmitting(false);

      if (targetRole === 'ADMIN') {
        toast.success('Welcome! Entered Administrator Control Portal');
        router.push('/admin');
      } else {
        toast.success('Welcome! Entered Customer Storefront');
        router.push('/');
      }
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    await handleQuickEnter(role);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-violet-500/30 rounded-3xl w-full max-w-xl p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 shadow-[0_0_60px_rgba(124,58,237,0.2)] relative text-left my-auto">
        {/* Skip / Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-1.5 text-xs z-10"
          title="Browse as Guest"
        >
          <span className="hidden sm:inline">Browse as Guest</span>
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-3 border-b border-white/5 pb-5 sm:pb-6 pr-8 sm:pr-0">
          <div className="flex items-center gap-2">
            <div className="p-2.5 sm:p-3 bg-violet-600 text-white rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">ShopNex</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
            Choose Your Account Portal
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Enter as a Customer or Admin, or browse the store directly as a guest.
          </p>
        </div>

        {/* Access Mode Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('portal')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'portal' ? 'bg-violet-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> One-Click Portal Selector
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'credentials' ? 'bg-violet-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Sign In / Register Form
          </button>
        </div>

        {/* Tab 1: One-Click Portal Cards */}
        {activeTab === 'portal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Customer Card */}
            <div className="bg-slate-950 border border-violet-500/30 hover:border-violet-500/60 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 sm:gap-6 transition-all group shadow-md hover:shadow-[0_0_25px_rgba(124,58,237,0.2)]">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-600/20 text-violet-300 border border-violet-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white">Customer Account</h3>
                  <span className="text-[10px] text-slate-400 font-mono">customer@shopnex.com</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Full customer shopping experience, catalog filters, cart checkout, wishlist, and AI recommendations.
              </p>

              <button
                onClick={() => handleQuickEnter('CUSTOMER')}
                disabled={isSubmitting}
                className="glow-btn w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(124,58,237,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? 'Entering...' : 'Enter as Customer'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Admin Card */}
            <div className="bg-slate-950 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 sm:gap-6 transition-all group shadow-md hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-600/20 text-amber-300 border border-amber-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white">Administrator Account</h3>
                  <span className="text-[10px] text-slate-400 font-mono">admin@shopnex.com</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Administrator control panel, live analytics charts, inventory CRUD, coupon codes, and order tracking logs.
              </p>

              <button
                onClick={() => handleQuickEnter('ADMIN')}
                disabled={isSubmitting}
                className="glow-btn w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(245,158,11,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? 'Entering...' : 'Enter as Admin'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Custom Credentials Form */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Account Portal</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    role === 'CUSTOMER' ? 'border-violet-500 bg-violet-600/10 text-white' : 'border-white/10 bg-slate-950 text-slate-400'
                  }`}
                >
                  <User className="w-4 h-4 text-violet-400" /> Customer Account
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    role === 'ADMIN' ? 'border-amber-500 bg-amber-600/10 text-white' : 'border-white/10 bg-slate-950 text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Admin Account
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'ADMIN' ? 'admin@shopnex.com' : 'customer@shopnex.com'}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="glow-btn mt-2 w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(124,58,237,0.3)] disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Authenticate & Open Portal'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Bottom Guest Action */}
        <div className="flex items-center justify-center pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs text-slate-400 hover:text-violet-400 font-semibold transition-colors flex items-center gap-1.5 py-1"
          >
            <span>Continue to Storefront as Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
