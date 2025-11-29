import React, { useState } from 'react';
import { Order, PaymentMethod, Shift } from '../types';
import { formatCurrency, isSameDay, isToday } from '../utils';
import { Package, Banknote, CreditCard, Trash2, Plus, TrendingUp, Sun, Moon, Layers } from 'lucide-react';
import { Button } from '../components/Button';
import { OrderFormModal } from '../components/OrderFormModal';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DashboardProps {
  orders: Order[];
  selectedDate: Date;
  onAddOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ orders, selectedDate, onAddOrder, onDeleteOrder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterShift, setFilterShift] = useState<'ALL' | Shift>('ALL');
  
  // Helper to determine order shift (compatible with old data)
  const getOrderShift = (order: Order): Shift => {
    if (order.shift) return order.shift;
    // Fallback logic for old data: >= 18h is Night Shift
    const hour = new Date(order.timestamp).getHours();
    return hour >= 18 ? Shift.NIGHT : Shift.DAY;
  };

  // Filter orders by Date AND Shift
  const displayOrders = orders
    .filter(o => isSameDay(o.timestamp, selectedDate))
    .filter(o => filterShift === 'ALL' || getOrderShift(o) === filterShift)
    .sort((a, b) => b.timestamp - a.timestamp);

  // Calculate stats based on FILTERED orders
  const stats = displayOrders.reduce(
    (acc, order) => {
      acc.count += 1;
      if (order.paymentMethod === PaymentMethod.CASH) {
        acc.cash += order.amount;
      } else {
        acc.transfer += order.amount;
      }
      return acc;
    },
    { cash: 0, transfer: 0, count: 0 }
  );
  
  const totalRevenue = stats.cash + stats.transfer;
  
  const isSelectedDateToday = isToday(selectedDate.getTime());
  const dateLabel = isSelectedDateToday 
    ? "Hôm nay" 
    : format(selectedDate, 'EEEE, dd/MM', { locale: vi });

  return (
    <div className="space-y-6 pb-24">
      
      {/* Shift Filter Control */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
        <button
          onClick={() => setFilterShift('ALL')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center transition-all ${
            filterShift === 'ALL' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Layers size={16} className="mr-1.5" /> Cả ngày
        </button>
        <button
          onClick={() => setFilterShift(Shift.DAY)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center transition-all ${
            filterShift === Shift.DAY ? 'bg-orange-500 text-white shadow' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Sun size={16} className="mr-1.5" /> Ca Sáng
        </button>
        <button
          onClick={() => setFilterShift(Shift.NIGHT)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center transition-all ${
            filterShift === Shift.NIGHT ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Moon size={16} className="mr-1.5" /> Ca Tối
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Total Revenue - Hero Card (Full Width) */}
        <div className="col-span-2 bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-5 text-white shadow-lg shadow-brand-500/30">
          <div className="flex items-center space-x-2 mb-1 opacity-90">
            <TrendingUp size={20} />
            <span className="text-sm font-medium">Doanh thu {dateLabel}</span>
          </div>
          <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalRevenue)}</p>
          <div className="mt-1 text-xs opacity-70 font-medium">
             {filterShift === 'ALL' ? '(Cả ngày)' : filterShift === Shift.DAY ? '(Ca Sáng)' : '(Ca Tối)'}
          </div>
        </div>

        {/* Cash Stats */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-green-600 mb-2">
            <Banknote size={20} />
            <span className="text-xs font-bold uppercase text-gray-500">Tiền mặt</span>
          </div>
          <p className="text-lg font-bold text-gray-900 truncate">
            {formatCurrency(stats.cash)}
          </p>
        </div>

        {/* Transfer Stats */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <CreditCard size={20} />
            <span className="text-xs font-bold uppercase text-gray-500">CK</span>
          </div>
          <p className="text-lg font-bold text-gray-900 truncate">
            {formatCurrency(stats.transfer)}
          </p>
        </div>

        {/* Total Orders Count (Full Width Strip) */}
        <div className="col-span-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Package size={18} /> Số đơn {filterShift === 'ALL' ? '' : filterShift === Shift.DAY ? 'Ca Sáng' : 'Ca Tối'}
          </span>
          <span className="text-xl font-bold text-gray-800">{stats.count}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center px-1 pt-2">
        <h2 className="text-xl font-bold text-gray-800">Danh sách ({displayOrders.length})</h2>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {displayOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Package size={48} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          displayOrders.map((order) => {
            const shift = getOrderShift(order);
            return (
              <div 
                key={order.id} 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center space-x-4 overflow-hidden">
                  <div className={`p-3 rounded-full flex-shrink-0 ${order.paymentMethod === PaymentMethod.CASH ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {order.paymentMethod === PaymentMethod.CASH ? <Banknote size={20} /> : <CreditCard size={20} />}
                  </div>
                  <div className="min-w-0">
                    {/* Note/Description */}
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-gray-800 text-lg truncate pr-2">
                        {order.orderCode ? order.orderCode : <span className="text-gray-400 font-normal italic">Không có ghi chú</span>}
                      </h3>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {/* Shift Icon */}
                      {shift === Shift.DAY ? <Sun size={12} className="text-orange-500" /> : <Moon size={12} className="text-indigo-600" />}
                      <span>{new Date(order.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit'})}</span>
                      <span>•</span>
                      <span className={order.paymentMethod === PaymentMethod.CASH ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
                        {order.paymentMethod === PaymentMethod.CASH ? 'Tiền mặt' : 'Chuyển khoản'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                  <span className="text-green-600 font-bold text-lg">
                    +{formatCurrency(order.amount)}
                  </span>
                  <button 
                    onClick={() => {
                      if(window.confirm('Bạn có chắc chắn muốn xóa đơn này?')) {
                          onDeleteOrder(order.id);
                      }
                    }}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button (FAB) specifically for Mobile */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-4 md:hidden w-14 h-14 bg-brand-600 text-white rounded-full shadow-lg shadow-brand-500/40 flex items-center justify-center hover:bg-brand-700 active:scale-90 transition-all z-40"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

       {/* Desktop/Tablet Add Button (Hidden on Mobile) */}
      <div className="hidden md:flex justify-center mt-6">
          <Button onClick={() => setIsModalOpen(true)} className="w-64">
             <Plus className="mr-2" /> Thêm đơn hàng
          </Button>
      </div>

      <OrderFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={onAddOrder} 
        targetDate={selectedDate}
      />
    </div>
  );
};