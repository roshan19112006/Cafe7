'use client';

import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  ArrowUp,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { RESTAURANT_INFO } from '@/data/menu';

interface FooterProps {
  onOpenQr: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQr }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-[#0c0d14] border-t border-[#1d2232] text-gray-400 text-xs">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Dine-in Notice Badge Banner */}
        <div className="bg-[#141724] border border-[#262c3f] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#f3b73e] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">
                Display-Only Dine-In Menu
              </h4>
              <p className="text-gray-400 text-xs mt-0.5">
                {RESTAURANT_INFO.diningNotice}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenQr}
            type="button"
            className="flex items-center gap-2 bg-[#212739] hover:bg-[#2c334b] text-[#f3b73e] text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#323a52] transition-colors flex-shrink-0 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Show Table QR</span>
          </button>
        </div>

        {/* Restaurant Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold font-display text-white tracking-tight">
              {RESTAURANT_INFO.name}
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              {RESTAURANT_INFO.tagline}. Crafted fresh with authentic ingredients for an unforgettable dine-in taste.
            </p>
          </div>

          {/* Col 2: Timings & Location */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Visit & Timings
            </h4>
            <div className="space-y-1.5 text-gray-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#f3b73e] flex-shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.fullAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#f3b73e] flex-shrink-0" />
                <span>{RESTAURANT_INFO.hours}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Contact & Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-2">
              <a
                href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                className="flex items-center gap-2 text-gray-300 hover:text-[#f3b73e] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#f3b73e]" />
                <span>{RESTAURANT_INFO.phone}</span>
              </a>

              <a
                href={RESTAURANT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-[#f3b73e] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#f3b73e]" />
                <span>@thecafe7.in on Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright row & Back to top button */}
        <div className="pt-6 border-t border-[#1a1e2d] flex items-center justify-between text-[11px] text-gray-400">
          <div>
            © {new Date().getFullYear()} {RESTAURANT_INFO.name}. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            type="button"
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#f3b73e] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
