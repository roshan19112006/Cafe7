"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminManager from "@/components/AdminManager";
import { ArrowLeft, Lock } from "lucide-react";

export default function AdminPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#FBF8F4] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#A97A55] hover:underline mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Café 7 Home</span>
        </Link>
        <h1 className="font-serif text-2xl font-bold text-[#2F2622]">
          Café 7 Administrative Portal
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage live offers, posters and promotion campaigns.
        </p>
      </div>

      <AdminManager
        isOpen={isOpen}
        onClose={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/offers";
          }
        }}
      />
    </div>
  );
}
