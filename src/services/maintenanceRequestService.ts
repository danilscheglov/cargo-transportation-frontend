import { axiosInstance } from '../api/axios';
import type { CreateMaintenanceRequestDto, MaintenanceRequest } from '../types/maintenance.types.ts';


class MaintenanceRequestService {
  async getAllRequests(): Promise<MaintenanceRequest[]> {
    const response = await axiosInstance.get('/api/maintenance-requests');
    return response.data;
  }

  async createRequest(data: CreateMaintenanceRequestDto) {
    const response = await axiosInstance.post('/api/maintenance-requests', data);
    return response.data;
  }

  async updateRequest(id: number, data: Partial<CreateMaintenanceRequestDto>) {
    const response = await axiosInstance.put(`/api/maintenance-requests/${id}`, data);
    return response.data;
  }
}


export const maintenanceRequestService = new MaintenanceRequestService();
