'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { toast } from 'sonner';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { id, quantity, product } = item;
  const { title, price, discount, images, brand } = product;

  const imageUrl = images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
  const finalPrice = price - discount;

  const handleQtyChange = async (newQty) => {
    if (newQty < 1) return;
    try {
      await updateQuantity(id, newQty);
      toast.success('Cart updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(id);
      toast.success(`${title} removed from cart`);
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0">
      {/* Product Image */}
      <div className="relative w-20 aspect-square rounded-xl overflow-hidden border border-white/5 bg-slate-950 flex-shrink-0">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{brand?.name || 'ShopNex'}</span>
        <h4 className="text-sm font-semibold text-white line-clamp-1 mt-0.5">{title}</h4>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm font-bold text-white">${finalPrice.toFixed(2)}</span>
          {discount > 0 && (
            <span className="text-xs text-slate-500 line-through">${price.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Quantity editor */}
      <div className="flex items-center border border-white/10 bg-slate-950 rounded-xl px-1.5 py-1">
        <button 
          onClick={() => handleQtyChange(quantity - 1)}
          disabled={quantity <= 1}
          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="px-3 text-xs font-bold text-white min-w-[24px] text-center">{quantity}</span>
        <button 
          onClick={() => handleQtyChange(quantity + 1)}
          className="p-1 text-slate-400 hover:text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Price total & Remove button */}
      <div className="flex flex-col items-end gap-2 ml-4">
        <span className="text-sm font-bold text-white">
          ${(finalPrice * quantity).toFixed(2)}
        </span>
        <button 
          onClick={handleRemove}
          className="p-1 text-slate-500 hover:text-red-400 hover:scale-105 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
