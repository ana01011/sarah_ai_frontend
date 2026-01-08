import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { MenuItemCard, MenuItem } from './MenuItemCard';
import { Search, Plus, Filter } from 'lucide-react';

export const AmesieMenu: React.FC = () => {
  const { currentTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Chicken Burger',
      price: 180,
      category: 'Burger',
      inStock: true,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '2',
      name: 'Veg Loaded Pizza',
      price: 240,
      category: 'Pizza',
      inStock: true,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '3',
      name: 'Iced Americano',
      price: 120,
      category: 'Drinks',
      inStock: false,
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '4',
      name: 'French Fries',
      price: 90,
      category: 'Sides',
      inStock: true,
      imageUrl: 'https://images.unsplash.com/photo-1541592103048-b860a13a4676?auto=format&fit=crop&w=150&q=80'
    }
  ]);

  const categories = ['All', 'Burger', 'Pizza', 'Drinks', 'Sides'];

  const handleStockToggle = (id: string, newStatus: boolean) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, inStock: newStatus } : item
    ));
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-10" style={{ borderColor: currentTheme.colors.border }}>
        <div className="px-6 py-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Menu Items</h2>
            <button 
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
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:bg-white transition-all"
              style={{ '--tw-ring-color': currentTheme.colors.primary } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Categories Tab */}
        <div className="flex px-6 space-x-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeCategory === category 
                  ? 'text-slate-900' 
                  : 'bg-white border text-slate-500 hover:bg-slate-50'
              }`}
              style={{ 
                backgroundColor: activeCategory === category ? currentTheme.colors.primary : undefined,
                borderColor: currentTheme.colors.border 
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              onToggleStock={handleStockToggle}
            />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Filter size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm">Try changing the category or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};