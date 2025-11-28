import { Order, PaymentMethod } from './types';

// Format currency to VND
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Check if a timestamp matches a specific date
export const isSameDay = (timestamp: number, dateToCompare: Date): boolean => {
  const date = new Date(timestamp);
  return (
    date.getDate() === dateToCompare.getDate() &&
    date.getMonth() === dateToCompare.getMonth() &&
    date.getFullYear() === dateToCompare.getFullYear()
  );
};

// Check if a timestamp is from today
export const isToday = (timestamp: number): boolean => {
  return isSameDay(timestamp, new Date());
};

// Calculate daily stats for a specific date
export const calculateDailyStats = (orders: Order[], targetDate: Date): { cash: number; transfer: number; count: number } => {
  const targetOrders = orders.filter(o => isSameDay(o.timestamp, targetDate));
  
  return targetOrders.reduce(
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
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};