import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Order, PaymentMethod } from '../types';
import { formatCurrency, isSameDay, isToday } from '../utils';
import { subDays, format, startOfDay, isSameDay as isSameDayDateFns } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Wallet, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';

interface StatsProps {
  orders: Order[];
  selectedDate: Date;
}

export const Stats: React.FC<StatsProps> = ({ orders, selectedDate }) => {
  // Generate data for the 7 days ending on selectedDate
  const data = Array.from({ length: 7 }).map((_, index) => {
    // 6 - index gives us: 6, 5, 4, 3, 2, 1, 0 days ago from selectedDate
    const date = subDays(selectedDate, 6 - index);
    const dayStart = startOfDay(date);
    
    // Sum amount for this day
    const dailyTotal = orders
      .filter(o => isSameDayDateFns(new Date(o.timestamp), dayStart))
      .reduce((sum, o) => sum + o.amount, 0);

    return {
      name: format(date, 'dd/MM', { locale: vi }),
      fullDate: format(date, 'EEEE, dd/MM', { locale: vi }),
      total: dailyTotal,
      isTargetDate: isSameDayDateFns(date, selectedDate)
    };
  });

  // Calculate Settlement info (for Selected Date)
  const targetOrders = orders.filter(o => isSameDay(o.timestamp, selectedDate));
  const cashOnHand = targetOrders
    .filter(o => o.paymentMethod === PaymentMethod.CASH)
    .reduce((sum, o) => sum + o.amount, 0);
  
  const totalRevenue = targetOrders.reduce((sum, o) => sum + o.amount, 0);
  
  const isSelectedDateToday = isToday(selectedDate.getTime());
  const dateLabel = isSelectedDateToday 
    ? "hôm nay" 
    : format(selectedDate, 'dd/MM', { locale: vi });

  return (
    <div className="space-y-8 pb-24">
      
      {/* Chart Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Doanh thu 7 ngày (đến {format(selectedDate, 'dd/MM')})</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 text-white p-3 rounded-lg shadow-xl text-xs">
                        <p className="font-bold mb-1">{payload[0].payload.fullDate}</p>
                        <p>Tổng: {formatCurrency(payload[0].value as number)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isTargetDate ? '#ea580c' : '#cbd5e1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Settlement Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-brand-100 rounded-full text-brand-600">
              <Wallet size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Tất toán {dateLabel}</h3>
          </div>
          <p className="text-sm text-gray-500">Số tiền mặt thực tế của ngày {dateLabel} cần nộp lại cho chủ shop.</p>
        </div>
        
        <div className="p-6 bg-gray-50">
           <div className="flex justify-between items-center mb-2">
             <span className="text-gray-600">Tổng doanh thu:</span>
             <span className="font-semibold text-gray-900">{formatCurrency(totalRevenue)}</span>
           </div>
           
           <div className="flex justify-between items-center pt-4 border-t border-gray-200">
             <span className="text-lg font-bold text-gray-800">Tiền mặt đang giữ:</span>
             <span className="text-2xl font-bold text-brand-600">{formatCurrency(cashOnHand)}</span>
           </div>
           
           <button 
             onClick={() => alert(`Bạn cần nộp lại: ${formatCurrency(cashOnHand)}`)}
             className="w-full mt-6 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center"
           >
             <CheckCircle size={20} className="mr-2" />
             Xác nhận đã tất toán
           </button>
        </div>
      </div>
    </div>
  );
};