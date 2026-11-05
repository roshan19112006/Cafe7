'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Flame, Star, ZoomIn, Sparkles } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { RESTAURANT_INFO } from '@/data/menu';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className="group relative bg-[#131620] hover:bg-[#181c2b] active:scale-[0.98] border border-[#23293a] hover:border-[#f3b73e]/50 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-card hover:shadow-glow-gold/10"
    >
      {/* Top Image Section */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] bg-[#1a1e2c] overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton-shimmer z-10" />
        )}

        {/* Actual Cafe 7 Image */}
        {!imageError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#181c2a] text-gray-400 p-4 text-center">
            <span className="text-2xl mb-1">🍽️</span>
            <span className="text-xs font-medium text-gray-300">{item.name}</span>
          </div>
        )}

        {/* Subtle Dark Gradient Overlay for Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Dietary Icon (Veg / Non-Veg Standard FSSAI) */}
        <div className="absolute top-2.5 left-2.5 z-10 bg-[#0e1017]/90 backdrop-blur-sm p-1 rounded-md border border-[#272e42] shadow-sm">
          {item.isVeg ? (
            <div
              className="w-4 h-4 border-2 border-emerald-500 flex items-center justify-center rounded-sm bg-black/40"
              title="Vegetarian"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          ) : (
            <div
              className="w-4 h-4 border-2 border-rose-500 flex items-center justify-center rounded-sm bg-black/40"
              title="Non-Vegetarian"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
          )}
        </div>

        {/* Badges (Top Right) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1.5">
          {item.badge && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#f3b73e] text-black shadow-md shadow-black/50">
              <Sparkles className="w-2.5 h-2.5" />
              {item.badge}
            </span>
          )}
          {item.isSpicy && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 backdrop-blur-sm shadow-sm">
              <Flame className="w-2.5 h-2.5 text-rose-400" />
              Spicy
            </span>
          )}
        </div>

        {/* Quick Preview Hint */}
        <div className="absolute bottom-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-black/80 backdrop-blur-md text-[#f3b73e] border border-[#f3b73e]/40 px-2 py-1 rounded-lg shadow-md">
            <ZoomIn className="w-3 h-3" />
            View Photo
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Header row: Dish Name & Price */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#f3b73e] transition-colors leading-snug">
              {item.name}
            </h3>
            <span className="text-sm sm:text-base font-extrabold text-[#f3b73e] whitespace-nowrap font-mono tracking-tight bg-[#222739]/60 px-2 py-0.5 rounded-lg border border-[#30374e]">
              {RESTAURANT_INFO.currency}{item.price}
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Subcategory tag & Dine-in note */}
        <div className="pt-2 border-t border-[#1d2231] flex items-center justify-between text-[11px] text-gray-400">
          <span className="truncate max-w-[170px] text-gray-400">
            {item.subCategory || item.category}
          </span>
          <span className="text-[#f3b73e]/80 flex items-center gap-1 group-hover:underline">
            <span>Details</span>
            <span className="text-xs">→</span>
          </span>
        </div>
      </div>
    </div>
  );
};
