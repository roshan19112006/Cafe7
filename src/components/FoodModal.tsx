'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  X,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight,
  BellRing,
  Share2,
  Check,
} from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { RESTAURANT_INFO } from '@/data/menu';

interface FoodModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasMultiple?: boolean;
  tableNumber?: string;
}

export const FoodModal: React.FC<FoodModalProps> = ({
  item,
  onClose,
  onNext,
  onPrev,
  hasMultiple = false,
  tableNumber = '07',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close on Escape & handle Prev/Next arrow keys
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [item, onClose, onNext, onPrev]);

  // Reset image loaded state when item changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [item?.id]);

  if (!item) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${item.name} — Cafe 7`,
        text: `Check out ${item.name} (${RESTAURANT_INFO.currency}${item.price}) at Cafe 7!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${item.name} (${RESTAURANT_INFO.currency}${item.price}) - ${RESTAURANT_INFO.name}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#131621] border border-[#272e42] rounded-3xl shadow-2xl flex flex-col no-scrollbar animate-scale-up"
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close food preview"
          className="absolute top-3.5 right-3.5 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-gray-200 hover:text-white border border-white/20 shadow-lg backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Food Photography Showcase */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#1a1e2d] overflow-hidden rounded-t-3xl">
          {/* Skeleton loading animation */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 skeleton-shimmer z-10" />
          )}

          {!imageError ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 600px"
              className={`object-cover object-center transition-all duration-300 ${
                imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#161a27] text-gray-400 p-6 text-center">
              <span className="text-4xl mb-2">🍽️</span>
              <p className="text-sm font-medium text-gray-300">{item.name}</p>
            </div>
          )}

          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#131621] via-transparent to-black/40 pointer-events-none" />

          {/* Dietary Badge on Image */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="bg-black/75 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
              {item.isVeg ? (
                <>
                  <div className="w-4 h-4 border-2 border-emerald-500 flex items-center justify-center rounded-sm bg-black/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    Vegetarian
                  </span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 border-2 border-rose-500 flex items-center justify-center rounded-sm bg-black/50">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                  </div>
                  <span className="text-xs font-semibold text-rose-400">
                    Non-Vegetarian
                  </span>
                </>
              )}
            </div>

            {item.badge && (
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl bg-[#f3b73e] text-black shadow-lg">
                <Sparkles className="w-3 h-3" />
                {item.badge}
              </span>
            )}
          </div>

          {/* Previous / Next Navigation Arrows for Fast Browsing */}
          {hasMultiple && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-20">
              {onPrev && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  type="button"
                  aria-label="Previous item"
                  className="pointer-events-auto p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all active:scale-90"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {onNext && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  type="button"
                  aria-label="Next item"
                  className="pointer-events-auto p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all active:scale-90 ml-auto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Food Details Section */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Title & Price Row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-medium text-[#f3b73e] uppercase tracking-wider">
                  {item.subCategory || item.category}
                </span>
                {item.isSpicy && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-500/40">
                    <Flame className="w-3 h-3 text-rose-400" />
                    Spicy Chef Blend
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                {item.name}
              </h2>
            </div>

            {/* Price Badge */}
            <div className="flex flex-col items-end">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#f3b73e] font-mono tracking-tight bg-[#1e2334] px-3.5 py-1 rounded-xl border border-[#303850]">
                {RESTAURANT_INFO.currency}{item.price}
              </span>
              <span className="text-[10px] text-gray-400 mt-1">
                Inclusive of all taxes
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#181c2a] border border-[#272e42] p-4 rounded-2xl">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Description & Preparation
            </h4>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* Dine-in Server Order Assistance Box */}
          <div className="bg-gradient-to-r from-[#171c2b] to-[#1d2336] border border-[#f3b73e]/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f3b73e]/15 border border-[#f3b73e]/40 flex items-center justify-center flex-shrink-0 text-[#f3b73e]">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Table #{tableNumber} Dine-in
                </p>
                <p className="text-xs text-gray-300">
                  Call your server to request &quot;{item.name}&quot;
                </p>
              </div>
            </div>

            <button
              onClick={handleShare}
              type="button"
              className="p-2.5 rounded-xl bg-[#22283a] hover:bg-[#2c344d] text-gray-300 hover:text-white border border-[#333c56] transition-colors flex-shrink-0"
              title="Share dish"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Close Action Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-[#202537] hover:bg-[#282f45] active:scale-[0.99] text-white font-semibold text-sm border border-[#2e374f] transition-all duration-150 flex items-center justify-center gap-2"
            >
              <span>Back to Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
