import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axiosInstance } from '../api/axios';
import { authService } from '../services/auth.service';
import type { AuthState, LoginRequest, RegisterRequest, User } from '../types/auth.types';

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: authService.getToken(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: true,
  });

  const getCurrentUser = async (email: string) => {
    try {
      const response = await axiosInstance.get<User>(`/api/clients/${email}`);
      setState((prev) => ({
        ...prev,
        user: response.data,
      }));
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const initializeAuth = async () => {
    const token = authService.getToken();
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        await getCurrentUser(decodedToken.sub);
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          token,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };


  useEffect(() => {
    initializeAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);
      const token = response.data;
      authService.setToken(token);
      await getCurrentUser(data.email);
      setState((prev) => ({
        ...prev,
        token,
        isAuthenticated: true,
      }));
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authService.register(data);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/login');
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
