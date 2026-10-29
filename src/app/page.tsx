"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MENU_CATEGORIES,
  MenuItem
} from "@/data/menu";
import {
  Search,
  ShoppingBag,
  Flame,
  CheckCircle2,
  ExternalLink,
  Phone,
  Clock3,
  MapPin,
  X,
  Plus,
  Minus,
  UtensilsCrossed,
  BadgeCheck,
  MessageCircleMore,
  Eye
} from "lucide-react";

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeMenuCard, setActiveMenuCard] = useState<"menu1" | null>(null);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    triggerToast(`Added ${item.name} to order`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev
        .map((i) => (i.item.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const getWhatsAppOrderUrl = () => {
    if (cart.length === 0) return "#";
    let text = `*New Order from Cafe 7 Website*\n\n`;
    cart.forEach((c, idx) => {
      text += `${idx + 1}. ${c.item.name} x${c.quantity} - ₹${c.item.price * c.quantity}\n`;
    });
    text += `\n*Subtotal: ₹${cartTotal}* (taxes extra)\n`;
    text += `Please confirm my order and share preparation time. Thank you!`;
    return `https://wa.me/919677419178?text=${encodeURIComponent(text)}`;
  };

  // Grouped categories for filter tabs
  const displayedCategories = useMemo(() => {
    return MENU_CATEGORIES.filter((cat) => {
      if (activeTab === "all") return true;

      // Group burgers
      if (activeTab === "burgers") {
        return (
          cat.id === "chicken-crunch-burgers" ||
          cat.id === "grilled-chicken-burgers" ||
          cat.id === "veg-burgers"
        );
      }

      // Group fries & loaded fries
      if (activeTab === "fries") {
        return cat.id === "fries" || cat.id === "loaded-fries";
      }

      if (activeTab === "wraps") return cat.id === "wraps";
      if (activeTab === "appetizers") return cat.id === "appetizers";
      if (activeTab === "chicken-wings") return cat.id === "chicken-wings";
      if (activeTab === "chicken-tenders") return cat.id === "chicken-tenders";
      if (activeTab === "coffee") return cat.id === "hot-cold-coffee";

      return cat.id === activeTab;
    }).map((cat) => {
      const items = cat.items.filter((item) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        if (dietaryFilter === "veg" && !item.isVeg) return false;
        if (dietaryFilter === "non-veg" && item.isVeg) return false;
        return true;
      });
      return { ...cat, items };
    }).filter((cat) => cat.items.length > 0);
  }, [activeTab, searchQuery, dietaryFilter]);

  const totalItemCount = useMemo(() => {
    return MENU_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  }, []);

  const burgerCount = useMemo(() => {
    return MENU_CATEGORIES.filter(
      (c) =>
        c.id === "chicken-crunch-burgers" ||
        c.id === "grilled-chicken-burgers" ||
        c.id === "veg-burgers"
    ).reduce((sum, c) => sum + c.items.length, 0);
  }, []);

  const friesCount = useMemo(() => {
    return MENU_CATEGORIES.filter(
      (c) => c.id === "fries" || c.id === "loaded-fries"
    ).reduce((sum, c) => sum + c.items.length, 0);
  }, []);

  return (
    <div className="min-h-full bg-[#FBF8F4] text-[#3B312C] font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#A97A55] text-white font-medium px-5 py-3 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}


      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#FBF8F4]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[0.2em] text-[#2F2622] font-serif"
          >
            CAFE 7
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#3B312C] md:flex">
            <Link href="/" className="text-[#A97A55] transition">
              Home
            </Link>
            <a href="#menu-section" className="transition hover:text-[#A97A55]">
              Menu ({totalItemCount})
            </a>
            <a href="#about-section" className="transition hover:text-[#A97A55]">
              About
            </a>
            <a href="#contact-section" className="transition hover:text-[#A97A55]">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveMenuCard("menu1")}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-[#E8D8C6] bg-white text-xs font-semibold text-[#2F2622] hover:bg-[#F4EEE7] transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#A97A55]" />
              <span>Menu Card</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="rounded-full bg-[#A97A55] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#8e643f] flex items-center space-x-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now</span>
              {cartItemCount > 0 && (
                <span className="bg-white text-[#2F2622] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-1">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-[#2F2622]">
          <div className="absolute inset-0">
            <Image
              src="/images/hero_burger.webp"
              alt="A premium café burger presentation"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-[#D2B08A]">
                PREMIUM CAFÉ • FRESHLY CRAFTED
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl font-serif">
                Freshly Crafted. <br />Served with Care.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
                Fresh gourmet burgers, crunchy wings, loaded fries, artisanal wraps & signature coffees. Made fresh every day.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#menu-section"
                  className="rounded-full bg-[#A97A55] px-6 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#8e643f] cursor-pointer"
                >
                  Explore Menu ({totalItemCount} Items)
                </a>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="rounded-full border border-white/30 px-6 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:border-[#D2B08A] hover:text-[#D2B08A] cursor-pointer"
                >
                  Order Online
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section with Real Images & Prices */}
        <section id="menu-section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#A97A55]">
              Official 2026 Menu
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#2F2622] sm:text-4xl font-serif">
              Signature Plates & Pours
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#3B312C]">
              Every dish below is freshly prepared with verified prices and high-resolution photography straight from our kitchen and barista bar.
            </p>
          </div>

          {/* Search & Dietary Preference Row */}
          <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F4EEE7] border border-[#E8D8C6]">
            {/* Dietary filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#2F2622] uppercase tracking-wider mr-1">
                Filter:
              </span>
              <button
                onClick={() => setDietaryFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  dietaryFilter === "all"
                    ? "bg-[#2F2622] text-white shadow-sm"
                    : "bg-white text-[#3B312C] hover:bg-[#E8D8C6]"
                }`}
              >
                All Diets
              </button>
              <button
                onClick={() => setDietaryFilter("veg")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center space-x-1 ${
                  dietaryFilter === "veg"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-white text-emerald-800 hover:bg-[#E8D8C6]"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Veg Only 🌱</span>
              </button>
              <button
                onClick={() => setDietaryFilter("non-veg")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center space-x-1 ${
                  dietaryFilter === "non-veg"
                    ? "bg-rose-700 text-white shadow-sm"
                    : "bg-white text-rose-800 hover:bg-[#E8D8C6]"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Non-Veg 🍗</span>
              </button>
            </div>

            {/* Search box */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search burger, latte, tenders..."
                className="w-full bg-white border border-[#E8D8C6] rounded-full pl-9 pr-8 py-2 text-xs text-[#2F2622] placeholder-stone-400 focus:outline-none focus:border-[#A97A55]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#2F2622]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
            {/* All Items */}
            <button
              onClick={() => setActiveTab("all")}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "all"
                  ? "bg-[#2F2622] text-white shadow-md scale-105"
                  : "bg-white text-[#3B312C] border border-[#E8D8C6] hover:bg-[#F4EEE7]"
              }`}
            >
              <span>View All Menu</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10">
                {totalItemCount}
              </span>
            </button>

            {/* Burgers */}
            <button
              onClick={() => setActiveTab("burgers")}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "burgers"
                  ? "bg-[#A97A55] text-white shadow-md scale-105"
                  : "bg-white text-[#3B312C] border border-[#E8D8C6] hover:bg-[#F4EEE7]"
              }`}
            >
              <span>🍔 Burgers</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10">
                {burgerCount}
              </span>
            </button>

            {/* Wraps */}
            <button
              onClick={() => setActiveTab("wraps")}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "wraps"
                  ? "bg-[#A97A55] text-white shadow-md scale-105"
                  : "bg-white text-[#3B312C] border border-[#E8D8C6] hover:bg-[#F4EEE7]"
              }`}
            >
              <span>🌯 Wraps (5)</span>
            </button>

            {/* Appetizers */}
            <button
              onClick={() => setActiveTab("appetizers")}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "appetizers"
                  ? "bg-[#A97A55] text-white shadow-md scale-105"
                  : "bg-white text-[#3B312C] border border-[#E8D8C6] hover:bg-[#F4EEE7]"
              }`}
            >
              <span>🥟 Appetizers (5)</span>
            </button>

            {/* Chicken Wings */}
            <button
              onClick={() => setActiveTab("chicken-wings")}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "chicken-wings"
                  ? "bg-[#A97A55] text-white shadow-md scale-105"
                  : "bg-white text-[#3B312C] border border-[#E8D8C6] hover:bg-[#F4EEE7]"
              }`}
            >
              <span>🍗 Chicken Wings (4)</span>
            </button>

            {/* Chicken Tenders */}
            <button
              onClick={() => setActiveTab("chicken-tenders")}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "chicken-tenders"
                  ? "bg-[#A97A55] text-white shadow-md scale-105"
                  : "bg-white text-[#3B312C] border border-[#E8D8C6] hover:bg-[#F4EEE7]"
              }`}
            >
              <span>🍗 Crispy Tenders (7)</span>
            </button>

            {/* Fries & Loaded */}
            <button
              onClick={() => setActiveTab("fries")}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "fries"
                  ? "bg-[#A97A55] text-white shadow-md scale-105"
                  : "bg-white text-[#3B312C] border border-[#E8D8C6] hover:bg-[#F4EEE7]"
              }`}
            >
              <span>🍟 Fries & Loaded ({friesCount})</span>
            </button>

            {/* Coffee */}
            <button
              onClick={() => setActiveTab("coffee")}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "coffee"
                  ? "bg-[#A97A55] text-white shadow-md scale-105"
                  : "bg-white text-[#3B312C] border border-[#E8D8C6] hover:bg-[#F4EEE7]"
              }`}
            >
              <span>☕ Hot & Cold Coffee (11)</span>
            </button>
          </div>

          {/* Rendered Items Grid with Images */}
          <div className="mt-8 space-y-12">
            {displayedCategories.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E8D8C6]">
                <p className="text-base text-[#3B312C]">
                  No items match your search or filter.
                </p>
                <button
                  onClick={() => {
                    setActiveTab("all");
                    setSearchQuery("");
                    setDietaryFilter("all");
                  }}
                  className="mt-3 px-4 py-2 rounded-full bg-[#A97A55] text-white text-xs font-semibold cursor-pointer"
                >
                  Reset Menu
                </button>
              </div>
            ) : (
              displayedCategories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E8D8C6] pb-2">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-[#2F2622] font-serif">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-stone-500 mt-0.5">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#A97A55] bg-[#F4EEE7] px-3 py-1 rounded-full border border-[#E8D8C6]">
                      {category.items.length} items
                    </span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item) => (
                      <article
                        key={item.id}
                        className="overflow-hidden rounded-[1.75rem] border border-[#E8D8C6] bg-white shadow-[0_4px_20px_rgba(47,38,34,0.04)] hover:shadow-xl transition duration-300 flex flex-col justify-between group"
                      >
                        <div>
                          {/* Item Image with Badges */}
                          <div
                            onClick={() => setSelectedPreviewItem(item)}
                            className="relative h-64 sm:h-72 w-full overflow-hidden bg-white border-b border-[#E8D8C6]/50 flex items-center justify-center p-3 cursor-zoom-in"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                            />

                            {/* Veg / Non-Veg Indicator */}
                            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg shadow-xs border border-stone-200">
                              {item.isVeg ? (
                                <div className="w-4 h-4 rounded-xs border-2 border-emerald-600 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-xs border-2 border-rose-600 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-rose-600" />
                                </div>
                              )}
                            </div>

                            {/* Badges on right side */}
                            <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
                              {item.badge && (
                                <span className="rounded-full bg-[#A97A55] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-xs">
                                  {item.badge}
                                </span>
                              )}
                              {item.isSpicy && (
                                <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs flex items-center space-x-1">
                                  <Flame className="w-2.5 h-2.5" />
                                  <span>Spicy</span>
                                </span>
                              )}
                              {item.pieces && (
                                <span className="rounded-full bg-white/95 text-[#2F2622] px-2.5 py-1 text-[10px] font-bold shadow-xs border border-stone-200">
                                  {item.pieces}
                                </span>
                              )}
                            </div>

                            {/* Hover zoom hint */}
                            <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[10px] px-2 py-1 rounded-full flex items-center space-x-1 backdrop-blur-xs">
                              <Eye className="w-3 h-3" />
                              <span>View Full</span>
                            </div>
                          </div>

                          {/* Item Details */}
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="text-base font-semibold text-[#2F2622] leading-snug">
                                {item.name}
                              </h4>
                              <span className="text-lg font-bold text-[#A97A55] font-serif whitespace-nowrap">
                                ₹{item.price}
                              </span>
                            </div>

                            {item.description && (
                              <p className="mt-2 text-xs leading-relaxed text-[#3B312C]/80 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order Button */}
                        <div className="p-5 pt-0">
                          <button
                            onClick={() => addToCart(item)}
                            className="w-full py-2.5 rounded-full bg-[#F4EEE7] hover:bg-[#A97A55] text-[#2F2622] hover:text-white border border-[#E8D8C6] text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Order • ₹{item.price}</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* About Cafe 7 Section */}
        <section id="about-section" className="bg-[#F4EEE7] py-20 border-t border-[#E8D8C6]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
              <div className="overflow-hidden rounded-[2rem] border border-[#E8D8C6] bg-white p-3">
                <div className="relative h-[420px] overflow-hidden rounded-[1.5rem]">
                  <Image
                    src="/images/items/spanish-latte.webp"
                    alt="Cafe 7 handcrafted specialty brew"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#A97A55]">
                  About Cafe 7
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2F2622] sm:text-4xl font-serif">
                  Welcome to Cafe 7
                </h2>
                <p className="mt-4 text-base leading-7 text-[#3B312C]">
                  At Cafe 7, we believe great food and coffee bring people together. Built on a passion for freshness, quality, and exceptional hospitality, Cafe 7 is a place where every visit feels welcoming and memorable.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#E8D8C6] bg-white px-4 py-2.5 text-xs font-semibold text-[#3B312C]">
                    ✓ Freshly Prepared Food
                  </div>
                  <div className="rounded-xl border border-[#E8D8C6] bg-white px-4 py-2.5 text-xs font-semibold text-[#3B312C]">
                    ✓ Hygienic Food Handling
                  </div>
                  <div className="rounded-xl border border-[#E8D8C6] bg-white px-4 py-2.5 text-xs font-semibold text-[#3B312C]">
                    ✓ 100% Quality Ingredients
                  </div>
                  <div className="rounded-xl border border-[#E8D8C6] bg-white px-4 py-2.5 text-xs font-semibold text-[#3B312C]">
                    ✓ Artisanal Signature Coffee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visit & Contact Section */}
        <section id="contact-section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-[#E8D8C6] bg-[#F4EEE7] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#A97A55]">
                Visit Cafe 7
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#2F2622] font-serif">
                Your neighborhood café in Chennai
              </h2>

              <div className="mt-6 space-y-5 text-[#3B312C] text-sm">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#A97A55] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#2F2622]">Address</p>
                    <p className="mt-1 leading-relaxed">
                      74, Radha Ave Main Rd, Velan Nagar, Valasaravakkam, Chennai, Tamil Nadu 600087
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-[#A97A55] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#2F2622]">Phone</p>
                    <a href="tel:+919677419178" className="mt-1 block text-[#A97A55] font-semibold">
                      +91 9677419178
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock3 className="w-5 h-5 text-[#A97A55] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#2F2622]">Opening Hours</p>
                    <div className="mt-1 space-y-1 text-xs">
                      <p>Monday – Friday: 8:00 AM – 10:00 PM</p>
                      <p>Saturday: 8:00 AM – 11:00 PM</p>
                      <p>Sunday: 9:00 AM – 9:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://maps.app.goo.gl/2rdQ6sEXDj48jW5s9"
                  className="rounded-full bg-[#A97A55] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8e643f]"
                >
                  Open in Google Maps
                </a>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://wa.me/919677419178"
                  className="rounded-full border border-[#A97A55] px-6 py-2.5 text-xs font-semibold text-[#A97A55] hover:bg-white transition"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="overflow-hidden rounded-[2rem] border border-[#E8D8C6] bg-white p-2 shadow-sm">
              <iframe
                src="https://www.google.com/maps?q=74,%20Radha%20Ave%20Main%20Rd,%20Velan%20Nagar,%20Valasaravakkam,%20Chennai,%20Tamil%20Nadu%20600087&output=embed"
                title="Cafe 7 location"
                className="h-[380px] w-full rounded-[1.5rem] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Scanned Menu Card Modal */}
      {activeMenuCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-[#E8D8C6] max-w-4xl w-full rounded-3xl p-6 shadow-2xl relative my-6">
            <button
              onClick={() => setActiveMenuCard(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-2 rounded-full hover:bg-stone-100 cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-4 pr-12">
              <div>
                <h3 className="text-xl font-semibold font-serif text-[#2F2622]">
                  Official Café 7 Main Menu Card
                </h3>
                <p className="text-xs text-[#3B312C]">
                  Burgers • Fries • Coffee • Wings • Tenders • Wraps
                </p>
              </div>
            </div>

            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200">
              <Image
                src="/images/Menu 1.jpeg"
                alt="Café 7 Print Card Scan"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-3 text-center text-xs text-stone-500">
              Verified print resolution card. Every digital item and price on this site matches this exact menu.
            </div>
          </div>
        </div>
      )}

      {/* Full-Size Image Preview Lightbox */}
      {selectedPreviewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8D8C6] max-w-3xl w-full rounded-3xl p-6 shadow-2xl relative my-6">
            <button
              onClick={() => setSelectedPreviewItem(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-2 rounded-full hover:bg-stone-100 cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between mb-4 pr-12">
              <div>
                <div className="flex items-center space-x-2">
                  {selectedPreviewItem.isVeg ? (
                    <div className="w-3.5 h-3.5 rounded-xs border-2 border-emerald-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </div>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-xs border-2 border-rose-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold font-serif text-[#2F2622]">
                    {selectedPreviewItem.name}
                  </h3>
                </div>
                {selectedPreviewItem.description && (
                  <p className="text-xs text-[#3B312C]/80 mt-1 max-w-xl">
                    {selectedPreviewItem.description}
                  </p>
                )}
              </div>
              <span className="text-xl font-bold text-[#A97A55] font-serif whitespace-nowrap">
                ₹{selectedPreviewItem.price}
              </span>
            </div>

            <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8D8C6]/50 p-2 flex items-center justify-center">
              <Image
                src={selectedPreviewItem.image}
                alt={selectedPreviewItem.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                100% Uncropped Original Presentation
              </span>
              <button
                onClick={() => {
                  addToCart(selectedPreviewItem);
                  setSelectedPreviewItem(null);
                }}
                className="px-5 py-2.5 rounded-full bg-[#A97A55] hover:bg-[#8e643f] text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Order • ₹{selectedPreviewItem.price}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart / Order Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white border-l border-[#E8D8C6] h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-[#E8D8C6] pb-4">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#A97A55]" />
                  <h3 className="text-lg font-semibold font-serif text-[#2F2622]">
                    Your Order
                  </h3>
                  <span className="text-xs bg-[#F4EEE7] text-[#2F2622] font-semibold px-2 py-0.5 rounded-full">
                    {cartItemCount} items
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-[#F4EEE7] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="py-20 text-center text-stone-400">
                    <UtensilsCrossed className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                    <p className="text-sm font-medium text-stone-600">
                      Your bag is empty
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Click &quot;Add&quot; on any item from the menu to start ordering.
                    </p>
                  </div>
                ) : (
                  cart.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#F4EEE7] border border-[#E8D8C6] flex items-center justify-between gap-3"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E8D8C6]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-1.5">
                          {item.isVeg ? (
                            <div className="w-3 h-3 rounded-xs border border-emerald-600 flex items-center justify-center p-0.5 shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            </div>
                          ) : (
                            <div className="w-3 h-3 rounded-xs border border-rose-600 flex items-center justify-center p-0.5 shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            </div>
                          )}
                          <h4 className="text-xs font-semibold text-[#2F2622] line-clamp-1">
                            {item.name}
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-[#A97A55] mt-1 block">
                          ₹{item.price * quantity}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-full border border-[#E8D8C6]">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-500 hover:text-[#2F2622] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-[#2F2622] px-1">
                          {quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="text-[#A97A55] hover:text-[#2F2622] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#E8D8C6] pt-4 space-y-4">
                <div className="space-y-1.5 text-xs text-[#3B312C]">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="font-semibold">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Applicable Taxes</span>
                    <span>Exclusive</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#2F2622] pt-2 border-t border-[#E8D8C6]">
                    <span>Total Estimate</span>
                    <span className="text-[#A97A55] font-serif text-lg">
                      ₹{cartTotal}
                    </span>
                  </div>
                </div>

                <a
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-[#A97A55] hover:bg-[#8e643f] text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-sm transition cursor-pointer"
                >
                  <span>Send Order to WhatsApp (+91 9677419178)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setCart([])}
                  className="w-full text-center text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  Clear order bag
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E8D8C6] bg-[#F4EEE7]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <p className="text-xl font-semibold tracking-[0.25em] text-[#2F2622] font-serif">
              CAFE 7
            </p>
            <p className="mt-4 max-w-md text-base leading-8 text-[#3B312C]">
              Cafe 7 – Freshly Crafted. Served with Care.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#2F2622]">Quick Links</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#3B312C]">
              <Link className="hover:text-[#A97A55]" href="/">
                Home
              </Link>
              <a className="hover:text-[#A97A55]" href="#menu-section">
                Menu ({totalItemCount})
              </a>
              <a className="hover:text-[#A97A55]" href="#about-section">
                About
              </a>
              <a className="hover:text-[#A97A55]" href="#contact-section">
                Contact
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#2F2622]">Connect</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#3B312C]">
              <a
                href="https://www.instagram.com/thecafe7.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#A97A55]"
              >
                <BadgeCheck className="w-4 h-4 text-[#A97A55]" />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/share/1GuB7BGgk1/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#A97A55]"
              >
                <MessageCircleMore className="w-4 h-4 text-[#A97A55]" />
                <span>Facebook</span>
              </a>
              <a
                href="tel:+919677419178"
                className="inline-flex items-center gap-2 hover:text-[#A97A55]"
              >
                <Phone className="w-4 h-4 text-[#A97A55]" />
                <span>+91 9677419178</span>
              </a>
              <a
                href="https://maps.app.goo.gl/2rdQ6sEXDj48jW5s9"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#A97A55]"
              >
                <MapPin className="w-4 h-4 text-[#A97A55]" />
                <span>74, Radha Ave Main Rd, Valasaravakkam</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8D8C6] px-4 py-6 text-center text-sm text-[#3B312C] sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Cafe 7. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
