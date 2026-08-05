'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { id, title, slug, price, discount, images, brand, reviews } = product;

  const imageUrl = images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
  const finalPrice = price - discount;
  const ratingAvg = reviews?.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(id, 1);
      toast.success(`${title} added to cart`);
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart');
    }
  };

  return (
    <div className="group relative flex flex-col bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-500">
      {/* Product Image */}
      <Link href={`/products/${id}`} className="relative block aspect-square w-full overflow-hidden bg-slate-950">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Wishlist Icon */}
        <button 
          className="absolute top-4 right-4 p-2 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 text-slate-300 hover:text-pink-400 hover:scale-110 hover:border-pink-500/20 transition-all duration-300"
          onClick={(e) => {
            e.preventDefault();
            toast.success(`${title} added to wishlist`);
          }}
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-4 left-4 px-2.5 py-1 bg-violet-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
            Save ${discount}
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
          {brand?.name || 'ShopNex'}
        </span>
        <Link href={`/products/${id}`} className="mt-1 text-sm font-semibold text-slate-100 hover:text-violet-400 transition-colors line-clamp-1">
          {title}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-slate-200">{ratingAvg}</span>
          <span className="text-[10px] text-slate-500">({reviews?.length || 0} reviews)</span>
        </div>

        {/* Price & Cart CTA */}
        <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
          <div className="flex flex-col">
            {discount > 0 && (
              <span className="text-xs text-slate-500 line-through">${price.toFixed(2)}</span>
            )}
            <span className="text-base font-bold text-white">${finalPrice.toFixed(2)}</span>
          </div>

          <button 
            onClick={handleAddToCart}
            className="glow-btn p-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl border border-violet-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
