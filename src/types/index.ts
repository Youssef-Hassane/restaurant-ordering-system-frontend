// Currency types
export type Currency = 'USD' | 'EUR' | 'GBP' | 'EGP' | 'SAR' | 'AED' | 'JPY' | 'CAD' | 'AUD';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  EGP: 'E£',
  SAR: '﷼',
  AED: 'د.إ',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$'
};

// User types
export type UserRole = 'admin' | 'manager' | 'cashier';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: Currency;
  image_url: string | null;
  category: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  currency?: Currency;
  image_url?: string;
  category: string;
  available?: boolean;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order types
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'completed' 
  | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  currency: Currency;
  total_price: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  total_amount: number;
  currency: Currency;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  items: { product_id: string; quantity: number }[];
  notes?: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}