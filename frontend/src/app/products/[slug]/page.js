'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductGallery from '@/components/product/ProductGallery';
import { Star, ShieldCheck, Heart, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { slug: productId } = useParams();
  const queryClient = useQueryClient();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Fetch product detail
  const { data: detailRes, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.get(`/products/${productId}`),
  });

  const product = detailRes?.data;
  const finalPrice = product ? product.price - product.discount : 0;
  const ratingAvg = product?.reviews?.length
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : '5.0';

  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: (newReview) => api.post('/reviews', newReview),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', productId]);
      setComment('');
      setRating(5);
      toast.success('Review submitted successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit review');
    },
  });

  const handleQtyChange = (val) => {
    if (val < 1 || val > (product?.stock || 1)) return;
    setQuantity(val);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.title} added to cart`);
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReviewMutation.mutate({
      productId: product.id,
      rating,
      comment: comment.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-20 max-w-5xl mx-auto w-full flex flex-col gap-10 animate-pulse text-xs">
        <div className="flex gap-4">
          <div className="bg-slate-900 w-1/2 aspect-square rounded-2xl"></div>
          <div className="w-1/2 flex flex-col gap-6">
            <div className="bg-slate-900 h-6 w-3/4 rounded-full"></div>
            <div className="bg-slate-900 h-4 w-1/4 rounded-full"></div>
            <div className="bg-slate-900 h-8 w-1/3 rounded-full mt-4"></div>
            <div className="bg-slate-900 h-20 w-full rounded-2xl mt-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <span className="text-sm font-semibold text-slate-400">Product not found</span>
        <Link href="/products" className="text-xs text-violet-400 mt-2 hover:underline">
          Return to catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 max-w-5xl mx-auto w-full flex flex-col gap-16">
      {/* Back button */}
      <div>
        <Link href="/products" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to catalogue
        </Link>
      </div>

      {/* Detail Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Gallery */}
        <ProductGallery images={product.images} />

        {/* Right: Info */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              {product.brand?.name || 'ShopNex'}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
              {product.title}
            </h1>
            
            {/* Rating summary */}
            <div className="flex items-center gap-1.5 mt-3 text-xs">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(parseFloat(ratingAvg)) 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-slate-600'
                    }`} 
                  />
                ))}
              </div>
              <span className="font-bold text-slate-200">{ratingAvg}</span>
              <span className="text-slate-500">({product.reviews?.length || 0} customer reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 border-t border-b border-white/5 py-4">
            <span className="text-2xl font-bold text-violet-400">${finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-slate-500 line-through">${product.price.toFixed(2)}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-600/20 text-violet-300 border border-violet-500/20 rounded-md">
                  Save ${product.discount.toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Metadata SKU & Stock */}
          <div className="flex flex-col gap-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">SKU:</span>
              <span className="font-mono">{product.sku}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-emerald-400 font-bold">{product.stock} units in stock</span>
              ) : (
                <span className="text-red-400 font-bold">Out of stock</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-xs text-slate-400 leading-relaxed">
            <h4 className="font-semibold text-white mb-1.5">Description</h4>
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector & Cart CTA */}
          {product.stock > 0 && (
            <div className="flex flex-col gap-4 border-t border-white/5 pt-6 mt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-300">Quantity</span>
                <div className="flex items-center border border-white/10 bg-slate-950 rounded-xl px-1.5 py-1 text-xs">
                  <button 
                    onClick={() => handleQtyChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-bold text-white min-w-[28px] text-center">{quantity}</span>
                  <button 
                    onClick={() => handleQtyChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  onClick={handleAddToCart}
                  className="glow-btn flex-1 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <button 
                  className="p-3.5 border border-white/10 hover:border-pink-500/30 hover:text-pink-400 rounded-xl transition-all"
                  title="Add to Wishlist"
                >
                  <Heart className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews & Submit review form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 border-t border-white/5 pt-16">
        {/* Reviews List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h3 className="text-base font-bold text-white">Customer Reviews ({product.reviews?.length || 0})</h3>
          
          {product.reviews?.length === 0 ? (
            <span className="text-xs text-slate-500">No reviews yet for this product. Be the first to write one!</span>
          ) : (
            <div className="flex flex-col gap-4">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{rev.user?.name || 'Customer'}</span>
                    <span className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${
                          i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`} 
                      />
                    ))}
                  </div>

                  <p className="text-slate-400 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 h-fit flex flex-col gap-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Write a Review</h3>
          
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 text-xs">
            {/* Star selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Rating</label>
              <div className="flex gap-1.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-5 h-5 ${
                        val <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Comment</label>
              <textarea 
                rows={4}
                placeholder="What did you think about the product?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={addReviewMutation.isPending || !comment.trim()}
              className="glow-btn w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
