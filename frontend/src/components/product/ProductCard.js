'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Plus, Sparkles } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const { id, title, slug, price, discount, images, brand, reviews } = product || {};

  const primaryImage = images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
  const secondaryImage = images?.[1]?.url || primaryImage;

  const finalPrice = price - discount;
  const ratingAvg = reviews?.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(id, 1);
      toast.success(`${title} added to mini cart!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success(`${title} saved to wishlist!`, {
        icon: '❤️',
      });
    } else {
      toast.info(`Removed from wishlist`);
    }
  };

  const productUrl = `/products/${slug || id}`;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col bg-slate-900/60 rounded-2xl border border-white/5 overflow-hidden hover:border-violet-500/40 hover:shadow-[0_20px_35px_-10px_rgba(139,92,246,0.25)] transition-all duration-300"
    >
      {/* Product Image Box with Crossfade */}
      <Link href={productUrl} className="relative block aspect-square w-full overflow-hidden bg-slate-950">
        {/* Primary Image */}
        <Image 
          src={primaryImage} 
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
        />

        {/* Secondary Angle Image on Hover */}
        <Image 
          src={secondaryImage} 
          alt={`${title} secondary view`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        
        {/* Animated Wishlist Heart Button */}
        <motion.button 
          onClick={toggleWishlist}
          whileTap={{ scale: 0.75 }}
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-full border backdrop-blur-md transition-colors duration-300 z-10 ${
            isWishlisted 
              ? 'bg-pink-500/90 text-white border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]' 
              : 'bg-slate-950/70 border-white/10 text-slate-400 hover:text-pink-400'
          }`}
          aria-label="Add to wishlist"
        >
          <motion.svg
            animate={isWishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className={`w-4 h-4 ${isWishlisted ? 'fill-white stroke-white' : 'fill-none stroke-current'}`}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </motion.svg>
        </motion.button>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-violet-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-[0_4px_12px_rgba(124,58,237,0.4)] z-10">
            Save ${discount}
          </span>
        )}

        {/* Quick Add Floating Button */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <motion.button
            onClick={handleAddToCart}
            disabled={adding}
            initial={{ opacity: 0, y: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2.5 px-4 bg-slate-900/90 hover:bg-violet-600 border border-violet-500/30 hover:border-violet-400 text-white text-xs font-semibold rounded-xl backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-violet-400 group-hover:text-white" />
            <span>{adding ? 'Adding...' : 'Quick Add +'}</span>
          </motion.button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {brand?.name || 'ShopNex'}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-slate-200">{ratingAvg}</span>
          </div>
        </div>

        <Link href={productUrl} className="mt-1.5 text-sm font-semibold text-slate-100 hover:text-violet-300 transition-colors line-clamp-1">
          {title}
        </Link>

        {/* Price & Primary CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex flex-col">
            {discount > 0 && (
              <span className="text-[11px] text-slate-500 line-through">${price.toFixed(2)}</span>
            )}
            <span className="text-base font-bold text-violet-400">${finalPrice.toFixed(2)}</span>
          </div>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="p-2.5 bg-white/5 hover:bg-violet-600 text-slate-300 hover:text-white rounded-xl border border-white/10 hover:border-violet-500/40 transition-all duration-300"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
