'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const fallbackUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
  const imgList = images && images.length > 0 ? images : [{ url: fallbackUrl }];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div className="relative aspect-square w-full bg-slate-950 rounded-2xl border border-white/5 overflow-hidden group">
        <Image 
          src={imgList[activeIdx]?.url || fallbackUrl} 
          alt="Product detail"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>

      {/* Thumbnails list */}
      {imgList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {imgList.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 aspect-square rounded-xl overflow-hidden border bg-slate-950 transition-all ${
                activeIdx === idx 
                  ? 'border-violet-500 ring-2 ring-violet-500/20' 
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <Image 
                src={img.url} 
                alt="Product thumbnail"
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
