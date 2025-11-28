import React, { useState, useEffect } from 'react';
import { X, Banknote, CreditCard, Save, FileText } from 'lucide-react';
import { PaymentMethod, Order } from '../types';
import { Button } from './Button';
import { generateId } from '../utils';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  targetDate?: Date; // Optional prop to specify which date the order belongs to
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({ isOpen, onClose, onSave, targetDate }) => {
  const [orderCode, setOrderCode] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setOrderCode('');
      setAmount('');
      setPaymentMethod(PaymentMethod.CASH);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Only amount is strictly required now
    if (!amount || Number(amount) <= 0) {
      setError('Số tiền phải lớn hơn 0');
      return;
    }

    // Determine timestamp
    const now = new Date();
    const orderDate = targetDate ? new Date(targetDate) : now;
    
    // Maintain current time if target date is today, otherwise use current time applied to target date
    // This preserves the sort order relative to when user entered it
    orderDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

    const newOrder: Order = {
      id: generateId(),
      orderCode: orderCode.trim(), // Can be empty string now
      amount: Number(amount),
      paymentMethod,
      timestamp: orderDate.getTime(),
    };

    onSave(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-transform animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
             Thêm đơn {targetDate ? new Date(targetDate).toLocaleDateString('vi-VN') : ''}
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          
          {/* Note Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText size={16} />
              Ghi chú đơn hàng <span className="text-gray-400 font-normal">(Tùy chọn)</span>
            </label>
            <input
              type="text"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              placeholder="VD: Khách Q.1, 2 áo thun..."
              className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-brand-500 focus:ring-0 text-lg transition-colors"
              autoFocus
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Số tiền (VNĐ) <span className="text-red-500">*</span></label>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-brand-500 focus:ring-0 text-lg transition-colors font-mono"
            />
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Hình thức thanh toán</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === PaymentMethod.CASH
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                <Banknote size={24} className="mb-1" />
                <span className="text-sm font-semibold">Tiền mặt</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.TRANSFER)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === PaymentMethod.TRANSFER
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                <CreditCard size={24} className="mb-1" />
                <span className="text-sm font-semibold">Chuyển khoản</span>
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <Button type="submit" fullWidth className="mt-2 text-lg">
            <Save className="mr-2" size={20} />
            Lưu đơn hàng
          </Button>
          
          {/* Spacer for mobile safe area */}
          <div className="h-4 sm:h-0"></div>
        </form>
      </div>
    </div>
  );
};