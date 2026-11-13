"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OffersPage() {
  const router = useRouter();

  useEffect(() => {
    // Smoothly redirect to the integrated offers section on the main page
    router.replace("/#offers");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FBF8F4] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 border-2 border-[#A97A55] border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="font-serif text-xl font-bold text-[#2F2622]">Redirecting to Café 7 Specials...</h2>
      <p className="text-xs text-stone-500 mt-1 max-w-sm">
        Special offers and deals are now seamlessly featured alongside our signature menu plates.
      </p>
    </div>
  );
}
