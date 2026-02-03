import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { amesieService } from '../../services/amesieService';
import { MenuItemCard } from './MenuItemCard';
import { MenuItem } from '../../types/Amesie';
import { Search, Plus, Filter, Loader2, X } from 'lucide-react';

export const AmesieMenu: React.FC = () => {
  const { currentTheme } = useTheme();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', imageUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Real Data
  const fetchMenu = async () => {
    try {
      const items = await amesieService.getMenuItems();
      setMenuItems(items as any);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // 2. Handle Stock Toggle
  const handleStockToggle = async (id: string, newStatus: boolean) => {
    setMenuItems(prev => prev.map(item => 
      String(item.id) === String(id) ? { ...item, inStock: newStatus } : item
    ));

    try {
      await amesieService.updateStock(id, newStatus);
    } catch (error) {
      console.error("Failed to update stock", error);
      setMenuItems(prev => prev.map(item => 
        String(item.id) === String(id) ? { ...item, inStock: !newStatus } : item
      ));
    }
  };

  // 3. Handle Add Item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await amesieService.addMenuItem(newItem);
      setIsModalOpen(false);
      setNewItem({ name: '', price: '', description: '', imageUrl: '' });
      fetchMenu();
    } catch (error) {
      alert("Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-10" style={{ borderColor: currentTheme.colors.border }}>
        <div className="px-6 py-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Menu Items</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl text-slate-900 font-bold flex items-center space-x-2 transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: currentTheme.colors.primary }}
            >
              <Plus size={20} />
              <span>Add Item</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // UPDATED: Added text-slate-900 for black text
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              style={{ '--tw-ring-color': currentTheme.colors.primary } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-slate-400" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                onToggleStock={() => handleStockToggle(String(item.id), !item.inStock)}
              />
            ))}
          </div>
        )}
        
        {!loading && filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Filter size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No items found</p>
          </div>
        )}
      </div>

      {/* ADD ITEM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold mb-4 text-slate-900">Add New Product</h3>
            
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Product Name</label>
                {/* UPDATED: Added text-slate-900 */}
                <input required className="w-full p-3 rounded-xl border bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400" 
                  value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price (₹)</label>
                {/* UPDATED: Added text-slate-900 */}
                <input required type="number" className="w-full p-3 rounded-xl border bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400" 
                  value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                {/* UPDATED: Added text-slate-900 */}
                <input className="w-full p-3 rounded-xl border bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400" 
                  value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold mt-2 text-slate-900 transition-opacity hover:opacity-90"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                {submitting ? 'Saving...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};