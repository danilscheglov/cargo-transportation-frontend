import type { AxiosError, AxiosResponse } from 'axios';

import { axiosInstance } from '../api/axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types';

class AuthService {
  async register(data: RegisterRequest): Promise<AxiosResponse> {
    try {
      return await axiosInstance.post('/register', { ...data, role: 'CLIENT' });
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        throw new Error('Пользователь с таким email уже существует');
      }
      throw new Error('Ошибка при регистрации. Попробуйте позже');
    }
  }

  async login(data: LoginRequest): Promise<AxiosResponse<AuthResponse>> {
    try {
      return await axiosInstance.post('/login', data);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('Неверный email или пароль');
      }
      throw new Error('Ошибка при входе. Попробуйте позже');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);

      if (payload.sub) {
        localStorage.setItem('email', payload.sub);
      } else {
        console.warn('Поле "sub" (email) отсутствует в токене');
      }
    } catch (error) {
      console.error('Ошибка при разборе JWT:', error);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
