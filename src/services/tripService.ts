import { axiosInstance } from '../api/axios';
import type { Order } from '../types/order.types.ts';

class TripService {
  async getAssignedTrips(): Promise<Order[]> {
    const email = localStorage.getItem('email');
    const response = await axiosInstance.get(`/api/driver/orders/${email}`);
    return response.data;
  }

  async completeTrip(tripId: number): Promise<void> {
    await axiosInstance.patch(`/api/trips/${tripId}/complete`);
  }
}

export const tripService = new TripService();
