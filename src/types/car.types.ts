import type { User } from './auth.types.ts';

export type Car = {
  id: number;
  driverId: number | null;
  driver: User | null;
  number: string;
  model: string;
  brand: string;
  capacity: number;
  mileage: number;
  condition: 'OPERATIONAL' | 'IN_SERVICE' | 'UNDER_REPAIR';
  lastMaintenanceDate: string | null;
};
