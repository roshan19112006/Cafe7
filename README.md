# Cafe 7 — Standalone QR Code Digital Menu Website

A mobile-first, display-only QR digital menu website built for **Cafe 7** (Arcot Road, Valasaravakkam, Chennai). Customers scanning the table QR code can instantly browse the full menu with authentic food photography, interactive categories, and tap-to-preview dish popups without needing an app or payment checkout.

Reference website: [https://www.cafe7.in/](https://www.cafe7.in/)

---

## ✨ Features

1. **Standalone & Mobile-First**:
   - Engineered specifically for handheld mobile screens with smooth touch interaction.
   - Fast initial page load (~116 kB) with static optimization.
   - Dark restaurant aesthetic with obsidian backgrounds (`#090a0f`), warm amber/gold accents (`#f3b73e`), and clean typography.

2. **100% Authentic Food Photography**:
   - Features all **89 authentic menu items** with real photography from Cafe 7's production servers.
   - Zero generic placeholders.
   - Skeleton shimmer loading and graceful image fallbacks.

3. **Interactive Category Filtering**:
   - Sticky horizontal category pill bar with live count badges and smooth auto-scrolling:
     - **Burgers** (Chicken Crunch, Grilled Chicken, Veg Burgers)
     - **Wraps** (Shawarma, Golden Honey, Paneer BBQ, Mushroom Melt)
     - **Appetizers** (Cheese poppers, Nuggets, Chicken Cheese Balls)
     - **Wings** (BBQ Wings, Volcano Peri Peri, Crispy Tenders)
     - **Fries** (Classic, Peri Peri, Battlefield Loaded Fries)
     - **Combos** (Value food & beverage pairings)
     - **Coffee** (Americano, Velvet Lattes, Spanish Velvet Iced Latte)
     - **Beverages** (Craft refreshers, Iced Teas, Chilled sodas)
     - **Lemonades** (Citrus, Mint Zest, Mango Splash, Blueberry)
     - **Mojitos** (Classic Mint, Blue Lagoon, Watermelon, Mango)
     - **Milkshakes** (Vanilla Velvet, Midnight Chocolate, Salted Caramel)
     - **All Items** (Complete catalog exploration)

4. **Food Image Preview Modal (Popup)**:
   - Tap any card to open a high-resolution modal.
   - Displays large image, dish name, price in ₹, full preparation description, dietary tags (FSSAI 🟢 Veg / 🔴 Non-Veg), and special badges (Chef's Special, Trending, Popular, Spicy).
   - Fast next/previous dish navigation directly inside the modal.
   - Table-side order assistant banner reminding guests to place their order with their table server.

5. **Table QR Code Generator & Standee Exporter**:
   - Dynamic table number switcher (`Table #01` to `#25` via dropdown or `?table=07` query parameter).
   - Real-time SVG QR code pointing directly to the website.
   - **One-click "Download Standee"** button that renders a high-resolution, print-ready restaurant table standee graphic (1000 × 1400 PNG) ready to print and laminate for tables.

6. **Display-Only Compliance**:
   - Strictly display-only for dine-in tables.
   - **NO** cart, checkout, order-now, or payment gateway clutter.
   - Server call assistance via direct phone links and table numbers.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **QR Engine**: `qrcode.react` (SVG) + HTML5 Canvas Standee Renderer
- **Animations**: Framer Motion & CSS Keyframes

---

## 📂 Project Structure

```
cafe7-menu/
├── src/
│   ├── app/
│   │   ├── globals.css          # Dark theme, skeleton shimmer, scrollbar styling
│   │   ├── layout.tsx           # SEO metadata, OpenGraph tags, mobile viewport
│   │   └── page.tsx             # Interactive menu page with filters & modals
│   ├── components/
│   │   ├── Header.tsx           # Brand header, table switcher, QR trigger
│   │   ├── CategoryNav.tsx      # Sticky horizontal category selector
│   │   ├── SearchBar.tsx        # Live text search & Veg/Non-Veg filter
│   │   ├── MenuCard.tsx         # Reusable food card with image, price & badges
│   │   ├── FoodModal.tsx        # High-res image preview popup with next/prev
│   │   ├── QrCodeModal.tsx      # Scannable QR code & canvas standee download
│   │   └── Footer.tsx           # Address, hours, Instagram, phone links
│   ├── data/
│   │   └── menu.ts              # Master menu dataset (89 items, 12 categories)
│   └── types/
│       └── menu.ts              # TypeScript interfaces for items & categories
├── public/                      # Static assets
├── next.config.mjs              # Image domains & optimization settings
├── tailwind.config.ts           # Custom color palette & typography
└── tsconfig.json                # TypeScript compiler config
```

---

## 🚀 Running Locally

1. Open PowerShell / Terminal in the project directory:
   ```bash
   cd C:\Users\Barath\.gemini\antigravity\scratch\cafe7-menu
   ```

2. Start the local development server:
   ```bash
   npm.cmd run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser (or use DevTools mobile emulation with iPhone/Pixel view).

---

## ☁️ Deploying to Vercel (Free Hosting)

Deploying this website to Vercel is completely free and takes under 2 minutes:

### Option A: Via GitHub (Recommended)
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Cafe 7 QR digital menu"
   ```
2. Create a new repository on GitHub (e.g. `cafe7-menu`) and push your code:
   ```bash
   git remote add origin https://github.com/<your-username>/cafe7-menu.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [https://vercel.com/new](https://vercel.com/new), select your GitHub repository, and click **Deploy**.
4. Vercel automatically detects Next.js, compiles the build, and provides a free production URL like:
   `https://cafe7-menu.vercel.app`

### Option B: Via Vercel CLI
1. Run:
   ```bash
   npx vercel
   ```
2. Log in with your free Vercel account and follow the simple on-screen prompts.
3. To deploy directly to production:
   ```bash
   npx vercel --prod
   ```

---

## ✏️ How to Edit Prices and Menu Items

All restaurant information, category definitions, and menu items are stored in a single, well-documented file:
**`src/data/menu.ts`**

### To change a price:
Locate the item in `MENU_ITEMS` and update the `price` field:
```typescript
{
  id: "cb-1",
  name: "Classic Big Crunch Burger",
  price: 269, // Updated from 259
  ...
}
```

### To update an image:
Change the `image` URL:
```typescript
image: "https://www.cafe7.in/images/items/new-burger-photo.webp"
```

### To add a new dish:
Add an entry to `MENU_ITEMS` with the appropriate category:
```typescript
{
  id: "cb-custom",
  name: "Truffle Crunch Burger",
  price: 320,
  isVeg: false,
  image: "https://www.cafe7.in/images/items/truffle-burger.webp",
  badge: "New",
  description: "Crispy fried chicken breast infused with black truffle sauce on buttered brioche.",
  category: "burgers",
  subCategory: "Chicken Crunch Burgers",
  isSpicy: false,
  isChefSpecial: true
}
```
