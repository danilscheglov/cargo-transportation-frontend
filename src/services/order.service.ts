import type { AxiosResponse } from 'axios';

import { axiosInstance } from '../api/axios';
import type { CreateOrderRequest, Order } from '../types/order.types';

class OrderService {
  async getClientOrders(): Promise<Order[]> {
    try {
      const email = localStorage.getItem('email');
      const response = await axiosInstance.get<Order[]>(`/api/orders/client/${email}`);
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

  async getAllOrders() {
    try {
      const response = await axiosInstance.get<Order[]>(`/api/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Ошибка при получении заказов');
    }
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await axiosInstance.get<Order>(`/api/orders/${id}`);
    return response.data;
  }

  async updateOrder(order: Order): Promise<void> {
    await axiosInstance.put(`/api/orders/${order.id}`, order);
  }

  async updateOrderStatus(id: number, status: string): Promise<void> {
    try {
      const existingOrder = await this.getOrderById(id);
      const updatedOrder = { ...existingOrder, status };
      await this.updateOrder(updatedOrder);
    } catch (error) {
      console.error(`Ошибка при обновлении статуса заказа #${id}:`, error);
      throw new Error('Не удалось обновить статус заказа');
    }
  }

  async updateOrderVehicle(id: number, vehicleId: number): Promise<void> {
    const order = await this.getOrderById(id);
    const updatedOrder = { ...order, car: { ...order.car, id: vehicleId } };
    await this.updateOrder(updatedOrder);
  }

  async updateOrderDriver(id: number, driverId: number): Promise<void> {
    const order = await this.getOrderById(id);
    const updatedOrder = {
      ...order,
      car: { ...order.car, driverId: driverId, id: order.car?.id ?? null },
    };
    await this.updateOrder(updatedOrder);
  }
}

export const orderService = new OrderService();
