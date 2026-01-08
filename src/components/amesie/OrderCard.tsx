import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle, Clock, Star, X, Check } from 'lucide-react';

export type OrderStatus = 'new' | 'preparing' | 'ready';

export interface Order {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: OrderStatus;
  eta?: string;
  driver?: {
    name: string;
    rating: number;
    image: string;
  };
}

interface OrderCardProps {
  order: Order;
  onAccept?: () => void;
  onReject?: () => void;
  onReady?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onAccept, onReject, onReady }) => {
  const { currentTheme } = useTheme();

  const renderButtons = () => {
    switch (order.status) {
      case 'new':
        return (
          <div className="flex space-x-3">
            <button 
              onClick={onReject}
              className="flex-1 py-3 rounded-xl border border-red-500 text-red-500 font-bold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
            >
              <X size={18} />
              <span>Reject</span>
            </button>
            <button 
              onClick={onAccept}
              className="flex-1 py-3 rounded-xl font-bold text-slate-800 transition-transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              style={{ backgroundColor: currentTheme.colors.primary }}
            >
              <Check size={18} />
              <span>Accept</span>
            </button>
          </div>
        );
      case 'preparing':
        return (
          <button 
            onClick={onReady}
            className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 flex items-center justify-center space-x-2"
            style={{ backgroundColor: currentTheme.colors.secondary }}
          >
            <CheckCircle size={18} />
            <span>Ready for Pickup</span>
          </button>
        );
      case 'ready':
        return order.driver ? (
          <div className="flex items-center p-2 bg-slate-50 rounded-lg">
            <img 
              src={order.driver.image} 
              alt={order.driver.name} 
              className="w-10 h-10 rounded-full object-cover mr-3 bg-slate-200"
            />
            <div className="flex-1">
              <p className="font-bold text-sm text-slate-800">{order.driver.name}</p>
              <div className="flex items-center text-xs text-slate-500">
                <Star size={12} className="text-amber-400 fill-current mr-1" />
                <span>{order.driver.rating.toFixed(1)} Rating</span>
              </div>
            </div>
            <span className="text-xs font-medium text-green-600 px-2 py-1 bg-green-100 rounded">
              Driver Assigned
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 py-2 text-green-600 bg-green-50 rounded-xl">
            <CheckCircle size={20} />
            <span className="font-bold">Waiting for Driver</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl p-5 shadow-sm border mb-4 hover:shadow-md transition-shadow"
      style={{ borderColor: currentTheme.colors.border }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">Order #{order.id}</h3>
        {order.eta && (
          <div className="flex items-center text-slate-500 text-sm">
            <Clock size={14} className="mr-1" />
            <span>{order.eta}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="mb-4">
        <p className="text-base font-semibold text-slate-700 mb-1">{order.customer}</p>
        <p className="text-sm text-slate-500 leading-relaxed">{order.items.join(' • ')}</p>
      </div>

      {/* Price */}
      <div className="flex justify-end items-center mb-4 pb-4 border-b border-slate-100">
        <span className="text-slate-400 text-sm mr-2">Total:</span>
        <span className="text-xl font-bold text-slate-800">₹{order.total.toFixed(2)}</span>
      </div>

      {/* Footer Actions */}
      <div>
        {renderButtons()}
      </div>
    </div>
  );
};