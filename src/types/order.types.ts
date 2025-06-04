import type { Car } from './car.types.ts';
import type { User } from './auth.types.ts';

export interface Order {
  id: number;
  email: number;
  client: User;
  car?: Car | null;
  status: string;
  startpoint: string;
  endpoint: string;
  createdAt: string;
  departureDate: string;
  deliveryDate: string;
  cargo: Cargo;
}

export interface CreateOrderRequest {
  startpoint: string;
  endpoint: string;
  status: string;
  dispatchDate: string;
  deliveryDate: string;
  email: string;
  cargo: Cargo;
}

export interface Cargo {
  weight: number;
  volume: number;
  type: string;
}
