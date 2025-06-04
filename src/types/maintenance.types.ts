import type { Car } from './car.types.ts';
import type { User } from './auth.types.ts';

export type CreateMaintenanceRequestDto = {
  car: { id: number };
  mechanic: { id: number };
  fillingDate: string;
  serviceType: string;
  status: string;
  note?: string;
};

export type MaintenanceRequest = {
  id: number;
  car: Car;
  mechanic: User;
  fillingDate: string;
  serviceType: string;
  status: string;
  note?: string;
};
