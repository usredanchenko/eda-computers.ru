'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { User, AuthResponse } from '@/types';
import { apiClient, ApiError } from '@/lib/apiClient';

// Типы для состояния авторизации
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Типы действий
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOAD_USER'; payload: { user: User; token: string } };

// Начальное состояние
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Редьюсер для авторизации
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    default:
      return state;
  }
}

// Безопасное хранение токенов
class SecureStorage {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'auth_user';

  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      // Используем sessionStorage для временного хранения
      // В production токены должны храниться в httpOnly cookies через сервер
      try {
        sessionStorage.setItem(this.TOKEN_KEY, token);
      } catch (error) {
        console.error('Error saving token to sessionStorage:', error);
      }
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem(this.TOKEN_KEY);
      } catch (error) {
        console.error('Error reading token from sessionStorage:', error);
        return null;
      }
    }
    return null;
  }

  static removeToken(): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(this.TOKEN_KEY);
      } catch (error) {
        console.error('Error removing token from sessionStorage:', error);
      }
    }
  }

  static setUser(user: User): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to sessionStorage:', error);
      }
    }
  }

  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      try {
        const userData = sessionStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error('Error reading user from sessionStorage:', error);
        return null;
      }
    }
    return null;
  }

  static removeUser(): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(this.USER_KEY);
      } catch (error) {
        console.error('Error removing user from sessionStorage:', error);
      }
    }
  }
}

// Контекст авторизации
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Загрузка пользователя при инициализации
  useEffect(() => {
    const loadUser = async () => {
      const token = SecureStorage.getToken();
      const userData = SecureStorage.getUser();
      
      if (token && userData) {
        try {
          // Проверяем валидность токена на сервере
          const response = await apiClient.checkAuth();
          if (response.success && response.data?.user) {
            dispatch({ 
              type: 'LOAD_USER', 
              payload: { user: response.data.user, token } 
            });
          } else {
            // Токен недействителен, очищаем данные
            SecureStorage.removeToken();
            SecureStorage.removeUser();
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          SecureStorage.removeToken();
          SecureStorage.removeUser();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    loadUser();
  }, []);

  // Сохранение данных при изменении состояния
  useEffect(() => {
    if (state.token && state.user) {
      SecureStorage.setToken(state.token);
      SecureStorage.setUser(state.user);
    } else if (!state.isAuthenticated) {
      SecureStorage.removeToken();
      SecureStorage.removeUser();
    }
  }, [state.token, state.user, state.isAuthenticated]);

  // Функция входа
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data) {
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user: response.data.user, token: response.data.token } 
        });
      } else {
        throw new Error(response.message || 'Ошибка входа');
      }
    } catch (error) {
      const message = error instanceof ApiError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Неизвестная ошибка';
      
      dispatch({ type: 'AUTH_FAILURE', payload: message });
    }
  }, []);

  // Функция регистрации
  const register = useCallback(async (email: string, password: string, name: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await apiClient.register({ email, password, name });
      
      if (response.success && response.data) {
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user: response.data.user, token: response.data.token } 
        });
      } else {
        throw new Error(response.message || 'Ошибка регистрации');
      }
    } catch (error) {
      const message = error instanceof ApiError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Неизвестная ошибка';
      
      dispatch({ type: 'AUTH_FAILURE', payload: message });
    }
  }, []);

  // Функция выхода
  const logout = useCallback(() => {
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  // Очистка ошибки
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Проверка авторизации
  const checkAuth = useCallback(async () => {
    if (!state.token) return;
    
    try {
      const response = await apiClient.checkAuth();
      if (response.success && response.data?.user) {
        dispatch({ 
          type: 'LOAD_USER', 
          payload: { user: response.data.user, token: state.token! } 
        });
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, [state.token]);

  // Мемоизированное значение контекста
  const value = useMemo(() => ({
    state,
    login,
    register,
    logout,
    clearError,
    checkAuth,
  }), [state, login, register, logout, clearError, checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования контекста
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
