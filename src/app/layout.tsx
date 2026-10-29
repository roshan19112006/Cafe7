import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cafe7.vercel.app"),
  title: "Cafe 7 | Freshly Crafted. Served with Care.",
  description: "Cafe 7 offers premium burgers, coffee, wraps, wings and comfort food in a refined café setting in Chennai.",
  keywords: ["Cafe 7", "coffee", "burgers", "Chennai", "premium cafe", "wings", "fries"],
  openGraph: {
    title: "Cafe 7 — Premium Burgers • Fries • Coffee",
    description: "Freshly Crafted. Served with Care. Explore the newly updated menu with burgers, coffee and desserts.",
    images: ["/images/hero_burger.webp"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-full bg-[#FBF8F4] text-[#3B312C] antialiased">
        {children}
      </body>
    </html>
  );
}
