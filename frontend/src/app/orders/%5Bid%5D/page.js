'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Image from 'next/image';
import { Truck, ArrowLeft, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
  const { id: orderId } = useParams();

  const { data: orderRes, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.get(`/orders/${orderId}`),
  });

  const order = orderRes?.data;
  const items = order?.items || [];

  // Calculate subtotal
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const getStepActive = (status, stepName) => {
    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIdx = statuses.indexOf(status);
    const stepIdx = statuses.indexOf(stepName);
    return currentIdx >= stepIdx;
  };

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-20 max-w-4xl mx-auto w-full flex flex-col gap-10 animate-pulse text-xs">
        <div className="bg-slate-900 h-10 w-1/4 rounded-full"></div>
        <div className="bg-slate-900 h-60 w-full rounded-2xl"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <span className="text-sm font-semibold text-slate-400">Order not found</span>
        <Link href="/orders" className="text-xs text-violet-400 mt-2 hover:underline">
          Return to orders logs
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto w-full flex flex-col gap-10">
      {/* Back CTA */}
      <div>
        <Link href="/orders" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to orders logs
        </Link>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-1 text-xs">
          <h1 className="text-2xl font-bold text-white tracking-tight">Order Details</h1>
          <span className="text-slate-500">Order ID: <span className="font-mono text-slate-300 font-bold">{order.id}</span></span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-violet-400" /> {new Date(order.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-violet-400" /> Invoice summary</span>
        </div>
      </div>

      {/* Delivery Progress Bar */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4 text-violet-400" />
          Delivery Tracker
        </h3>

        <div className="grid grid-cols-4 gap-2 relative mt-4">
          {/* Tracking steps */}
          {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, idx) => {
            const active = getStepActive(order.status, step);
            return (
              <div key={step} className="flex flex-col items-center text-center gap-2 relative z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                  active 
                    ? 'border-violet-400 bg-violet-600/20 text-violet-300' 
                    : 'border-slate-800 bg-slate-950 text-slate-600'
                }`}>
                  {active ? <CheckCircle2 className="w-4.5 h-4.5" /> : idx + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  active ? 'text-violet-300' : 'text-slate-600'
                }`}>{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ordered items */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-slate-900/20 border border-white/5 rounded-2xl p-6 h-fit text-xs">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Order Items</h3>
          
          {items.map((it) => {
            const img = it.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
            return (
              <div key={it.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 aspect-square rounded-lg overflow-hidden border border-white/10 bg-slate-950 flex-shrink-0">
                    <Image 
                      src={img} 
                      alt={it.product.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">{it.product.title}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Quantity: {it.quantity}</span>
                  </div>
                </div>

                <span className="font-bold text-white">${(it.price * it.quantity).toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* Pricing breakdown */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-5 text-xs">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Costs Summary</h3>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
            </div>
            
            {order.total - subtotal - order.shippingFee - order.tax < 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Coupon Discount</span>
                <span className="font-semibold">-${Math.abs(order.total - subtotal - order.shippingFee - order.tax).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>Shipping Fee</span>
              <span className="font-semibold text-slate-200">
                {order.shippingFee === 0 ? 'Free' : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Tax</span>
              <span className="font-semibold text-slate-200">${order.tax.toFixed(2)}</span>
            </div>

            <div className="border-t border-white/5 pt-3.5 flex justify-between text-sm font-bold text-white">
              <span>Total Paid</span>
              <span className="text-violet-400">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
