// Tipos principales del ecommerce

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  ingredients?: string[];
  howToUse?: string;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  zipCode?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  ERROR = 'error',
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  documentType: 'CC' | 'CE' | 'NIT' | 'Pasaporte';
  documentNumber: string;
  address: string;
  city: string;
  department: string;
  postalCode?: string;
  deliveryInstructions?: string;
}

export interface WompiTransaction {
  id: string;
  status: 'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR';
  reference: string;
  amount_in_cents: number;
  currency: string;
  customer_email?: string;
  payment_method_type?: string;
  payment_method?: any;
  created_at?: string;
  finalized_at?: string;
}

// Auth types
export interface SkinProfile {
  skinType: string;
  isSensible: boolean;
  concerns: string[];
  preferredTexture: string;
  ageRange: string;
  routineComplexity: string;
  savedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  skinProfile?: SkinProfile;
}

export interface SavedAddress {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  zip_code?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
