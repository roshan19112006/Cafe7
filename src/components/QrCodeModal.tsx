'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Download,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { RESTAURANT_INFO } from '@/data/menu';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTable: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  currentTable,
}) => {
  const [selectedTable, setSelectedTable] = useState(currentTable);
  const [customUrl, setCustomUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedTable(currentTable);
  }, [currentTable]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCustomUrl(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  // The active URL encoded in the QR code
  const targetUrl = customUrl
    ? `${customUrl.replace(/\/$/, '')}/?table=${selectedTable}`
    : `https://cafe7-menu.vercel.app/?table=${selectedTable}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate downloadable high-resolution table standee graphic on canvas
  const handleDownloadStandee = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0b0c12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gold decorative border
    ctx.strokeStyle = '#f3b73e';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = '#272e42';
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Restaurant Title
    ctx.fillStyle = '#f3b73e';
    ctx.font = 'bold 72px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CAFE 7', canvas.width / 2, 170);

    // Tagline
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '32px Inter, sans-serif';
    ctx.fillText('GOURMET BURGERS & SHAKES', canvas.width / 2, 230);

    // Table Badge Box
    ctx.fillStyle = '#161a27';
    ctx.strokeStyle = '#f3b73e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 200, 275, 400, 90, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f3b73e';
    ctx.font = 'bold 44px Outfit, sans-serif';
    ctx.fillText(`TABLE #${selectedTable}`, canvas.width / 2, 335);

    // Scan CTA Box
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 46px Outfit, sans-serif';
    ctx.fillText('SCAN FOR DIGITAL MENU', canvas.width / 2, 450);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '30px Inter, sans-serif';
    ctx.fillText('Open your phone camera & scan QR code', canvas.width / 2, 500);

    // Draw QR code from SVG
    const svgElement = qrRef.current?.querySelector('svg');
    if (svgElement) {
      const xml = new XMLSerializer().serializeToString(svgElement);
      const svg64 = btoa(unescape(encodeURIComponent(xml)));
      const b64Start = 'data:image/svg+xml;base64,';
      const image64 = b64Start + svg64;

      const img = new window.Image();
      img.src = image64;
      img.onload = () => {
        // White background container for crisp QR scanning
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(canvas.width / 2 - 275, 550, 550, 550, 36);
        ctx.fill();

        // Draw QR
        ctx.drawImage(img, canvas.width / 2 - 235, 590, 470, 470);

        // Footer instructions
        ctx.fillStyle = '#f3b73e';
        ctx.font = 'bold 36px Outfit, sans-serif';
        ctx.fillText('100% Contactless Dine-In', canvas.width / 2, 1180);

        ctx.fillStyle = '#64748b';
        ctx.font = '26px Inter, sans-serif';
        ctx.fillText(RESTAURANT_INFO.location, canvas.width / 2, 1230);
        ctx.fillText(RESTAURANT_INFO.hours, canvas.width / 2, 1275);

        // Trigger Download
        const a = document.createElement('a');
        a.download = `Cafe7-Table-${selectedTable}-QR-Standee.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#131621] border border-[#272e42] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 animate-scale-up text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close QR Modal"
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1b2030] hover:bg-[#252c42] text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3b73e]/15 border border-[#f3b73e]/30 text-[#f3b73e] text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Table Dine-in QR Code</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight">
            Scan to Open Menu
          </h2>
          <p className="text-xs text-gray-400">
            Place this QR code on restaurant tables for contactless menu access.
          </p>
        </div>

        {/* Table Selector */}
        <div className="flex items-center justify-between bg-[#191d2c] border border-[#262c3e] rounded-xl p-2.5">
          <span className="text-xs text-gray-300 font-medium pl-1">
            Assign Table Number:
          </span>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="bg-[#242a3e] border border-[#37405c] text-[#f3b73e] text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
          >
            {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => {
              const val = n.toString().padStart(2, '0');
              return (
                <option key={val} value={val}>
                  Table #{val}
                </option>
              );
            })}
          </select>
        </div>

        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center justify-center p-4 sm:p-5 bg-gradient-to-b from-[#181c2a] to-[#141724] border border-[#2b334a] rounded-2xl shadow-inner">
          <div
            ref={qrRef}
            className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center"
          >
            <QRCodeSVG
              value={targetUrl}
              size={190}
              level="H"
              includeMargin={false}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>

          <div className="mt-3.5 text-center">
            <div className="text-sm font-bold font-display text-white">
              Cafe 7 — Table #{selectedTable}
            </div>
            <div className="text-[11px] text-gray-400 truncate max-w-[280px] mt-0.5">
              {targetUrl}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleDownloadStandee}
            type="button"
            className="flex items-center justify-center gap-2 bg-[#f3b73e] hover:bg-[#f5b84d] text-black font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Standee</span>
          </button>

          <button
            onClick={handleCopyLink}
            type="button"
            className="flex items-center justify-center gap-2 bg-[#202537] hover:bg-[#282f45] text-white font-medium text-xs sm:text-sm py-2.5 px-3 rounded-xl border border-[#2d364e] transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Menu Link</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Preview Tip */}
        <div className="p-3 bg-[#171b28] border border-[#242b3e] rounded-xl flex items-start gap-2.5 text-[11px] text-gray-400">
          <Smartphone className="w-4 h-4 text-[#f3b73e] flex-shrink-0 mt-0.5" />
          <p>
            When customers point their smartphone camera at this QR code, it instantly loads the digital menu without requiring any app download.
          </p>
        </div>
      </div>
    </div>
  );
};
