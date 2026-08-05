'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { data: orderRes, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders'),
  });

  const orders = orderRes?.data || [];

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-20 max-w-3xl mx-auto w-full flex flex-col gap-6 animate-pulse text-xs">
        <div className="bg-slate-900 h-10 w-1/4 rounded-full"></div>
        <div className="bg-slate-900 h-32 w-full rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-3xl mx-auto w-full flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Order Logs</h1>
        <span className="text-xs text-slate-500 mt-0.5">Track your shopping history ({orders.length} orders)</span>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/10 border border-white/5 rounded-2xl p-6">
          <ClipboardList className="w-10 h-10 text-slate-600 mb-4" />
          <h3 className="text-sm font-semibold text-slate-400">No orders found</h3>
          <Link href="/products" className="text-xs text-violet-400 mt-2 hover:underline">
            Go to Catalogue
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-slate-900/20 border border-white/5 hover:border-violet-500/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-all">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-white">Order #{ord.id.slice(0, 8)}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ord.status === 'DELIVERED' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : ord.status === 'CANCELLED'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>{ord.status}</span>
                </div>
                <span className="text-[10px] text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-slate-500">Charged Amount</span>
                  <span className="font-bold text-violet-400">${ord.total.toFixed(2)}</span>
                </div>
                <Link 
                  href={`/orders/${ord.id}`}
                  className="px-4.5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-[10px] font-bold transition-all shadow-[0_2px_10px_rgba(124,58,237,0.2)]"
                >
                  Track Package
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
