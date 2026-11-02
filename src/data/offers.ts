export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string; // Base64 Data URL or public image path
  badge?: string;
  validTill?: string;
  createdAt: string;
}

export const STORAGE_KEY_OFFERS = "cafe7_promotional_offers_v1";
export const STORAGE_KEY_AUTH = "cafe7_admin_auth_v1";

export const DEFAULT_OFFERS: Offer[] = [];

// Helper to get offers from localStorage safely in Next.js client
export function getStoredOffers(): Offer[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFERS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load offers from localStorage:", e);
    return [];
  }
}

// Helper to save offers to localStorage synchronously
export function storeOffers(offers: Offer[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(offers));
    // Dispatch custom event for cross-component reactive updates
    window.dispatchEvent(new Event("cafe7_offers_updated"));
  } catch (e) {
    console.error("Failed to store offers in localStorage:", e);
  }
}

// Fetch offers from server API and safely synchronize with localStorage
export async function fetchOffersFromServer(): Promise<Offer[]> {
  const local = getStoredOffers();

  try {
    const res = await fetch("/api/offers", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        if (data.length > 0) {
          // Server has active offers: update local store & return
          storeOffers(data);
          return data;
        } else if (local.length > 0) {
          // Server was empty but local has active uploaded offers: sync local TO server so it is never lost!
          saveAllOffersToServer(local).catch(() => {});
          return local;
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
    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offers }),
    });
  } catch (err) {
    console.warn("Batch save to server failed:", err);
  }
}

// Save single offer to localStorage and server API
export async function saveOfferToServer(offer: Offer): Promise<Offer[]> {
  const current = getStoredOffers();
  const updated = [offer, ...current.filter((o) => o.id !== offer.id)];
  
  // 1. Immediately save to local storage so it NEVER disappears
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
