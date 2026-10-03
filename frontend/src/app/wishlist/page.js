'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/CartContext';
import { useWishlist } from '@/store/WishlistContext';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product, 1);
      removeFromWishlist(product.id || product.slug);
      toast.success(`${product.title} moved to cart!`);
    } catch (err) {
      toast.error('Failed to move product to cart');
    }
  };

  return (
    <div className="px-6 md:px-12 py-12 max-w-5xl mx-auto w-full flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Wishlist</h1>
        <span className="text-xs text-slate-500 mt-0.5">Products you saved for later ({wishlist.length} items)</span>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/10 border border-white/5 rounded-2xl p-6">
          <Heart className="w-10 h-10 text-slate-600 mb-4" />
          <h3 className="text-sm font-semibold text-slate-400">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">Tap the heart icon on any product page to save it to your wishlist.</p>
          <Link 
            href="/products" 
            className="glow-btn mt-6 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item.product || item;
            const finalPrice = Math.max(0, (product.price || 0) - (product.discount || 0));
            const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
            const prodId = product.id || product.slug || item.id;

            return (
              <div key={item.id || prodId} className="group relative flex flex-col bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden hover:border-violet-500/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-square bg-slate-950">
                  <Image 
                    src={imageUrl} 
                    alt={product.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                  <button 
                    onClick={() => removeFromWishlist(prodId)}
                    className="absolute top-3 right-3 p-2 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 text-slate-400 hover:text-red-400 hover:scale-105 transition-all"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{product.title}</h4>
                  <span className="text-sm font-bold text-violet-400 mt-2">${finalPrice.toFixed(2)}</span>
                  
                  {/* Action row */}
                  <button 
                    onClick={() => handleMoveToCart(product)}
                    className="glow-btn mt-4 w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
