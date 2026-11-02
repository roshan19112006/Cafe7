"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Offer,
  getStoredOffers,
  storeOffers,
  compressImageFile,
  STORAGE_KEY_AUTH,
  fetchOffersFromServer,
  saveOfferToServer,
  deleteOfferFromServer,
  deleteAllOffersFromServer,
} from "@/data/offers";
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Calendar,
  Sparkles,
} from "lucide-react";

interface AdminManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onOffersChange?: () => void;
}

export default function AdminManager({ isOpen, onClose, onOffersChange }: AdminManagerProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload");

  // Form states
  const [title, setTitle] = useState<string>("");
  const [badge, setBadge] = useState<string>("");
  const [validTill, setValidTill] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth session & load offers
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem(STORAGE_KEY_AUTH) === "true";
      setIsAuthenticated(isAuth);
      fetchOffersFromServer().then((loaded) => {
        setOffers(loaded);
      });
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const validUsers = ["admin", "cafe7"];
    const validPasswords = ["cafe7admin", "cafe7@2026", "cafe7"];

    if (
      validUsers.includes(username.trim().toLowerCase()) &&
      validPasswords.includes(password.trim())
    ) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_AUTH, "true");
      }
      fetchOffersFromServer().then((loaded) => {
        setOffers(loaded);
      });
    } else {
      setAuthError("Invalid admin credentials. Please verify your username and password.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    try {
      setIsCompressing(true);
      setFormError(null);
      const compressedDataUrl = await compressImageFile(file, 1200, 0.85);
      setImagePreview(compressedDataUrl);
    } catch (err) {
      console.error(err);
      setFormError("Error processing image. Please try another file.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!title.trim()) {
      setFormError("Please enter an offer title.");
      return;
    }

    if (!description.trim()) {
      setFormError("Please enter offer details or terms.");
      return;
    }

    if (!imagePreview) {
      setFormError("Please upload an offer poster/image.");
      return;
    }

    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      image: imagePreview,
      badge: badge.trim() || undefined,
      validTill: validTill.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
      const updated = await saveOfferToServer(newOffer);
      setOffers(updated);
      setFormSuccess(`Offer "${newOffer.title}" published successfully!`);

      // Reset form
      setTitle("");
      setBadge("");
      setValidTill("");
      setDescription("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (onOffersChange) onOffersChange();
      setTimeout(() => setFormSuccess(null), 3500);
    } catch (err) {
      console.error(err);
      setFormError("Error saving offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOffer = async (id: string, offerTitle: string) => {
    try {
      setIsDeletingId(id);
      setFormError(null);
      const updated = await deleteOfferFromServer(id);
      setOffers(updated);
      setFormSuccess(`Offer "${offerTitle}" deleted successfully!`);
      setTimeout(() => setFormSuccess(null), 3000);
      if (onOffersChange) onOffersChange();
    } catch (err) {
      console.error("Delete offer failed:", err);
      setFormError("Failed to delete offer. Please try again.");
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleDeleteAllOffers = async () => {
    try {
      setFormError(null);
      await deleteAllOffersFromServer();
      setOffers([]);
      setConfirmDeleteAll(false);
      setFormSuccess("All offers deleted! The page now displays 'No Offer Available'.");
      setTimeout(() => setFormSuccess(null), 3500);
      if (onOffersChange) onOffersChange();
    } catch (err) {
      console.error("Delete all offers failed:", err);
      setFormError("Failed to delete all offers.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-[#E8D8C6] max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative my-6 text-[#3B312C]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-2 rounded-full hover:bg-stone-100 cursor-pointer z-10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-[#E8D8C6]">
          <div className="w-10 h-10 rounded-2xl bg-[#A97A55]/10 border border-[#A97A55]/20 flex items-center justify-center text-[#A97A55]">
            {isAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#2F2622]">
              Café 7 Admin Portal
            </h2>
            <p className="text-xs text-stone-500">
              {isAuthenticated
                ? "Manage promotional posters and special deals"
                : "Enter credentials to manage offers"}
            </p>
          </div>
        </div>

        {/* Success / Error Banners */}
        {formSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{formSuccess}</span>
          </div>
        )}

        {formError && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {!isAuthenticated ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {authError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#2F2622] uppercase tracking-wider mb-1">
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-[#FAF5EE] border border-[#E8D8C6] rounded-xl px-4 py-2.5 text-sm text-[#2F2622] focus:outline-none focus:border-[#A97A55]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2F2622] uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF5EE] border border-[#E8D8C6] rounded-xl px-4 py-2.5 text-sm text-[#2F2622] focus:outline-none focus:border-[#A97A55]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-full bg-[#A97A55] text-white font-semibold text-sm hover:bg-[#8e643f] transition shadow-md cursor-pointer flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>
        ) : (
          /* Authenticated Dashboard */
          <div className="mt-5 space-y-5">
            {/* Action Bar */}
            <div className="flex items-center justify-between bg-[#FAF5EE] p-3 rounded-2xl border border-[#E8D8C6]">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === "upload"
                      ? "bg-[#A97A55] text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload New Offer</span>
                </button>
                <button
                  onClick={() => setActiveTab("manage")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === "manage"
                      ? "bg-[#A97A55] text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Active Offers ({offers.length})</span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="text-xs text-stone-500 hover:text-rose-600 cursor-pointer transition font-medium"
              >
                Log Out
              </button>
            </div>

            {/* TAB 1: UPLOAD FORM */}
            {activeTab === "upload" && (
              <form onSubmit={handleCreateOffer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2F2622] uppercase tracking-wider mb-1">
                    Offer Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Weekend Burger & Shake Combo Fest"
                    className="w-full bg-[#FAF5EE] border border-[#E8D8C6] rounded-xl px-4 py-2.5 text-sm text-[#2F2622] focus:outline-none focus:border-[#A97A55]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2F2622] uppercase tracking-wider mb-1">
                      Badge Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="e.g. 50% OFF, BUY 1 GET 1"
                      className="w-full bg-[#FAF5EE] border border-[#E8D8C6] rounded-xl px-4 py-2.5 text-sm text-[#2F2622] focus:outline-none focus:border-[#A97A55]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2F2622] uppercase tracking-wider mb-1">
                      Validity Period (Optional)
                    </label>
                    <input
                      type="text"
                      value={validTill}
                      onChange={(e) => setValidTill(e.target.value)}
                      placeholder="e.g. Valid till Sunday midnight"
                      className="w-full bg-[#FAF5EE] border border-[#E8D8C6] rounded-xl px-4 py-2.5 text-sm text-[#2F2622] focus:outline-none focus:border-[#A97A55]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2F2622] uppercase tracking-wider mb-1">
                    Offer Details / Terms *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the offer, eligible items, terms or conditions..."
                    className="w-full bg-[#FAF5EE] border border-[#E8D8C6] rounded-xl px-4 py-2 text-sm text-[#2F2622] focus:outline-none focus:border-[#A97A55]"
                    required
                  />
                </div>

                {/* Poster Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[#2F2622] uppercase tracking-wider mb-1">
                    Offer Poster / Image *
                  </label>

                  <div className="mt-1">
                    {imagePreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-[#E8D8C6] bg-stone-50 max-h-56 flex items-center justify-center group">
                        <img
                          src={imagePreview}
                          alt="Offer preview"
                          className="max-h-56 w-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 cursor-pointer transition"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#A97A55]/40 hover:border-[#A97A55] rounded-2xl p-6 text-center cursor-pointer bg-[#FAF5EE] hover:bg-[#F4EEE7] transition flex flex-col items-center justify-center space-y-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#A97A55]/10 flex items-center justify-center text-[#A97A55]">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#2F2622]">
                            {isCompressing ? "Optimizing image..." : "Click to upload offer poster image"}
                          </p>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            PNG, JPG or WEBP (auto-compressed for fastest loading)
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isCompressing}
                  className="w-full mt-2 py-3 rounded-full bg-[#A97A55] text-white font-semibold text-sm hover:bg-[#8e643f] transition shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? "Publishing Offer..." : "Publish Offer to Website"}</span>
                </button>
              </form>
            )}

            {/* TAB 2: MANAGE OFFERS */}
            {activeTab === "manage" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2F2622]">
                    Total Active Offers: {offers.length}
                  </span>
                  <div className="flex items-center space-x-2">
                    {offers.length > 0 && (
                      confirmDeleteAll ? (
                        <div className="flex items-center space-x-1.5 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                          <span className="text-[10px] text-rose-700 font-semibold">Delete all?</span>
                          <button
                            onClick={handleDeleteAllOffers}
                            className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                          >
                            Yes, Delete All
                          </button>
                          <button
                            onClick={() => setConfirmDeleteAll(false)}
                            className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 text-[10px] hover:bg-stone-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteAll(true)}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition cursor-pointer px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200"
                        >
                          Delete All Offers
                        </button>
                      )
                    )}
                  </div>
                </div>

                {offers.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-[#FAF5EE] border border-[#E8D8C6]">
                    <p className="text-sm font-semibold text-[#2F2622]">
                      No active offers uploaded
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      The public offers page currently displays &ldquo;No Offer Available&rdquo;.
                    </p>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="mt-4 px-4 py-2 rounded-full bg-[#A97A55] text-white text-xs font-semibold cursor-pointer"
                    >
                      + Create First Offer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="p-3 rounded-2xl border border-[#E8D8C6] bg-white flex items-center justify-between gap-3 shadow-xs hover:border-[#A97A55] transition"
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                            <img
                              src={offer.image}
                              alt={offer.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center space-x-1.5">
                              <h4 className="text-xs font-bold text-[#2F2622] truncate">
                                {offer.title}
                              </h4>
                              {offer.badge && (
                                <span className="text-[9px] bg-[#A97A55] text-white px-1.5 py-0.2 rounded-md uppercase font-semibold">
                                  {offer.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {offer.description}
                            </p>
                            {offer.validTill && (
                              <span className="text-[10px] text-stone-400 block mt-0.5">
                                ⏱ {offer.validTill}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Unmistakable Direct Delete Button */}
                        <button
                          onClick={() => handleDeleteOffer(offer.id, offer.title)}
                          disabled={isDeletingId === offer.id}
                          className="shrink-0 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                          title="Delete this offer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isDeletingId === offer.id ? "Deleting..." : "Delete"}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
