import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Edit2, Image as ImageIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  onToggleStock: (id: string, currentStatus: boolean) => void;
  onEdit?: (id: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onToggleStock, onEdit }) => {
  const { currentTheme } = useTheme();
  // Local state for immediate UI feedback, though parent controls the actual data
  const [isOn, setIsOn] = useState(item.inStock);

  const handleToggle = () => {
    setIsOn(!isOn);
    onToggleStock(item.id, !isOn);
  };

  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow-sm border flex items-center space-x-4 hover:shadow-md transition-shadow"
      style={{ borderColor: currentTheme.colors.border }}
    >
      {/* Image Section */}
      <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 relative group">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ImageIcon size={24} />
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 text-lg truncate">{item.name}</h3>
        <p className="text-sm text-slate-500 mb-1">{item.category}</p>
        <p className="font-bold text-slate-900">₹{item.price.toFixed(2)}</p>
      </div>

      {/* Actions Section */}
      <div className="flex flex-col items-end space-y-3">
        {/* Custom Toggle Switch */}
        <div className="flex flex-col items-center">
          <button 
            onClick={handleToggle}
            className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${
              isOn ? '' : 'bg-slate-300'
            }`}
            style={{ backgroundColor: isOn ? currentTheme.colors.primary : undefined }}
          >
            <div 
              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                isOn ? 'translate-x-5' : 'translate-x-0'
              }`} 
            />
          </button>
          <span className="text-[10px] font-medium text-slate-400 mt-1">
            {isOn ? 'In Stock' : 'Sold Out'}
          </span>
        </div>

        <button 
          onClick={() => onEdit?.(item.id)}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Edit2 size={16} />
        </button>
      </div>
    </div>
  );
};