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
  
  // GET all products
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      // Fetching products. Limits to 100 for performance
      const response = await fetch(`${API_BASE}/products/?limit=100`, {
        headers: this.getHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch menu');
      
      const data = await response.json();
      
      // Map Backend "Product" to Frontend "MenuItem"
      // This conversion prevents frontend crashes if backend fields change
      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category_id ? 'General' : 'Other', 
        inStock: p.stock_quantity > 0,
        imageUrl: p.image_url || '',
        isActive: p.is_active
      }));
    } catch (error) {
      console.error("Menu Fetch Error:", error);
      return [];
    }
  }

  // CREATE a new product
  async addMenuItem(item: any): Promise<void> {
    const payload = {
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      category_id: 1, // Defaulting to 1 as placeholder
      stock_quantity: 100, // Default to in-stock
      image_url: item.imageUrl || null
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