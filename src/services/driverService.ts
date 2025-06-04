import { axiosInstance } from '../api/axios';
import type { User } from '../types/auth.types.ts';

class DriverService {
  async getAllDrivers(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>('/api/driver');
    return response.data;
  }
}

export const driverService = new DriverService();
