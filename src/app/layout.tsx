import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#FBF8F4] text-[#3B312C] antialiased">
        {children}
      </body>
    </html>
  );
}
