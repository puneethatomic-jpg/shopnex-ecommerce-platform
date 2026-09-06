'use client';

import React, { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import { X, User, ShieldCheck, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthModal({ isOpen, onClose }) {
  const { login, switchRole } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' | 'ADMIN'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (role === 'ADMIN') {
        await switchRole('ADMIN');
        toast.success('Signed in as Administrator!');
        onClose();
        router.push('/admin');
      } else {
        await switchRole('CUSTOMER');
        toast.success(mode === 'login' ? 'Signed in successfully!' : 'Account registered successfully!');
        onClose();
        router.push('/profile');
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 flex flex-col gap-6 shadow-2xl relative">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-1 pr-6">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-violet-600/20 border border-violet-500/20 text-violet-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {mode === 'login' 
              ? 'Select your account role to access your personalized portal' 
              : 'Join ShopNex for personalized AI recommendations and order tracking'}
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 text-xs font-semibold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              mode === 'login' ? 'bg-violet-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              mode === 'register' ? 'bg-violet-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Role Selector: Customer vs Administrator */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Account Portal</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                role === 'CUSTOMER'
                  ? 'border-violet-500 bg-violet-600/10 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                  : 'border-white/10 bg-slate-950 text-slate-400 hover:border-white/20'
              }`}
            >
              <User className={`w-5 h-5 ${role === 'CUSTOMER' ? 'text-violet-400' : 'text-slate-500'}`} />
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight">Customer</span>
                <span className="text-[9px] text-slate-400">Shopping Portal</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                role === 'ADMIN'
                  ? 'border-violet-500 bg-violet-600/10 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                  : 'border-white/10 bg-slate-950 text-slate-400 hover:border-white/20'
              }`}
            >
              <ShieldCheck className={`w-5 h-5 ${role === 'ADMIN' ? 'text-violet-400' : 'text-slate-500'}`} />
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight">Admin</span>
                <span className="text-[9px] text-slate-400">Dashboard Control</span>
              </div>
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          {mode === 'register' && (
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'ADMIN' ? 'Admin User' : 'John Doe'}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'ADMIN' ? 'admin@shopnex.com' : 'user@example.com'}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="glow-btn mt-3 w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_15px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : mode === 'login' ? `Sign In as ${role === 'ADMIN' ? 'Admin' : 'Customer'}` : `Create ${role === 'ADMIN' ? 'Admin' : 'Customer'} Account`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
