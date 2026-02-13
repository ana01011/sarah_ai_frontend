import { MenuItem, DashboardStats, OrderStatus } from '../types/Amesie';

// Use the ENV variable for the API URL
const API_BASE = `${import.meta.env.VITE_API_URL || 'http://76.13.17.48:8001'}/api`;

class AmesieService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // --- MENU (PRODUCTS) ---
  
  // GET all products (seller's own products)
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      // Using seller products endpoint - no filters to get all products (active & inactive)
      const response = await fetch(`${API_BASE}/sellers/products`, {
        headers: this.getHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch menu');
      
      const data = await response.json();
      
      // Map Backend "Product" to Frontend "MenuItem"
      // This conversion prevents frontend crashes if backend fields change
      return data.map((p: any) => {
        // Get primary image from images array, or first image, or empty string
        const primaryImage = p.images?.find((img: any) => img.is_primary);
        const imageUrl = primaryImage?.image_url || p.images?.[0]?.image_url || '';
        
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category_id ? 'General' : 'Other', 
          inStock: p.stock_quantity > 0,
          imageUrl: imageUrl,
          isActive: p.is_active,
          sku: p.sku,
          stockQuantity: p.stock_quantity,
          images: p.images || []
        };
      });
    } catch (error) {
      console.error("Menu Fetch Error:", error);
      return [];
    }
  }

  // CREATE a new product
  async addMenuItem(item: any): Promise<void> {
    const payload = {
      name: item.name,
      description: item.description || null,
      price: parseFloat(item.price),
      category_id: parseInt(item.category_id) || 1,
      stock_quantity: parseInt(item.stock_quantity) || 100
    };

    const response = await fetch(`${API_BASE}/sellers/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail?.[0]?.msg || 'Failed to add product');
    }
  }

  // TOGGLE STOCK (Update Product)
  async updateStock(id: string | number, inStock: boolean): Promise<void> {
    const payload = {
      stock_quantity: inStock ? 100 : 0, // Simple logic: 0 = Out of stock
      is_active: inStock
    };

    // Note: Using the PUT endpoint from your schema
    const response = await fetch(`${API_BASE}/sellers/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Failed to update stock');
  }

  // --- DASHBOARD (Mock Data for now) ---
  async getStats(): Promise<DashboardStats> {
    // Return mock data until we identify the specific stats endpoint
    return {
      running_orders: 5,
      order_requests: 2,
      total_revenue: 15400,
      daily_revenue: [40, 70, 45, 90, 65, 80, 50],
      rating: 4.8,
      total_reviews: 124
    };
  }
}

export const amesieService = new AmesieService();