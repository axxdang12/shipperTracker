export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER'
}

export enum Shift {
  DAY = 'DAY',
  NIGHT = 'NIGHT'
}

export interface Order {
  id: string;
  orderCode: string;
  amount: number;
  paymentMethod: PaymentMethod;
  timestamp: number;
  note?: string;
  shift?: Shift;
}

export interface DailyStats {
  totalOrders: number;
  totalCash: number;
  totalTransfer: number;
}

export type TabView = 'DASHBOARD' | 'STATS';