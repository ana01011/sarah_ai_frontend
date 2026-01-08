import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { OrderCard, Order, OrderStatus } from './OrderCard';
import { Search, Filter, CheckCircle } from 'lucide-react';

export const AmesieOrders: React.FC = () => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<OrderStatus>('new');

  // Mock Data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1001',
      customer: 'Rahul Sharma',
      items: ['2x Chicken Burger', '1x Coke', '1x French Fries'],
      total: 450,
      status: 'new',
      eta: '15 mins'
    },
    {
      id: '1002',
      customer: 'Priya Patel',
      items: ['1x Veg Pizza', '1x Garlic Bread'],
      total: 380,
      status: 'new',
      eta: '20 mins'
    },
    {
      id: '1003',
      customer: 'Amit Kumar',
      items: ['1x Biryani', '2x Raita'],
      total: 290,
      status: 'preparing',
      eta: '10 mins'
    },
    {
      id: '1004',
      customer: 'Sneha Gupta',
      items: ['1x Pasta Alfredo', '1x Iced Tea'],
      total: 320,
      status: 'ready',
      driver: {
        name: 'Vikram Singh',
        rating: 4.8,
        image: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=random'
      }
    }
  ]);

  // Tab Configuration
  const tabs: { id: OrderStatus; label: string; count: number }[] = [
    { id: 'new', label: 'New', count: orders.filter(o => o.status === 'new').length },
    { id: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { id: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
  ];

  // Handlers
  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(o => o.status === activeTab);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header & Tabs */}
      <div className="bg-white border-b sticky top-0 z-10" style={{ borderColor: currentTheme.colors.border }}>
        <div className="px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Orders</h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-slate-100">
              <Search size={20} className="text-slate-500" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100">
              <Filter size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex px-6 space-x-6">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-semibold flex items-center space-x-2 relative transition-colors ${
                  isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span 
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-0 w-full h-0.5 rounded-t-full"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={() => handleStatusChange(order.id, 'preparing')}
                onReject={() => console.log('Reject', order.id)}
                onReady={() => handleStatusChange(order.id, 'ready')}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <p className="text-lg font-medium">No {activeTab} orders</p>
          </div>
        )}
      </div>
    </div>
  );
};