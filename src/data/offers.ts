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

// Default sample offers to showcase initially if no custom offers are created
export const DEFAULT_OFFERS: Offer[] = [
  {
    id: "offer-1",
    title: "Weekend Burger & Shake Combo Fest",
    description: "Order any Chicken Crunch Burger and get 50% off on your favorite Signature Milkshake. Valid on dine-in and takeaways.",
    image: "/images/items/cafe-combo-meal.webp",
    badge: "50% OFF SHAKE",
    validTill: "Valid on Saturdays & Sundays",
    createdAt: new Date().toISOString()
  },
  {
    id: "offer-2",
    title: "Cooler Hours: Refreshers & Mojitos BOGO",
    description: "Beat the heat! Buy any 2 Mojitos or Refreshers and get the 3rd one on the house between 3:00 PM and 7:00 PM.",
    image: "/images/items/blue-lagoon-mojito.webp",
    badge: "BUY 2 GET 1",
    validTill: "Daily 3:00 PM - 7:00 PM",
    createdAt: new Date().toISOString()
  }
];

// Helper to get offers from localStorage safely in Next.js client
export function getStoredOffers(): Offer[] {
  if (typeof window === "undefined") {
    return DEFAULT_OFFERS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFERS);
    if (!raw) {
      // First time initialization: populate default offers
      localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(DEFAULT_OFFERS));
      return DEFAULT_OFFERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load offers from localStorage:", e);
    return [];
  }
}

// Helper to save offers to localStorage
export function storeOffers(offers: Offer[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(offers));
    // Dispatch custom event for cross-component reactive updates
    window.dispatchEvent(new Event("cafe7_offers_updated"));
  } catch (e) {
    console.error("Failed to store offers in localStorage:", e);
    throw e;
  }
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
