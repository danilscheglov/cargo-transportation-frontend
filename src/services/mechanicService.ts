import { axiosInstance } from '../api/axios';
import type { User } from '../types/auth.types.ts';

class MechanicService {
  async getAllClients(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>('/api/mechanics');
    return response.data;
  }
}

export const mechanicService = new MechanicService();
