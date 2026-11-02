"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Offer,
  getStoredOffers,
  DEFAULT_OFFERS,
  fetchOffersFromServer,
  deleteOfferFromServer,
  STORAGE_KEY_AUTH,
} from "@/data/offers";
import AdminManager from "@/components/AdminManager";
import {
  Tag,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Phone,
  MapPin,
  BadgeCheck,
  MessageCircleMore,
  Eye,
  X,
  Lock,
  UtensilsCrossed,
  Menu as MenuIcon,
  Trash2
} from "lucide-react";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<Offer | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const refreshOffers = async () => {
    if (typeof window !== "undefined") {
      setIsAdminLoggedIn(localStorage.getItem(STORAGE_KEY_AUTH) === "true");
    }
    const loaded = await fetchOffersFromServer();
    setOffers(loaded);
    setIsLoaded(true);
  };

  useEffect(() => {
    // Instant render from local cache if present
    const cached = getStoredOffers();
    if (cached.length > 0) {
      setOffers(cached);
      setIsLoaded(true);
    }

    // Fetch and sync latest from server
    refreshOffers();

    const handleUpdate = () => {
      if (typeof window !== "undefined") {
        setIsAdminLoggedIn(localStorage.getItem(STORAGE_KEY_AUTH) === "true");
        setOffers(getStoredOffers());
      }
    };
    window.addEventListener("cafe7_offers_updated", handleUpdate);
    window.addEventListener("cafe7_auth_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("cafe7_offers_updated", handleUpdate);
      window.removeEventListener("cafe7_auth_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const getWhatsAppOfferUrl = (offerTitle: string) => {
    const text = `*Hi Cafe 7!*\n\nI would like to order and claim the special offer: *${offerTitle}*.\nCould you please share availability and total price? Thank you!`;
    return `https://wa.me/917200699989?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-full bg-[#FBF8F4] text-[#3B312C] font-sans flex flex-col justify-between">
      {/* Top Bar / Header */}
      <header className="sticky top-0 z-40 bg-[#FBF8F4]/90 backdrop-blur-md border-b border-[#E8D8C6] transition">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#A97A55]/30 bg-white shadow-xs">
              <Image
                src="/images/items/classic-big-crunch-burger.webp"
                alt="Cafe 7 Logo"
                fill
                className="object-cover group-hover:scale-110 transition duration-300"
              />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2F2622]">
                Café 7
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-[#A97A55] uppercase font-semibold">
                Burgers • Fries • Coffee
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#2F2622]">
            <Link href="/" className="transition hover:text-[#A97A55]">
              Home
            </Link>
            <Link href="/#menu-section" className="transition hover:text-[#A97A55]">
              Menu
            </Link>
            <Link
              href="/offers"
              className="text-[#A97A55] font-semibold flex items-center space-x-1.5"
            >
              <span>Offers</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#A97A55]/10 text-[10px] text-[#A97A55] font-bold">
                {isLoaded ? offers.length : "•"}
              </span>
            </Link>
            <Link href="/#about-section" className="transition hover:text-[#A97A55]">
              About
            </Link>
            <Link href="/#contact-section" className="transition hover:text-[#A97A55]">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/#menu-section"
              className="rounded-full bg-[#A97A55] px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#8e643f] flex items-center space-x-1.5 sm:space-x-2"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Full Menu</span>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-[#E8D8C6] bg-white text-[#2F2622] hover:bg-[#F4EEE7] transition cursor-pointer flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#A97A55]" />
              ) : (
                <MenuIcon className="w-5 h-5 text-[#2F2622]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8D8C6] bg-[#FBF8F4] px-4 py-4 space-y-2.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8D8C6] text-sm font-semibold text-[#2F2622] hover:bg-[#F4EEE7] transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-base">🏠</span>
                <span>Home</span>
              </div>
              <span className="text-[11px] text-[#A97A55] font-medium">Main</span>
            </Link>

            <Link
              href="/#menu-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8D8C6] text-sm font-semibold text-[#2F2622] hover:bg-[#F4EEE7] transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-base">🍔</span>
                <span>Full Menu</span>
              </div>
            </Link>

            <Link
              href="/offers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF4ED] border border-[#A97A55]/40 text-sm font-bold text-[#A97A55] hover:bg-[#F4EEE7] transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-base">🏷️</span>
                <span>Special Offers & Deals</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold uppercase animate-pulse">
                HOT
              </span>
            </Link>

            <Link
              href="/#about-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8D8C6] text-sm font-semibold text-[#2F2622] hover:bg-[#F4EEE7] transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-base">☕</span>
                <span>About Café 7</span>
              </div>
            </Link>

            <Link
              href="/#contact-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8D8C6] text-sm font-semibold text-[#2F2622] hover:bg-[#F4EEE7] transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-base">📍</span>
                <span>Visit & Contact Us</span>
              </div>
            </Link>

            {/* Mobile Drawer Admin Link */}
            <div className="pt-2 border-t border-[#E8D8C6]/70 flex items-center justify-between text-xs text-stone-500">
              <span className="text-[11px]">Staff Management</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-stone-200/70 hover:bg-stone-200 text-[#2F2622] text-xs font-semibold cursor-pointer transition"
              >
                <Lock className="w-3.5 h-3.5 text-[#A97A55]" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-20 bg-[#FAF4ED] border-b border-[#E8D8C6]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#A97A55]/10 border border-[#A97A55]/20 text-[#A97A55] text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Café 7 Specials</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#2F2622]">
              Special Offers & Hot Deals
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-[#3B312C] leading-relaxed">
              Enjoy handcrafted gourmet burgers, artisan coffees, thick milkshakes and sizzling sides with exclusive savings.
            </p>
          </div>
        </section>

        {/* Offers Grid or Empty State */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {!isLoaded ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#A97A55] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-500 mt-3">Loading fresh offers...</p>
            </div>
          ) : offers.length === 0 ? (
            /* EMPTY STATE: "NO OFFER AVAILABLE" */
            <div className="max-w-xl mx-auto text-center py-20 px-6 sm:px-10 rounded-3xl bg-white border border-[#E8D8C6] shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-[#FAF4ED] border border-[#E8D8C6] flex items-center justify-center mx-auto text-[#A97A55] mb-5 shadow-xs">
                <Tag className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2F2622]">
                No Offer Available
              </h2>
              <p className="mt-3 text-sm text-[#3B312C] leading-relaxed">
                There are currently no active promotional offers running. Our chef is constantly crafting seasonal treats and combo promotions, so please check back soon!
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/#menu-section"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#A97A55] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8e643f] transition shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Explore All Menu Items</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://www.instagram.com/thecafe7.in"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-[#E8D8C6] text-[#2F2622] text-xs font-semibold hover:bg-[#FAF4ED] transition flex items-center justify-center space-x-2"
                >
                  <BadgeCheck className="w-4 h-4 text-[#A97A55]" />
                  <span>Follow on Instagram</span>
                </a>
              </div>
            </div>
          ) : (
            /* OFFERS GALLERY */
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <article
                  key={offer.id}
                  className="overflow-hidden rounded-[2rem] border border-[#E8D8C6] bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Offer Poster / Image */}
                    <div
                      onClick={() => setSelectedPreviewImage(offer)}
                      className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100 border-b border-[#E8D8C6] cursor-zoom-in group"
                    >
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge */}
                      {offer.badge && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="rounded-full bg-[#A97A55] text-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-md">
                            {offer.badge}
                          </span>
                        </div>
                      )}

                      {/* Direct Admin Delete Button (if admin is authenticated) */}
                      {isAdminLoggedIn && (
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await deleteOfferFromServer(offer.id);
                            refreshOffers();
                          }}
                          className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-rose-600/95 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center space-x-1 shadow-lg cursor-pointer transition border border-white/30"
                          title="Delete this offer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}

                      {/* Zoom hint overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white space-x-1.5 text-xs font-semibold">
                        <Eye className="w-4 h-4" />
                        <span>Click to View Poster</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-[#2F2622] leading-snug group-hover:text-[#A97A55] transition">
                        {offer.title}
                      </h3>

                      <p className="mt-2.5 text-xs sm:text-sm text-[#3B312C] leading-relaxed">
                        {offer.description}
                      </p>

                      {offer.validTill && (
                        <div className="mt-4 flex items-center space-x-1.5 text-[11px] font-medium text-stone-500 bg-[#FAF4ED] px-3 py-1.5 rounded-xl border border-[#E8D8C6]/60 w-fit">
                          <Clock className="w-3.5 h-3.5 text-[#A97A55]" />
                          <span>{offer.validTill}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0">
                    <a
                      href={getWhatsAppOfferUrl(offer.title)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-full bg-[#2F2622] hover:bg-[#A97A55] text-white text-xs font-semibold transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Claim Deal on WhatsApp</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Scanned / Zoomed Poster Modal */}
      {selectedPreviewImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-[#E8D8C6] max-w-3xl w-full rounded-3xl p-6 shadow-2xl relative my-6">
            <button
              onClick={() => setSelectedPreviewImage(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-2 rounded-full hover:bg-stone-100 cursor-pointer z-10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pr-12">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A97A55]">
                {selectedPreviewImage.badge || "Special Promotion"}
              </span>
              <h3 className="text-xl font-bold font-serif text-[#2F2622]">
                {selectedPreviewImage.title}
              </h3>
            </div>

            <div className="relative w-full max-h-[70vh] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 flex items-center justify-center">
              <img
                src={selectedPreviewImage.image}
                alt={selectedPreviewImage.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-stone-500">
                {selectedPreviewImage.description}
              </p>
              <a
                href={getWhatsAppOfferUrl(selectedPreviewImage.title)}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 px-5 py-2 rounded-full bg-[#A97A55] text-white text-xs font-semibold hover:bg-[#8e643f] transition flex items-center space-x-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Claim Offer</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hidden / Discreet Admin Modal */}
      <AdminManager
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOffersChange={(updated) => {
          if (updated) {
            setOffers(updated);
          } else {
            refreshOffers();
          }
        }}
      />

      {/* Footer with Discreet/Hidden Admin Trigger */}
      <footer className="border-t border-[#E8D8C6] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <span className="font-serif text-xl font-bold text-[#2F2622]">Café 7</span>
            <p className="mt-2 text-xs text-stone-500 leading-relaxed">
              Chennai&apos;s go-to destination for crispy crunch chicken burgers, whole-breast tenders, gourmet loaded fries, signature cold brews & thick shakes.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2622]">Quick Links</h4>
            <div className="mt-3 flex flex-col space-y-2 text-xs text-[#3B312C]">
              <Link href="/" className="hover:text-[#A97A55]">Home</Link>
              <Link href="/#menu-section" className="hover:text-[#A97A55]">Menu</Link>
              <Link href="/offers" className="hover:text-[#A97A55] font-semibold text-[#A97A55]">Offers</Link>
              <Link href="/#about-section" className="hover:text-[#A97A55]">About</Link>
              <Link href="/#contact-section" className="hover:text-[#A97A55]">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2622]">Connect</h4>
            <div className="mt-3 space-y-2 text-xs text-[#3B312C]">
              <a href="tel:+917200699989" className="flex items-center space-x-2 hover:text-[#A97A55]">
                <Phone className="w-3.5 h-3.5 text-[#A97A55]" />
                <span>+91 7200699989</span>
              </a>
              <a
                href="https://maps.app.goo.gl/2rdQ6sEXDj48jW5s9"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 hover:text-[#A97A55]"
              >
                <MapPin className="w-3.5 h-3.5 text-[#A97A55]" />
                <span>74, Radha Ave Main Rd, Valasaravakkam</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8D8C6] px-4 py-5 text-xs text-stone-500 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>
            © {new Date().getFullYear()} Café 7. All rights reserved.
          </span>

          {/* Discreet Admin Login Trigger at down end of page */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-[#2F2622] transition cursor-pointer flex items-center space-x-1.5 shadow-xs"
            title="Staff Admin Access"
            aria-label="Staff Admin Login"
          >
            <Lock className="w-3.5 h-3.5 text-[#A97A55]" />
            <span className="text-xs font-semibold text-stone-800">
              Admin Login
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}
