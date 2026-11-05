'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CATEGORIES,
  MENU_ITEMS,
  RESTAURANT_INFO,
} from '@/data/menu';
import { CategoryId, DietaryFilterType, MenuItem } from '@/types/menu';
import { Header } from '@/components/Header';
import { CategoryNav } from '@/components/CategoryNav';
import { SearchBar } from '@/components/SearchBar';
import { MenuCard } from '@/components/MenuCard';
import { FoodModal } from '@/components/FoodModal';
import { QrCodeModal } from '@/components/QrCodeModal';
import { Footer } from '@/components/Footer';
import { Sparkles, Utensils, AlertCircle } from 'lucide-react';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialTable = searchParams?.get('table') || '07';

  const [activeCategory, setActiveCategory] = useState<CategoryId>('burgers');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [tableNumber, setTableNumber] = useState(initialTable);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Update table if query param changes
  useEffect(() => {
    const tableParam = searchParams?.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [searchParams]);

  // Compute category counts for pills
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: MENU_ITEMS.length,
      burgers: 0,
      wraps: 0,
      appetizers: 0,
      wings: 0,
      fries: 0,
      combos: 0,
      coffee: 0,
      beverages: 0,
      lemonades: 0,
      mojitos: 0,
      milkshakes: 0,
    };

    MENU_ITEMS.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return counts;
  }, []);

  // Filter items based on activeCategory, dietaryFilter, and searchQuery
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // 1. Category match
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // 2. Dietary match
      if (dietaryFilter === 'veg' && !item.isVeg) {
        return false;
      }
      if (dietaryFilter === 'non-veg' && item.isVeg) {
        return false;
      }

      // 3. Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesBadge = item.badge?.toLowerCase().includes(query);
        const matchesSubcat = item.subCategory?.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesBadge || matchesSubcat;
      }

      return true;
    });
  }, [activeCategory, dietaryFilter, searchQuery]);

  // Counts for current search/category scope
  const { vegCount, nonVegCount } = useMemo(() => {
    let veg = 0;
    let nonVeg = 0;

    // Filter by active category and search, ignoring dietary to show accurate count pills
    MENU_ITEMS.forEach((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matches =
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.badge?.toLowerCase().includes(query) ||
          item.subCategory?.toLowerCase().includes(query);
        if (!matches) return;
      }

      if (item.isVeg) veg++;
      else nonVeg++;
    });

    return { vegCount: veg, nonVegCount: nonVeg };
  }, [activeCategory, searchQuery]);

  // Find index of selected item in current filtered list for next/prev navigation
  const currentIndex = useMemo(() => {
    if (!selectedItem) return -1;
    return filteredItems.findIndex((it) => it.id === selectedItem.id);
  }, [selectedItem, filteredItems]);

  const handleNextItem = () => {
    if (currentIndex >= 0 && currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1]);
    } else if (filteredItems.length > 0) {
      setSelectedItem(filteredItems[0]); // Loop around
    }
  };

  const handlePrevItem = () => {
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1]);
    } else if (filteredItems.length > 0) {
      setSelectedItem(filteredItems[filteredItems.length - 1]); // Loop around
    }
  };

  // Get current category metadata
  const currentCategoryInfo = useMemo(() => {
    return (
      CATEGORIES.find((c) => c.id === activeCategory) || {
        id: 'burgers' as CategoryId,
        name: 'Burgers',
        description: 'Explore delicious items',
        icon: 'Burger',
      }
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col">
      {/* 1. Header */}
      <Header
        onOpenQr={() => setIsQrModalOpen(true)}
        tableNumber={tableNumber}
        onTableChange={setTableNumber}
      />

      {/* 2. Sticky Category Navigation */}
      <CategoryNav
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={(id) => {
          setActiveCategory(id);
          // Optional: clear search if user explicitly switches category
        }}
        categoryCounts={categoryCounts}
      />

      {/* 3. Search & Dietary Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dietaryFilter={dietaryFilter}
        onDietaryChange={setDietaryFilter}
        vegCount={vegCount}
        nonVegCount={nonVegCount}
        totalFiltered={filteredItems.length}
      />

      {/* 4. Main Menu Items Section */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 sm:py-7">
        {/* Category Header Title */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                  {searchQuery ? `Search Results` : currentCategoryInfo.name}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b202e] text-[#f3b73e] border border-[#2b334a] font-semibold">
                  {filteredItems.length} items
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {searchQuery
                  ? `Showing results matching "${searchQuery}"`
                  : currentCategoryInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Food Items Grid (1-column on mobile, 2-column on tablet/desktop) */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onSelect={(selected) => setSelectedItem(selected)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-[#121520] border border-[#23293a] rounded-3xl p-8 sm:p-12 text-center space-y-4 my-6">
            <div className="w-16 h-16 rounded-2xl bg-[#1b2030] border border-[#2c344e] mx-auto flex items-center justify-center text-gray-400">
              <AlertCircle className="w-8 h-8 text-[#f3b73e]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-display">
                No menu items found
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
                {searchQuery
                  ? `We couldn't find any dishes matching "${searchQuery}". Try searching for burgers, wraps, fries, or wings.`
                  : 'No items match the currently selected dietary filter.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-[#f3b73e] text-black font-semibold text-xs rounded-xl hover:bg-[#f5b84d] transition-colors"
                >
                  Clear Search
                </button>
              )}
              {dietaryFilter !== 'all' && (
                <button
                  onClick={() => setDietaryFilter('all')}
                  className="px-4 py-2 bg-[#202537] text-white font-medium text-xs rounded-xl border border-[#2e374f] hover:bg-[#282f45] transition-colors"
                >
                  Reset Dietary Filter
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 5. Food Image Preview Modal (Popup) */}
      <FoodModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onNext={handleNextItem}
        onPrev={handlePrevItem}
        hasMultiple={filteredItems.length > 1}
        tableNumber={tableNumber}
      />

      {/* 6. QR Code Standee Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        currentTable={tableNumber}
      />

      {/* 7. Footer */}
      <Footer onOpenQr={() => setIsQrModalOpen(true)} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-[#f3b73e]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#f3b73e] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Loading Cafe 7 Menu...
            </span>
          </div>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
