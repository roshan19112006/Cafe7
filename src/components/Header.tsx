'use client';

import React from 'react';
import Image from 'next/image';
import { QrCode, MapPin, Clock, Phone, UtensilsCrossed } from 'lucide-react';
import { RESTAURANT_INFO } from '@/data/menu';

interface HeaderProps {
  onOpenQr: () => void;
  tableNumber: string;
  onTableChange: (table: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQr,
  tableNumber,
  onTableChange,
}) => {
  return (
    <header className="relative bg-[#0e1017] border-b border-[#202534] text-white">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-[#c78d1e] via-[#f3b73e] to-[#fb923c] text-black font-semibold text-xs py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <UtensilsCrossed className="w-3.5 h-3.5" />
        <span>Dine-in QR Digital Menu • Call server to place order</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#161a25] border border-[#2d3449] p-1 flex-shrink-0 shadow-lg shadow-black/40 overflow-hidden flex items-center justify-center">
              <Image
                src={RESTAURANT_INFO.logoUrl}
                alt={RESTAURANT_INFO.name}
                width={64}
                height={64}
                priority
                className="object-contain w-full h-full"
                onError={(e) => {
                  // Fallback if image fails
                  const target = e.currentTarget as HTMLElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
                  {RESTAURANT_INFO.name}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f3b73e]/15 text-[#f3b73e] border border-[#f3b73e]/30">
                  Valasaravakkam
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                {RESTAURANT_INFO.tagline}
              </p>
              
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1 sm:mt-1.5">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Kitchen Open
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#f3b73e]" />
                  11:00 AM – 11:30 PM
                </span>
                <a
                  href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                  className="inline-flex items-center gap-1 text-gray-300 hover:text-[#f3b73e] transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#f3b73e]" />
                  Call Server
                </a>
              </div>
            </div>
          </div>

          {/* Table Switcher & QR Code Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Table Badge */}
            <div className="bg-[#161a25] border border-[#2d3449] rounded-xl px-2.5 py-1.5 flex flex-col items-center justify-center">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">
                Table
              </span>
              <select
                aria-label="Select Table Number"
                value={tableNumber}
                onChange={(e) => onTableChange(e.target.value)}
                className="bg-transparent text-[#f3b73e] font-bold text-sm focus:outline-none cursor-pointer text-center"
              >
                {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n.toString().padStart(2, '0')} className="bg-[#141721] text-white">
                    #{n.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            {/* QR Modal Trigger */}
            <button
              onClick={onOpenQr}
              type="button"
              className="group relative flex items-center gap-2 bg-[#f3b73e] hover:bg-[#f5b84d] active:scale-95 text-black font-semibold text-xs px-3 sm:px-3.5 py-2.5 rounded-xl shadow-md transition-all duration-200"
              title="View Table QR Code"
            >
              <QrCode className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">Table QR</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
