export interface RegisterRequest {
  surname: string;
  name: string;
  patronymic?: string;
  phone: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type AuthResponse = string;

export interface User {
  id: number;
  surname: string;
  name: string;
  patronymic?: string;
  phone: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
