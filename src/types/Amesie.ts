// src/types/Amesie.ts

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Driver {
  name: string;
  rating: number;
  image: string;
  phone?: string;
}

export interface Order {
  id: string;
  customer: string;
  items: string[]; // Or you can make this more detailed if needed
  total: number;
  status: OrderStatus;
  eta?: string;
  driver?: Driver;
  created_at?: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  product_id: number;
  created_at: string;
}

export interface MenuItem {
  id: string | number; // Backend uses number, frontend often treats IDs as strings
  name: string;
  description?: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl: string;
  isActive?: boolean;
  sku?: string;
  stockQuantity?: number;
  images?: ProductImage[];
}

export interface DashboardStats {
  running_orders: number;
  order_requests: number;
  total_revenue: number;
  daily_revenue: number[]; // For the chart
  rating: number;
  total_reviews: number;
}