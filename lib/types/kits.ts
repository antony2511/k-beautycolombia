export type KitProduct = {
  id: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  category?: string | null;
};

export type KitItemWithProduct = {
  id: string;
  position: number;
  product: KitProduct;
};

export type KitWithItems = {
  id: string;
  name: string;
  tagline: string;
  description?: string | null;
  image: string;
  discount?: number | null;
  isActive: boolean;
  items: KitItemWithProduct[];
};
