'use client';

import React, { useState } from 'react';
import { useCart } from '@/store/CartContext';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, Tag, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

export default function CartDrawer() {
  const { 
    isDrawerOpen, 
    closeDrawer, 
    cartItems, 
    itemCount, 
    subtotal, 
    shippingFee, 
    taxAmount, 
    total, 
    updateQuantity, 
    removeFromCart,
    applyCoupon,
    coupon,
    discountAmount
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  // Free delivery threshold calculations ($500)
  const FREE_SHIPPING_THRESHOLD = 500;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      await applyCoupon(couponInput.trim().toUpperCase());
      toast.success('Promo coupon applied!');
      setCouponInput('');
    } catch (err) {
      toast.error(err.message || 'Invalid coupon code');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex justify-end transition-opacity">
      <div className="bg-slate-900 border-l border-white/10 w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-600/20 text-violet-400 border border-violet-500/20 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-white tracking-tight">Your Mini Cart</h3>
              <span className="text-[10px] text-slate-400">{itemCount} items in cart</span>
            </div>
          </div>

          <button 
            onClick={closeDrawer}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-b border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Truck className="w-4 h-4 text-violet-400" />
              {amountRemaining === 0 ? (
                <span className="text-emerald-400 font-bold">🎉 Congratulations! You unlocked Free Shipping!</span>
              ) : (
                <span>Add <strong className="text-violet-400">${amountRemaining.toFixed(2)}</strong> more for <strong className="text-white">Free Shipping</strong></span>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-500">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                amountRemaining === 0 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-violet-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Items List Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <ShoppingBag className="w-12 h-12 text-slate-700" />
              <span className="text-xs font-semibold text-slate-400">Your shopping cart is empty</span>
              <button 
                onClick={closeDrawer}
                className="mt-2 text-xs text-violet-400 hover:underline font-bold"
              >
                Browse Shop Catalogue
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product;
              const imageUrl = product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';
              const finalPrice = product.price - product.discount;

              return (
                <div key={item.id} className="flex gap-4 p-3 bg-slate-950 border border-white/5 rounded-2xl items-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/5">
                    <Image src={imageUrl} alt={product.title} fill className="object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{product.title}</h4>
                    <span className="text-xs font-bold text-violet-400">${finalPrice.toFixed(2)}</span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center border border-white/10 bg-slate-900 rounded-lg px-1 text-[10px]">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-white min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= product.stock}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors ml-auto"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Subtotal & Direct Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-slate-950/80 flex flex-col gap-4">
            {/* Promo Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Coupon code (e.g. WELCOME10)" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none uppercase"
                />
              </div>
              <button 
                type="submit"
                disabled={applying || !couponInput.trim()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-30"
              >
                Apply
              </button>
            </form>

            {coupon && (
              <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-semibold">
                <span>Promo Coupon Applied ({coupon.code})</span>
                <span>-{coupon.discount}%</span>
              </div>
            )}

            {/* Calculations */}
            <div className="flex flex-col gap-2 text-xs border-t border-white/5 pt-3">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Estimated Delivery</span>
                <span className="text-white font-semibold">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-white/5 pt-2">
                <span>Total</span>
                <span className="text-violet-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Direct Checkout CTA */}
            <Link 
              href="/checkout"
              onClick={closeDrawer}
              className="glow-btn w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
