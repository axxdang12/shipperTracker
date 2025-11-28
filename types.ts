export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER'
}

export interface Order {
  id: string;
  orderCode: string;
  amount: number;
  paymentMethod: PaymentMethod;
  timestamp: number;
  note?: string;
}

export interface DailyStats {
  totalOrders: number;
  totalCash: number;
  totalTransfer: number;
}

export type TabView = 'DASHBOARD' | 'STATS';