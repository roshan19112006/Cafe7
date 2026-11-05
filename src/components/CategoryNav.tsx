'use client';

import React, { useRef, useEffect } from 'react';
import {
  Sparkles,
  Sandwich,
  Flame,
  Coffee,
  GlassWater,
  Citrus,
  Wine,
  Boxes,
  CookingPot,
  Milk,
  Layers,
} from 'lucide-react';
import { Category, CategoryId } from '@/types/menu';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  categoryCounts: Record<CategoryId, number>;
}

// Map category icons to Lucide icons
const getCategoryIcon = (id: CategoryId) => {
  switch (id) {
    case 'all':
      return <Sparkles className="w-4 h-4" />;
    case 'burgers':
      return <Sandwich className="w-4 h-4" />;
    case 'wraps':
      return <CookingPot className="w-4 h-4" />;
    case 'appetizers':
      return <Sparkles className="w-4 h-4" />;
    case 'wings':
      return <Flame className="w-4 h-4" />;
    case 'fries':
      return <Boxes className="w-4 h-4" />;
    case 'combos':
      return <Layers className="w-4 h-4" />;
    case 'coffee':
      return <Coffee className="w-4 h-4" />;
    case 'beverages':
      return <GlassWater className="w-4 h-4" />;
    case 'lemonades':
      return <Citrus className="w-4 h-4" />;
    case 'mojitos':
      return <Wine className="w-4 h-4" />;
    case 'milkshakes':
      return <Milk className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto scroll active category into view
  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      const container = containerRef.current;
      const button = activeBtnRef.current;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollPos = buttonLeft - containerWidth / 2 + buttonWidth / 2;

      container.scrollTo({
        left: scrollPos,
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-0 z-30 bg-[#0e1017]/95 backdrop-blur-md border-b border-[#202534] shadow-md shadow-black/30">
      <div className="max-w-4xl mx-auto px-4 py-2.5">
        <div
          ref={containerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                ref={isActive ? activeBtnRef : null}
                onClick={() => onSelectCategory(cat.id)}
                type="button"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 select-none ${
                  isActive
                    ? 'bg-[#f3b73e] text-black font-semibold shadow-md shadow-[#f3b73e]/20 scale-[1.02]'
                    : 'bg-[#151823] text-gray-300 hover:text-white hover:bg-[#1f2434] border border-[#23293a]'
                }`}
              >
                <span className={isActive ? 'text-black' : 'text-[#f3b73e]'}>
                  {getCategoryIcon(cat.id)}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-black/20 text-black'
                      : 'bg-[#222738] text-gray-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
