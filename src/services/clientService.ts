import { axiosInstance } from '../api/axios';
import type { User } from '../types/auth.types.ts';

class ClientService {
  async getAllClients(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>('/api/clients');
    return response.data;
  }
}

export const clientService = new ClientService();
