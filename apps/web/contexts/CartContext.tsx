'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { Component } from '@/types';
import { useAuth } from './AuthContext';
import { apiClient, ApiError } from '@/lib/apiClient';

// Типы для корзины
interface CartItem {
  component: Component;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

// Типы действий
type CartAction =
  | { type: 'CART_START' }
  | { type: 'ADD_ITEM'; payload: Component }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'CART_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Начальное состояние
const initialState: CartState = {
  items: [],
  totalPrice: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
};

// Редьюсер для корзины
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'CART_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.component.id === action.payload.id);
      
      if (existingItem) {
        // Увеличиваем количество существующего товара
        const updatedItems = state.items.map(item =>
          item.component.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalPrice: state.totalPrice + action.payload.price,
          itemCount: state.itemCount + 1,
          isLoading: false,
        };
      } else {
        // Добавляем новый товар
        const newItem: CartItem = {
          component: action.payload,
          quantity: 1,
        };
        
        return {
          ...state,
          items: [...state.items, newItem],
          totalPrice: state.totalPrice + action.payload.price,
          itemCount: state.itemCount + 1,
          isLoading: false,
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.component.id === action.payload);
      if (!itemToRemove) return state;
      
      const updatedItems = state.items.filter(item => item.component.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        totalPrice: state.totalPrice - (itemToRemove.component.price * itemToRemove.quantity),
        itemCount: state.itemCount - itemToRemove.quantity,
        isLoading: false,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.component.id === id);
      if (!item) return state;
      
      const quantityDiff = quantity - item.quantity;
      const updatedItems = state.items.map(item =>
        item.component.id === id
          ? { ...item, quantity }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        totalPrice: state.totalPrice + (item.component.price * quantityDiff),
        itemCount: state.itemCount + quantityDiff,
        isLoading: false,
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...initialState,
        isLoading: false,
      };
    
    case 'LOAD_CART':
      const totalPrice = action.payload.reduce((sum, item) => sum + (item.component.price * item.quantity), 0);
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: action.payload,
        totalPrice,
        itemCount,
        isLoading: false,
      };

    case 'CART_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
}

// Безопасное хранение корзины
class CartStorage {
  private static readonly CART_KEY = 'cart_items';

  static saveCart(items: CartItem[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.CART_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }

  static loadCart(): CartItem[] {
    if (typeof window !== 'undefined') {
      try {
        const cartData = localStorage.getItem(this.CART_KEY);
        return cartData ? JSON.parse(cartData) : [];
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
      }
    }
    return [];
  }

  static clearCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.CART_KEY);
    }
  }
}

// Контекст корзины
interface CartContextType {
  state: CartState;
  addItem: (component: Component) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  getItemQuantity: (id: number) => number;
  loadUserCart: () => Promise<void>;
  saveUserCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Провайдер корзины
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { state: authState } = useAuth();

  // Загрузка корзины при инициализации
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      // Загружаем корзину пользователя с сервера
      loadUserCart();
    } else {
      // Загружаем корзину из localStorage для гостей
      const savedCart = CartStorage.loadCart();
      if (savedCart.length > 0) {
        dispatch({ type: 'LOAD_CART', payload: savedCart });
      }
    }
  }, [authState.isAuthenticated, authState.user]);

  // Сохранение корзины при изменении
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      // Сохраняем корзину пользователя на сервер
      saveUserCart();
    } else {
      // Сохраняем корзину в localStorage для гостей
      CartStorage.saveCart(state.items);
    }
  }, [state.items, authState.isAuthenticated, authState.user]);

  // Функции для работы с корзиной
  const addItem = useCallback((component: Component) => {
    dispatch({ type: 'ADD_ITEM', payload: component });
  }, []);

  const removeItem = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  }, [removeItem]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    CartStorage.clearCart();
  }, []);

  const isInCart = useCallback((id: number) => {
    return state.items.some(item => item.component.id === id);
  }, [state.items]);

  const getItemQuantity = useCallback((id: number) => {
    const item = state.items.find(item => item.component.id === id);
    return item ? item.quantity : 0;
  }, [state.items]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Загрузка корзины пользователя с сервера
  const loadUserCart = useCallback(async () => {
    if (!authState.user?.id) return;

    dispatch({ type: 'CART_START' });

    try {
      const response = await apiClient.getUserCart(authState.user.id);
      if (response.success && response.data?.items) {
        dispatch({ type: 'LOAD_CART', payload: response.data.items });
      }
    } catch (error) {
      const message = error instanceof ApiError 
        ? error.message 
        : 'Ошибка загрузки корзины';
      dispatch({ type: 'CART_ERROR', payload: message });
    }
  }, [authState.user?.id]);

  // Сохранение корзины пользователя на сервер
  const saveUserCart = useCallback(async () => {
    if (!authState.user?.id) return;

    try {
      await apiClient.saveUserCart(authState.user.id, { items: state.items });
    } catch (error) {
      console.error('Error saving user cart:', error);
      // Не показываем ошибку пользователю, так как это фоновое сохранение
    }
  }, [authState.user?.id, state.items]);

  // Мемоизированное значение контекста
  const value = useMemo(() => ({
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    loadUserCart,
    saveUserCart,
    clearError,
  }), [
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    loadUserCart,
    saveUserCart,
    clearError,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Хук для использования корзины
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
