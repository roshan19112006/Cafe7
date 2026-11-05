'use client';

import React from 'react';
import { Search, X, Leaf, Drumstick } from 'lucide-react';
import { DietaryFilterType } from '@/types/menu';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dietaryFilter: DietaryFilterType;
  onDietaryChange: (filter: DietaryFilterType) => void;
  vegCount: number;
  nonVegCount: number;
  totalFiltered: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  dietaryFilter,
  onDietaryChange,
  vegCount,
  nonVegCount,
  totalFiltered,
}) => {
  return (
    <div className="bg-[#12141c] border-b border-[#202534] py-3 px-4">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search burgers, wings, coffee, shakes..."
            className="w-full bg-[#171b26] border border-[#2b3245] focus:border-[#f3b73e] text-white placeholder-gray-400 text-sm rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-white hover:bg-[#252c3e] transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dietary Filters & Counter */}
        <div className="flex items-center justify-between gap-2 text-xs">
          {/* Veg / Non-Veg Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onDietaryChange('all')}
              type="button"
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                dietaryFilter === 'all'
                  ? 'bg-[#2b3245] text-white shadow-sm'
                  : 'bg-[#171b26] text-gray-400 hover:text-gray-200 border border-[#242a3a]'
              }`}
            >
              All Types
            </button>

            <button
              onClick={() => onDietaryChange(dietaryFilter === 'veg' ? 'all' : 'veg')}
              type="button"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-sm'
                  : 'bg-[#171b26] text-gray-400 hover:text-gray-200 border border-[#242a3a]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full border border-emerald-500 flex items-center justify-center p-[1px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span>Veg ({vegCount})</span>
            </button>

            <button
              onClick={() => onDietaryChange(dietaryFilter === 'non-veg' ? 'all' : 'non-veg')}
              type="button"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-150 ${
                dietaryFilter === 'non-veg'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-sm'
                  : 'bg-[#171b26] text-gray-400 hover:text-gray-200 border border-[#242a3a]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full border border-rose-500 flex items-center justify-center p-[1px]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              </span>
              <span>Non-Veg ({nonVegCount})</span>
            </button>
          </div>

          {/* Results Count */}
          <span className="text-[11px] text-gray-400 flex-shrink-0">
            {totalFiltered} {totalFiltered === 1 ? 'dish' : 'dishes'}
          </span>
        </div>
      </div>
    </div>
  );
};
