'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/store/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import RecommendationSection from '@/components/product/RecommendationSection';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export default function CartPage() {
  const { cartItems, itemCount, loading } = useCart();

  return (
    <div className="px-6 md:px-12 py-12 max-w-5xl mx-auto w-full flex flex-col gap-12">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Shopping Cart</h1>
        <span className="text-xs text-slate-500 mt-0.5">Manage your selected items ({itemCount} items)</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/10 border border-white/5 rounded-2xl p-6">
          <ShoppingBag className="w-10 h-10 text-slate-600 mb-4" />
          <h3 className="text-sm font-semibold text-slate-400">Your cart is empty</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">Looks like you haven't added anything to your cart yet. Let's find some great products!</p>
          <Link 
            href="/products" 
            className="glow-btn mt-6 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_15px_rgba(124,58,237,0.25)] flex items-center gap-2"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4 bg-slate-900/20 border border-white/5 rounded-2xl p-6 h-fit">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Checkout Summary */}
            <CartSummary />
          </div>

          {/* AI Recommendations */}
          <div className="border-t border-white/5 pt-10">
            <RecommendationSection 
              title="You Might Also Like"
              subtitle="Personalized recommendations matching items in your cart"
              endpoint="/products/recommendations/user"
              icon={Sparkles}
            />
          </div>
        </div>
      )}
    </div>
  );
}
