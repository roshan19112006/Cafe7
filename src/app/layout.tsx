import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { RESTAURANT_INFO } from '@/data/menu';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${RESTAURANT_INFO.name} — QR Digital Dine-in Menu`,
  description: `Browse the official digital menu for ${RESTAURANT_INFO.name} (${RESTAURANT_INFO.location}). Gourmet burgers, crispy wings, wraps, thick milkshakes, and barista coffee.`,
  keywords: [
    'Cafe 7',
    'Cafe 7 menu',
    'Cafe 7 Chennai',
    'Valasaravakkam cafe',
    'QR code menu',
    'Digital dine-in menu',
    'Burgers',
    'Wings',
    'Coffee',
  ],
  authors: [{ name: RESTAURANT_INFO.name }],
  openGraph: {
    title: `${RESTAURANT_INFO.name} — QR Digital Menu`,
    description: RESTAURANT_INFO.tagline,
    url: RESTAURANT_INFO.website,
    siteName: RESTAURANT_INFO.name,
    images: [
      {
        url: RESTAURANT_INFO.logoUrl,
        width: 400,
        height: 400,
        alt: `${RESTAURANT_INFO.name} Logo`,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: RESTAURANT_INFO.logoUrl,
    apple: RESTAURANT_INFO.logoUrl,
  },
};

export const viewport: Viewport = {
  themeColor: '#090a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="min-h-screen bg-[#090a0f] text-[#f4f5f8] font-sans antialiased selection:bg-[#f3b73e]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
