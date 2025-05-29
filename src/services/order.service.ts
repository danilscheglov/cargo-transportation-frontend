import type { AxiosResponse } from 'axios';

import { axiosInstance } from '../api/axios';
import type { CreateOrderRequest, Order } from '../types/order.types';

class OrderService {
  async getClientOrders(): Promise<Order[]> {
    try {
      const response = await axiosInstance.get<Order[]>('/api/orders/client');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Ошибка при получении заказов');
    }
  }

  async createOrder(data: CreateOrderRequest): Promise<AxiosResponse> {
    try {
      return await axiosInstance.post('/api/orders', data);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Ошибка при создании заказа');
    }
  }
}

export const orderService = new OrderService();
