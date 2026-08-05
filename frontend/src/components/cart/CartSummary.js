'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/CartContext';
import { Ticket, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CartSummary({ showCheckoutBtn = true }) {
  const { 
    subtotal, 
    discountAmount, 
    shippingFee, 
    taxAmount, 
    total, 
    coupon, 
    couponError, 
    applyCoupon, 
    removeCoupon 
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      setLoading(true);
      await applyCoupon(couponCode.trim());
      toast.success(`Coupon "${couponCode}" applied successfully!`);
      setCouponCode('');
    } catch (err) {
      toast.error(err.message || 'Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
      <h3 className="text-base font-bold text-white">Order Summary</h3>

      {/* Summary figures */}
      <div className="flex flex-col gap-4 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-400">
            <span className="flex items-center gap-1.5">
              Discount {coupon && `(${coupon.code})`}
            </span>
            <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-400">
          <span>Shipping Estimate</span>
          <span className="font-semibold text-slate-200">
            {shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span>Tax</span>
          <span className="font-semibold text-slate-200">${taxAmount.toFixed(2)}</span>
        </div>

        <div className="border-t border-white/5 pt-4 flex items-center justify-between text-sm font-bold text-white">
          <span>Total</span>
          <span className="text-base text-violet-400">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon input */}
      {showCheckoutBtn && (
        <div className="border-t border-white/5 pt-5">
          {coupon ? (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-emerald-400">
              <span className="flex items-center gap-2 font-medium">
                <Ticket className="w-4 h-4" />
                {coupon.code} (-{coupon.discount}%)
              </span>
              <button 
                onClick={removeCoupon}
                className="p-1 hover:text-emerald-200 transition-colors"
                title="Remove Coupon"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Promo Code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={loading}
                className="flex-1 px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
              />
              <button 
                type="submit"
                disabled={loading || !couponCode.trim()}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-semibold disabled:opacity-50 transition-all"
              >
                Apply
              </button>
            </form>
          )}
          {couponError && (
            <p className="text-[10px] text-red-400 mt-2 ml-1">{couponError}</p>
          )}
        </div>
      )}

      {/* Checkout CTA */}
      {showCheckoutBtn && (
        <Link 
          href="/checkout"
          className="glow-btn block text-center w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_20px_rgba(124,58,237,0.25)]"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
