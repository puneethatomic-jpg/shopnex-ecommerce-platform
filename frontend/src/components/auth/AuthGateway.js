'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, ArrowRight, Lock, Mail, ShoppingBag, Sparkles, KeyRound } from 'lucide-react';
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
    if (user) {
      setHasEntered(true);
    } else {
      setHasEntered(false);
    }
  }, [user]);

  if (hasEntered && user) {
    return null;
  }

  const handleQuickEnter = async (targetRole) => {
    setIsSubmitting(true);
    try {
      await switchRole(targetRole);
      sessionStorage.setItem('shopnex_portal_entered', 'true');
      setHasEntered(true);
      
      if (targetRole === 'ADMIN') {
        toast.success('Welcome! Entered Administrator Control Portal');
        router.push('/admin');
      } else {
        toast.success('Welcome! Entered Customer Shopping Storefront');
        router.push('/products');
      }
    } catch (err) {
      toast.error('Failed to authenticate portal access');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    handleQuickEnter(role);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-violet-500/30 rounded-3xl w-full max-w-xl p-8 flex flex-col gap-8 shadow-[0_0_60px_rgba(124,58,237,0.2)] relative text-left my-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-3 border-b border-white/5 pb-6">
          <div className="flex items-center gap-2">
            <div className="p-3 bg-violet-600 text-white rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">ShopNex</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight mt-2">
            Account Portal Access Required
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Please choose your account portal below before entering the platform.
          </p>
        </div>

        {/* Access Mode Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('portal')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'portal' ? 'bg-violet-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> One-Click Portal Selector
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'credentials' ? 'bg-violet-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Sign In / Register Form
          </button>
        </div>

        {/* Tab 1: One-Click Portal Cards */}
        {activeTab === 'portal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Card */}
            <div className="bg-slate-950 border border-violet-500/30 hover:border-violet-500/60 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all group shadow-md hover:shadow-[0_0_25px_rgba(124,58,237,0.2)]">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-600/20 text-violet-300 border border-violet-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white">Customer Account</h3>
                  <span className="text-[10px] text-slate-400 font-mono">customer@shopnex.com</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Enter customer shopping experience, catalog filters, cart checkout, wishlist, and AI recommendations.
              </p>

              <button
                onClick={() => handleQuickEnter('CUSTOMER')}
                disabled={isSubmitting}
                className="glow-btn w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
              >
                Enter as Customer <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Admin Card */}
            <div className="bg-slate-950 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all group shadow-md hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-600/20 text-amber-300 border border-amber-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white">Administrator Account</h3>
                  <span className="text-[10px] text-slate-400 font-mono">admin@shopnex.com</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Enter Administrator control panel, analytics charts, inventory CRUD, coupon codes, and order tracking logs.
              </p>

              <button
                onClick={() => handleQuickEnter('ADMIN')}
                disabled={isSubmitting}
                className="glow-btn w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(245,158,11,0.3)]"
              >
                Enter as Admin <ArrowRight className="w-4 h-4" />
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
              className="glow-btn mt-2 w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
            >
              Authenticate & Open Portal <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
