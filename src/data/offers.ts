export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string; // Base64 Data URL or public image path
  badge?: string;
  validTill?: string;
  createdAt: string;
}

export const STORAGE_KEY_OFFERS = "cafe7_active_offers_v3";
export const LEGACY_STORAGE_KEYS = [
  "cafe7_promotional_offers_v1",
  "cafe7_promotional_offers_v2",
];
export const STORAGE_KEY_AUTH = "cafe7_admin_auth_v1";

export const DEFAULT_OFFERS: Offer[] = [];

// Helper to get offers from localStorage safely in Next.js client with legacy cleanup
export function getStoredOffers(): Offer[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    // 1. One-time legacy cleanup: Remove demo offers from old storage keys
    for (const oldKey of LEGACY_STORAGE_KEYS) {
      const oldRaw = localStorage.getItem(oldKey);
      if (oldRaw) {
        localStorage.removeItem(oldKey);
        try {
          const oldList: Offer[] = JSON.parse(oldRaw);
          const validCustom = Array.isArray(oldList)
            ? oldList.filter((o) => o && o.id !== "offer-1" && o.id !== "offer-2")
            : [];
          if (validCustom.length > 0 && !localStorage.getItem(STORAGE_KEY_OFFERS)) {
            localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(validCustom));
          }
        } catch {
          // ignore
        }
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY_OFFERS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Always exclude demo offers
      return parsed.filter((o) => o && o.id !== "offer-1" && o.id !== "offer-2");
    }
    return [];
  } catch (e) {
    console.error("Failed to load offers from localStorage:", e);
    return [];
  }
}

// Helper to save offers to localStorage synchronously
export function storeOffers(offers: Offer[]): void {
  if (typeof window === "undefined") return;
  try {
    const clean = offers.filter((o) => o && o.id !== "offer-1" && o.id !== "offer-2");
    localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(clean));
    // Dispatch custom event for cross-component reactive updates
    window.dispatchEvent(new Event("cafe7_offers_updated"));
  } catch (e) {
    console.error("Failed to store offers in localStorage:", e);
  }
}

// Fetch offers from server API and safely synchronize across all browsers
export async function fetchOffersFromServer(): Promise<Offer[]> {
  const local = getStoredOffers();

  try {
    const res = await fetch("/api/offers", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const cleanServer = data.filter(
          (o: any) => o && o.id !== "offer-1" && o.id !== "offer-2"
        );

        if (cleanServer.length > 0) {
          // Server has active offers: Edge, Phone, and all browsers receive them
          storeOffers(cleanServer);
          return cleanServer;
        } else if (local.length > 0) {
          // Chrome has the user's newly uploaded offer, but server was empty:
          // Sync Chrome's offer TO the server immediately so Phone and Edge get it too!
          saveAllOffersToServer(local).catch(() => {});
          storeOffers(local);
          return local;
        } else {
          // Truly empty: show "No Offer Available"
          storeOffers([]);
          return [];
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch offers from server API, using local storage:", err);
  }

  return local;
}

// Save all offers to server (batch sync)
export async function saveAllOffersToServer(offers: Offer[]): Promise<void> {
  try {
    const clean = offers.filter((o) => o && o.id !== "offer-1" && o.id !== "offer-2");
    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offers: clean }),
    });
  } catch (err) {
    console.warn("Batch save to server failed:", err);
  }
}

// Save single offer to localStorage and server API
export async function saveOfferToServer(offer: Offer): Promise<Offer[]> {
  const current = getStoredOffers();
  const updated = [offer, ...current.filter((o) => o.id !== offer.id)];

  // 1. Immediately save to local storage
  storeOffers(updated);

  // 2. Sync to server API in background
  try {
    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offer),
    });
  } catch (err) {
    console.warn("Could not sync offer to server API:", err);
  }

  return updated;
}

// Delete offer from localStorage and server API
export async function deleteOfferFromServer(id: string): Promise<Offer[]> {
  const current = getStoredOffers();
  const updated = current.filter((o) => o.id !== id);

  // 1. Immediately update local storage
  storeOffers(updated);

  // 2. Sync deletion to server API
  try {
    await fetch(`/api/offers?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Could not sync delete to server API:", err);
  }

  return updated;
}

// Delete all offers from localStorage and server API
export async function deleteAllOffersFromServer(): Promise<Offer[]> {
  storeOffers([]);

  try {
    await fetch(`/api/offers?id=ALL`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Could not sync delete all to server API:", err);
  }

  return [];
}

// Compress image to lightweight, high quality data URL (max 900px, quality 0.75 ~50-80KB)
export function compressImageFile(file: File, maxWidth = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const webpData = canvas.toDataURL("image/webp", quality);
          if (webpData.startsWith("data:image/webp")) {
            resolve(webpData);
            return;
          }
        } catch {
          // fallback
        }
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
