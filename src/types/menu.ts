export type CategoryId =
  | 'all'
  | 'burgers'
  | 'wraps'
  | 'appetizers'
  | 'wings'
  | 'fries'
  | 'combos'
  | 'coffee'
  | 'beverages'
  | 'lemonades'
  | 'mojitos'
  | 'milkshakes';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  count?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  isVeg: boolean;
  image: string;
  badge?: string;
  description: string;
  category: CategoryId;
  subCategory?: string;
  isSpicy?: boolean;
  isChefSpecial?: boolean;
}

export type DietaryFilterType = 'all' | 'veg' | 'non-veg';
