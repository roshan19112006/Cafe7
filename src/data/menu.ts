export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  isVeg: boolean;
  isSpicy?: boolean;
  image: string;
  badge?: string;
  pieces?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  items: MenuItem[];
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "chicken-crunch-burgers",
    name: "Chicken Crunch Burgers",
    description: "Crispy, juicy chicken patties with signature sauces & fresh brioche buns",
    items: [
      {
        id: "cb-1",
        name: "Classic Big Crunch Burger",
        category: "chicken-crunch-burgers",
        price: 249,
        isVeg: false,
        image: "/images/items/classic-big-crunch-burger.webp",
        badge: "Popular",
        description: "Golden fried crispy chicken breast patty, fresh iceberg lettuce, house mayo on toasted brioche."
      },
      {
        id: "cb-2",
        name: "Powerhouse BBQ Burger",
        category: "chicken-crunch-burgers",
        price: 269,
        isVeg: false,
        image: "/images/items/powerhouse-bbq-burger.webp",
        description: "Crunchy fried chicken smothered with smoky BBQ glaze, caramelized onions and melted cheese."
      },
      {
        id: "cb-3",
        name: "Thriller Burger",
        category: "chicken-crunch-burgers",
        price: 279,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/thriller-burger.webp",
        badge: "Chef's Special",
        description: "Spicy crunch chicken patty dressed in fiery relish, jalapeños, and spiced signature sauce."
      },
      {
        id: "cb-4",
        name: "Honey Queen Burger",
        category: "chicken-crunch-burgers",
        price: 289,
        isVeg: false,
        image: "/images/items/honey-queen-burger.webp",
        description: "Crispy chicken glazed in sweet hot honey mustard, crispy slaw and creamy cheese."
      },
      {
        id: "cb-5",
        name: "K-Pop Sesame Burger",
        category: "chicken-crunch-burgers",
        price: 289,
        isVeg: false,
        image: "/images/items/k-pop-sesame-burger.webp",
        badge: "Trending",
        description: "Korean glazed crunchy chicken patty topped with toasted sesame seeds and tangy kimchi slaw."
      },
      {
        id: "cb-6",
        name: "Wildfire Chipotle Burger",
        category: "chicken-crunch-burgers",
        price: 299,
        isVeg: false,
        image: "/images/items/wildfire-chipotle-burger.webp",
        description: "Smoky chipotle infused crispy chicken, pepper jack melt, and crispy golden onion rings."
      }
    ]
  },
  {
    id: "grilled-chicken-burgers",
    name: "Grilled Chicken Burgers",
    description: "Tender herb-marinated grilled chicken fillets flame-seared to perfection",
    items: [
      {
        id: "gb-1",
        name: "Signature Grilled Burger",
        category: "grilled-chicken-burgers",
        price: 219,
        isVeg: false,
        image: "/images/items/signature-grilled-burger.webp",
        description: "Herb marinated flame-grilled chicken breast, garlic aioli, tomato and fresh crisp greens."
      },
      {
        id: "gb-2",
        name: "Spicy Grilled Burger",
        category: "grilled-chicken-burgers",
        price: 229,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/spicy-grilled-burger.webp",
        description: "Fiery flame-grilled chicken patty topped with spicy dip and charred peppers."
      },
      {
        id: "gb-3",
        name: "Double Stack Grilled Burger",
        category: "grilled-chicken-burgers",
        price: 289,
        isVeg: false,
        image: "/images/items/double-stack-grilled-burger.webp",
        badge: "Heavy Hitter",
        description: "Twin grilled chicken patties, double cheddar slice, and Café 7 signature smokey sauce."
      },
      {
        id: "gb-4",
        name: "Double Stack Spicy Grilled Burger",
        category: "grilled-chicken-burgers",
        price: 299,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/double-stack-spicy-grilled-burger.webp",
        description: "Double flame-grilled spicy patties loaded with spicy jalapeño sauce and Monterey cheese."
      }
    ]
  },
  {
    id: "veg-burgers",
    name: "Veg Burgers",
    description: "Artisanal vegetarian patties prepared with premium veggies, paneer & melted cheeses",
    items: [
      {
        id: "vb-1",
        name: "Garden Crunch Burger",
        category: "veg-burgers",
        price: 209,
        isVeg: true,
        image: "/images/items/gardern-crunch-burger.webp",
        description: "Crisp seasoned garden vegetable patty, crisp lettuce, sliced tomatoes and tangy herb mayo."
      },
      {
        id: "vb-2",
        name: "Spicy Garden Burger",
        category: "veg-burgers",
        price: 209,
        isVeg: true,
        isSpicy: true,
        image: "/images/items/spicy-gardern-burger.webp",
        description: "Zesty spiced veggie patty with spicy chipotle sauce, pickled gherkins and jalapeños."
      },
      {
        id: "vb-3",
        name: "Mushroom Melt Burger",
        category: "veg-burgers",
        price: 229,
        isVeg: true,
        image: "/images/items/mushroom-burger.webp",
        badge: "Gourmet",
        description: "Sautéed garlic button mushrooms, Swiss cheese melt, and savoury caramelized onion spread."
      },
      {
        id: "vb-4",
        name: "Paneer Royale Burger",
        category: "veg-burgers",
        price: 229,
        isVeg: true,
        image: "/images/items/panner-burger.webp",
        badge: "Bestseller",
        description: "Crispy crusted spiced cottage cheese block, makhani drizzle, crisp onions and minted yogurt spread."
      }
    ]
  },
  {
    id: "wraps",
    name: "Wraps",
    description: "Freshly rolled soft tortillas packed with fresh greens, signature fillings & dips",
    items: [
      {
        id: "wr-1",
        name: "Persian Shawarma Wrap",
        category: "wraps",
        price: 219,
        isVeg: false,
        image: "/images/items/persian-shawarma-wrap.webp",
        badge: "Authentic",
        description: "Slow-roasted marinated chicken strips, pickled turnip, fries, and authentic garlic toum."
      },
      {
        id: "wr-2",
        name: "Golden Honey Wrap",
        category: "wraps",
        price: 229,
        isVeg: false,
        image: "/images/items/goldern-honey-wrap.webp",
        description: "Crispy golden chicken tenders, honey mustard sauce, shredded iceberg and cheddar."
      },
      {
        id: "wr-3",
        name: "Mushroom Melt Wrap",
        category: "wraps",
        price: 239,
        isVeg: true,
        image: "/images/items/mushroom-melt-burger.webp",
        description: "Pan-roasted mushrooms smothered in molten cheddar and mozzarella blend in a warm tortilla."
      },
      {
        id: "wr-4",
        name: "Smoky Paneer Wrap",
        category: "wraps",
        price: 239,
        isVeg: true,
        image: "/images/items/smokey-panner-wrap.webp",
        description: "Clay oven smoked paneer cubes, charred peppers, mint coriander chutney and spiced onions."
      },
      {
        id: "wr-5",
        name: "Wildfire Chipotle Wrap",
        category: "wraps",
        price: 269,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/wildfire-chipotle-wrap.webp",
        description: "Spicy flame-grilled chicken strips, habanero chipotle glaze, bell peppers and shredded cheese."
      }
    ]
  },
  {
    id: "appetizers",
    name: "Appetizers",
    description: "Crowd favorite crunchies, poppers and cheesy bites for sharing",
    items: [
      {
        id: "ap-1",
        name: "Jalapeño Cheese Poppers",
        category: "appetizers",
        price: 199,
        isVeg: true,
        image: "/images/items/jalapeno-cheese-poppers.webp",
        badge: "Hot & Cheesy",
        description: "Golden crumbed bite-sized bites bursting with molten cheddar and spicy jalapeño bits."
      },
      {
        id: "ap-2",
        name: "Golden Chicken Nuggets",
        category: "appetizers",
        price: 229,
        isVeg: false,
        image: "/images/items/chicken-nuggets.webp",
        badge: "Kids & All",
        description: "Tender minced chicken breast nuggets fried to deep golden crunch, served with tangy dip."
      },
      {
        id: "ap-3",
        name: "Chicken Cheese Balls",
        category: "appetizers",
        price: 249,
        isVeg: false,
        image: "/images/items/chicken-cheese-balls.webp",
        badge: "Must Try",
        description: "Crispy seasoned chicken spheres oozing with molten gooey mozzarella cheese."
      },
      {
        id: "ap-4",
        name: "Firecracker Chicken Bites",
        category: "appetizers",
        price: 219,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/fire-crackers-chicken-bites.webp",
        badge: "Fiery",
        description: "Crunchy bite-sized chicken pops tossed in a fiery, lip-smacking firecracker seasoning."
      },
      {
        id: "ap-5",
        name: "Honey Glaze Popcorn",
        category: "appetizers",
        price: 229,
        isVeg: false,
        image: "/images/items/honey-glaze-popcorn.webp",
        description: "Crispy chicken popcorn tossed in rich sweet honey glaze with mild smoky spices."
      }
    ]
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    description: "Juicy jumbo wings glazed in chef's artisanal sauces and peri peri sprinkles",
    items: [
      {
        id: "cw-1",
        name: "Fire Kiss Wings (BBQ Sauce)",
        category: "chicken-wings",
        price: 260,
        isVeg: false,
        image: "/images/items/fire-kiss-bbq-wings.webp",
        badge: "BBQ Classic",
        description: "Crispy chicken wings generously coated in sweet, smoky and thick fire-kissed BBQ sauce."
      },
      {
        id: "cw-2",
        name: "Volcano Wings (Peri Peri)",
        category: "chicken-wings",
        price: 270,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/volcano-peri-peri-wings.webp",
        badge: "Hot Favorite",
        description: "Jumbo wings tossed in hot African bird's eye peri-peri seasoning and citrus herb dust."
      },
      {
        id: "cw-3",
        name: "Korean Hot Wings (Korean Sauce)",
        category: "chicken-wings",
        price: 270,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/korean-hot-wings.webp",
        badge: "Sweet & Spicy",
        description: "Authentic gochujang glazed sticky wings garnished with toasted sesame seeds and spring onion."
      },
      {
        id: "cw-4",
        name: "Red Blast Wings (Hot Wings Sauce)",
        category: "chicken-wings",
        price: 270,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/red-blast-hot-wings1.webp",
        badge: "Extra Hot",
        description: "Blistering hot buffalo-style red blast glaze that delivers an unforgettable kick."
      }
    ]
  },
  {
    id: "chicken-tenders",
    name: "Chicken Tenders",
    description: "100% whole muscle chicken breast strips, breaded and fried to crisp perfection",
    items: [
      {
        id: "ct-1",
        name: "Crispy Chicken Tenders (2 Pieces)",
        category: "chicken-tenders",
        price: 179,
        isVeg: false,
        image: "/images/items/chicken-tender-2-pcs.webp",
        pieces: "2 Pieces",
        description: "Hand-breaded whole white chicken breast tenders with honey mustard or garlic dip."
      },
      {
        id: "ct-2",
        name: "Crispy Chicken Tenders (3 Pieces)",
        category: "chicken-tenders",
        price: 239,
        isVeg: false,
        image: "/images/items/chicken-tender-3-pcs.webp",
        pieces: "3 Pieces",
        description: "Tender, crispy breast strips served hot with choice of dip."
      },
      {
        id: "ct-3",
        name: "Crispy Chicken Tenders (4 Pieces)",
        category: "chicken-tenders",
        price: 299,
        isVeg: false,
        image: "/images/items/chicken-tender-4-pcs.webp",
        pieces: "4 Pieces",
        description: "4 jumbo crispy chicken tenders paired with our signature dip."
      },
      {
        id: "ct-4",
        name: "Texas BBQ Tenders (4 Pieces)",
        category: "chicken-tenders",
        price: 309,
        isVeg: false,
        image: "/images/items/texas-bbq-tender.webp",
        pieces: "4 Pieces",
        description: "4 signature chicken tenders drenched in rich hickory Texas barbecue glaze."
      },
      {
        id: "ct-5",
        name: "Seoul Spice Tenders (4 Pieces)",
        category: "chicken-tenders",
        price: 319,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/seoul-spice-tender.webp",
        pieces: "4 Pieces",
        description: "Korean style sweet-spicy glazed chicken tenders with toasted sesame seeds."
      },
      {
        id: "ct-6",
        name: "Cajun Spice Tenders (4 Pieces)",
        category: "chicken-tenders",
        price: 319,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/cajun-spice-tender.webp",
        pieces: "4 Pieces",
        description: "Deep south Louisiana Cajun dusted crispy tenders bursting with bold aromatics."
      },
      {
        id: "ct-7",
        name: "Café 7 Signature Spicy Tenders (4 Pieces)",
        category: "chicken-tenders",
        price: 319,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/cafe-7-signature-spicy-tender.webp",
        pieces: "4 Pieces",
        badge: "House Special",
        description: "Drizzled with our proprietary house-made spiced ranch and signature seasoning."
      }
    ]
  },
  {
    id: "fries",
    name: "Fries & Crispers",
    description: "Golden imported potatoes fried to golden crunch with artisanal seasonings",
    items: [
      {
        id: "fr-1",
        name: "Classic Fries",
        category: "fries",
        price: 129,
        isVeg: true,
        image: "/images/items/classic-fries.webp",
        description: "Crisp, golden shoestring potatoes salted to perfection."
      },
      {
        id: "fr-2",
        name: "Nashville Heat Fries",
        category: "fries",
        price: 139,
        isVeg: true,
        isSpicy: true,
        image: "/images/items/nashville-fries.webp",
        description: "Dusted with authentic fiery Nashville cayenne pepper and brown sugar spice blend."
      },
      {
        id: "fr-3",
        name: "Peri Peri Fries",
        category: "fries",
        price: 139,
        isVeg: true,
        isSpicy: true,
        image: "/images/items/periperi-fries.webp",
        description: "Shaken with zesty peri peri spice seasoning for that punchy kick."
      }
    ]
  },
  {
    id: "loaded-fries",
    name: "Loaded Fries",
    description: "Generous platters of hot fries topped with cheeses, jalapeños and meats",
    items: [
      {
        id: "lf-1",
        name: "Commando Loaded Fries (Veg)",
        category: "loaded-fries",
        price: 189,
        isVeg: true,
        image: "/images/items/commando-loaded-fries.webp",
        description: "Fries loaded with liquid cheese, sliced jalapeños, olives, and Café 7 secret spicy sauce."
      },
      {
        id: "lf-2",
        name: "Battlefield Loaded Fries (Chicken)",
        category: "loaded-fries",
        price: 279,
        isVeg: false,
        image: "/images/items/battlefield-loaded-fries.webp",
        badge: "Carnivore Feast",
        description: "Heaped with shredded seasoned chicken, smoked bacon bits, melted cheddar, and ranch."
      },
      {
        id: "lf-3",
        name: "Volcano Spicy Loaded Fries",
        category: "loaded-fries",
        price: 289,
        isVeg: false,
        isSpicy: true,
        image: "/images/items/volcano-spicy-loaded-fries.webp",
        description: "Spicy chicken bites, hot peri-peri cheese sauce, crushed chilies, and fiery jalapeños."
      }
    ]
  },
  {
    id: "hot-cold-coffee",
    name: "Hot & Cold Coffee",
    description: "Brewed from 100% Arabica specialty coffee beans, expertly pulled and styled",
    items: [
      {
        id: "cf-1",
        name: "Classic Latte",
        category: "hot-cold-coffee",
        price: 139,
        isVeg: true,
        image: "/images/items/latte.webp",
        description: "Smooth espresso poured over creamy steamed milk with a silky layer of microfoam."
      },
      {
        id: "cf-2",
        name: "Classic Latte (Artisan Foam)",
        category: "hot-cold-coffee",
        price: 139,
        isVeg: true,
        image: "/images/items/l.webp",
        badge: "Artisan Pour",
        description: "Masterfully textured microfoam latte art over rich double espresso."
      },
      {
        id: "cf-3",
        name: "Classic Cappuccino",
        category: "hot-cold-coffee",
        price: 139,
        isVeg: true,
        image: "/images/items/cappuccino.webp",
        description: "Equal parts rich espresso, steamed milk, and velvety thick froth dusted with cocoa."
      },
      {
        id: "cf-4",
        name: "Vanilla Velvet Latte",
        category: "hot-cold-coffee",
        price: 179,
        isVeg: true,
        image: "/images/items/vanilla-velvet-latte.webp",
        badge: "Signature",
        description: "Madagascar vanilla infused velvety milk combined with our medium dark roast espresso."
      },
      {
        id: "cf-5",
        name: "Caramel Latte",
        category: "hot-cold-coffee",
        price: 189,
        isVeg: true,
        image: "/images/items/caramel-latte.webp",
        badge: "Featured",
        description: "Buttery English caramel syrup swirled into rich espresso and steamed velvety milk."
      },
      {
        id: "cf-6",
        name: "Salted Caramel Latte",
        category: "hot-cold-coffee",
        price: 189,
        isVeg: true,
        image: "/images/items/salted-caramel-latte.webp",
        badge: "Chef's Choice",
        description: "Rich caramel espresso layered over chilled textured milk with gourmet sea salt flakes."
      },
      {
        id: "cf-7",
        name: "Irish Cream Latte",
        category: "hot-cold-coffee",
        price: 189,
        isVeg: true,
        image: "/images/items/irish-latte.webp",
        badge: "Staff Pick",
        description: "Non-alcoholic smooth Irish cream syrup folded into dark espresso and topped with cocoa."
      },
      {
        id: "cf-8",
        name: "Spanish Velvet Latte",
        category: "hot-cold-coffee",
        price: 189,
        isVeg: true,
        image: "/images/items/spanish-latte.webp",
        badge: "Bestseller",
        description: "Condensed milk base layered with espresso and textured milk for an ultra silky sweet finish."
      },
      {
        id: "cf-9",
        name: "Spanish Velvet Iced Latte",
        category: "hot-cold-coffee",
        price: 189,
        isVeg: true,
        image: "/images/items/spanish-velvet-ice-latte.webp",
        badge: "Cold Signature",
        description: "Chilled condensed milk espresso blend poured over ice with a rich velvety cascade."
      },
      {
        id: "cf-10",
        name: "Hazelnut Harmony Latte",
        category: "hot-cold-coffee",
        price: 199,
        isVeg: true,
        image: "/images/items/hazelnut-latte.webp",
        description: "Aromatic toasted hazelnut notes harmonized with smooth espresso and frothy milk."
      },
      {
        id: "cf-11",
        name: "Coconut Bliss Latte",
        category: "hot-cold-coffee",
        price: 199,
        isVeg: true,
        image: "/images/items/coconut-latte.webp",
        description: "Creamy coconut notes paired with espresso for a tropical coffee experience."
      }
    ]
  }
];
