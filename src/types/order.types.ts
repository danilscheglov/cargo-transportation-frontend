export interface Order {
  id: number;
  clientId: number;
  status: OrderStatus;
  fromAddress: string;
  toAddress: string;
  cargoType: string;
  weight: number;
  volume: number;
  createdAt: string;
  departureDate: string;
  deliveryDate: string;
}

export type OrderStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED';

export interface CreateOrderRequest {
  fromAddress: string;
  toAddress: string;
  cargoType: string;
  weight: number;
  volume: number;
  departureDate: string;
  deliveryDate: string;
}
