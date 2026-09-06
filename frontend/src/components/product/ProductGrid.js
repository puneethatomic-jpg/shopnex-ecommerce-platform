'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-zinc-900/40 p-4 border border-zinc-800/50">
      <div className="aspect-square w-full rounded-xl bg-zinc-800/60" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-zinc-800/80" />
        <div className="h-3 w-1/2 rounded bg-zinc-800/40" />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="h-5 w-16 rounded bg-zinc-800/80" />
        <div className="h-8 w-20 rounded-lg bg-zinc-800" />
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-sm font-semibold text-slate-400">No products found</span>
        <p className="text-xs text-slate-500 mt-1">Try modifying your query, search keywords, or filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
