import { axiosInstance } from '../api/axios';
import type { Car } from '../types/car.types';

export type CreateCarDto = Omit<Car, 'id' | 'driverId' | 'driver' | 'createdAt'>;

class CarService {
  async getAllCars(): Promise<Car[]> {
    try {
      const response = await axiosInstance.get<Car[]>('/api/cars');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка машин:', error);
      throw new Error('Не удалось загрузить машины');
    }
  }

  async createCar(data: CreateCarDto): Promise<Car> {
    const response = await axiosInstance.post<Car>('/api/cars', data);
    return response.data;
  }
}

export const carService = new CarService();
