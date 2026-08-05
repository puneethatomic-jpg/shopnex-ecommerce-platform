'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Trash2, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/AuthContext';

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiry, setExpiry] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  // Fetch coupons
  const { data: couponRes, isLoading } = useQuery({
    queryKey: ['adminCouponsList'],
    queryFn: () => api.get('/coupons'),
    enabled: isAdmin,
  });

  const coupons = couponRes?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/coupons', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCouponsList']);
      setModalOpen(false);
      setCode('');
      setDiscount('');
      setExpiry('');
      setUsageLimit('');
      toast.success('Coupon created successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create coupon');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCouponsList']);
      toast.success('Coupon deleted successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete coupon');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      code,
      discount: parseFloat(discount),
      expiry: new Date(expiry).toISOString(),
      usageLimit: parseInt(usageLimit),
    });
  };

  if (!isAdmin) {
    return (
      <div className="px-6 md:px-12 py-24 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-violet-400 mb-4" />
        <h2 className="text-xl font-bold text-white tracking-tight">Admin Portal Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto w-full flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tight">Coupons Management</h1>
          <span className="text-xs text-slate-500 mt-0.5">Manage promo discount codes and usage tracking</span>
        </div>

        <button 
          onClick={() => setModalOpen(true)}
          className="glow-btn px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Grid listing */}
      <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 text-xs">
        {coupons.length === 0 ? (
          <span className="text-slate-500 py-4">No coupons configured.</span>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3">Code</th>
                  <th className="pb-3">Discount %</th>
                  <th className="pb-3">Usage Limit</th>
                  <th className="pb-3">Expiration Date</th>
                  <th className="pb-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-bold text-violet-300 font-mono">{c.code}</td>
                    <td className="py-3.5 text-slate-200 font-bold">{c.discount}% Off</td>
                    <td className="py-3.5 text-slate-400">{c.usageLimit} left</td>
                    <td className="py-3.5 text-slate-400">{new Date(c.expiry).toLocaleDateString()}</td>
                    <td className="py-3.5 text-right">
                      <button 
                        onClick={() => {
                          if (confirm(`Delete coupon "${c.code}"?`)) deleteMutation.mutate(c.id);
                        }}
                        className="p-1.5 bg-white/5 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal create Coupon */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create Coupon</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Coupon Code</label>
                <input 
                  type="text" 
                  required 
                  value={code} 
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME10"
                  className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Discount (%)</label>
                  <input 
                    type="number" 
                    required 
                    min={1}
                    max={100}
                    value={discount} 
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="10"
                    className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Usage Limit</label>
                  <input 
                    type="number" 
                    required 
                    min={1}
                    value={usageLimit} 
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="100"
                    className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-300">Expiration Date</label>
                <input 
                  type="date" 
                  required 
                  value={expiry} 
                  onChange={(e) => setExpiry(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                disabled={createMutation.isPending}
                className="glow-btn mt-4 w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
