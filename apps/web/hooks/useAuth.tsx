'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User } from '@/types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  const router = useRouter();

  useEffect(() => {
    // Проверяем аутентификацию при инициализации
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await api.checkAuth();
      
      if (response.success && response.data?.user) {
        setState({
          user: response.data.user,
          token: localStorage.getItem('auth_token'), // Для совместимости
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Очищаем localStorage при ошибке
      localStorage.removeItem('auth_token');
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Ошибка проверки авторизации'
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await api.login(email, password);
      
      if (response.success && response.data?.user) {
        const { user, token } = response.data;
        
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Редирект по ролям
        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        throw new Error(response.message || 'Ошибка входа');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Ошибка входа'
      }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await api.register(email, password, name);
      
      if (response.success && response.data?.user) {
        const { user, token } = response.data;
        
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Редирект по ролям (обычно новые пользователи - USER)
        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        throw new Error(response.message || 'Ошибка регистрации');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Ошибка регистрации'
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      router.push('/');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null
    }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 