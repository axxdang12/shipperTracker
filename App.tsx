import React, { useState, useEffect } from 'react';
import { Home, BarChart2, Calendar as CalendarIcon } from 'lucide-react';
import { TabView, Order } from './types';
import { Dashboard } from './views/Dashboard';
import { Stats } from './views/Stats';
import { format } from 'date-fns';

// Keys for local storage
const STORAGE_KEY = 'shipperbook_orders';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('DASHBOARD');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load orders from LocalStorage on mount
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem(STORAGE_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  }, []);

  // Save orders to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // Helper to handle date change from input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(new Date(e.target.value));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-brand-200">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 pt-safe-top pb-3">
        <div className="flex items-center justify-between h-14 max-w-2xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center transform -rotate-6">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 hidden xs:block">
              Shipper<span className="text-brand-600">Book</span>
            </h1>
          </div>
          
          {/* Date Picker */}
          <div className="relative flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-gray-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:bg-white transition-all">
            <CalendarIcon size={16} className="text-gray-500 mr-2 flex-shrink-0" />
            <input 
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              className="bg-transparent border-none p-0 text-sm font-semibold text-gray-700 focus:ring-0 w-28 outline-none"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 pt-6">
        {activeTab === 'DASHBOARD' ? (
          <Dashboard 
            orders={orders} 
            selectedDate={selectedDate}
            onAddOrder={handleAddOrder}
            onDeleteOrder={handleDeleteOrder}
          />
        ) : (
          <Stats 
            orders={orders} 
            selectedDate={selectedDate}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 pb-safe-bottom">
        <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === 'DASHBOARD' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home size={24} strokeWidth={activeTab === 'DASHBOARD' ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Trang chủ</span>
          </button>

          <button
            onClick={() => setActiveTab('STATS')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === 'STATS' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <BarChart2 size={24} strokeWidth={activeTab === 'STATS' ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Thống kê</span>
          </button>
        </div>
      </nav>
      
    </div>
  );
};

export default App;