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

// Empty by default: if no offers uploaded, the page displays "No Offer Available"
export const DEFAULT_OFFERS: Offer[] = [];

// Helper to get offers from localStorage safely in Next.js client (synchronous fallback)
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

// Fetch offers from server API and synchronize with localStorage
export async function fetchOffersFromServer(): Promise<Offer[]> {
  try {
    const res = await fetch("/api/offers", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(data));
          window.dispatchEvent(new Event("cafe7_offers_updated"));
        }
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch offers from server API, falling back to local storage:", err);
  }
  return getStoredOffers();
}

// Save offer to server API and localStorage
export async function saveOfferToServer(offer: Offer): Promise<Offer[]> {
  try {
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offer),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.offers && Array.isArray(data.offers)) {
        storeOffers(data.offers);
        return data.offers;
      }
    }
  } catch (err) {
    console.warn("Could not save offer to server API:", err);
  }

  // Fallback to local store
  const current = getStoredOffers();
  const updated = [offer, ...current.filter((o) => o.id !== offer.id)];
  storeOffers(updated);
  return updated;
}

// Delete offer from server API and localStorage
export async function deleteOfferFromServer(id: string): Promise<Offer[]> {
  try {
    const res = await fetch(`/api/offers?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.offers && Array.isArray(data.offers)) {
        storeOffers(data.offers);
        return data.offers;
      }
    }
  } catch (err) {
    console.warn("Could not delete offer from server API:", err);
  }

  // Fallback to local store
  const current = getStoredOffers();
  const updated = current.filter((o) => o.id !== id);
  storeOffers(updated);
  return updated;
}

// Delete all offers from server API and localStorage
export async function deleteAllOffersFromServer(): Promise<Offer[]> {
  try {
    const res = await fetch(`/api/offers?id=ALL`, {
      method: "DELETE",
    });
    if (res.ok) {
      storeOffers([]);
      return [];
    }
  } catch (err) {
    console.warn("Could not delete all offers from server API:", err);
  }

  storeOffers([]);
  return [];
}

// Compress image to a high quality, low footprint data URL for instant client storage
export function compressImageFile(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
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
        // Try webp first, fallback to jpeg
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
