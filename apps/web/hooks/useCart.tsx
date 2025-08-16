'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Component } from '@/types';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category_id: number;
  specs?: Record<string, any>;
  image_url?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (component: Component) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getItemById: (id: number) => CartItem | undefined;
  hasItem: (id: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Загружаем корзину из localStorage при инициализации
  useEffect(() => {
    const savedCart = localStorage.getItem('eda_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('eda_cart');
      }
    }
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('eda_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (component: Component) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === component.id);
      
      if (existingItem) {
        // Если товар уже есть, увеличиваем количество
        return prevItems.map(item =>
          item.id === component.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Добавляем новый товар
        const newItem: CartItem = {
          id: component.id,
          name: component.name,
          price: component.price,
          quantity: 1,
          category_id: component.category_id,
          specs: component.specs,
          image_url: component.image_url,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('eda_cart');
  };

  const getItemById = (id: number) => {
    return items.find(item => item.id === id);
  };

  const hasItem = (id: number) => {
    return items.some(item => item.id === id);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemById,
    hasItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
