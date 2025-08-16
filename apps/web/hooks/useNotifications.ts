import { useState, useCallback, useRef, useEffect } from 'react';
import { Notification } from '@/types';

interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Очистка таймаутов при размонтировании
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  // Генерация уникального ID
  const generateId = useCallback((): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  // Добавление уведомления
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Автоматическое удаление через указанное время
    if (newNotification.duration && newNotification.duration > 0) {
      const timeout = setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);

      timeoutsRef.current.set(id, timeout);
    }
  }, [generateId]);

  // Удаление уведомления
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // Очистка таймаута
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  // Обновление уведомления
  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, ...updates }
          : notification
      )
    );
  }, []);

  // Очистка всех уведомлений
  const clearNotifications = useCallback(() => {
    // Очистка всех таймаутов
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
    
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    updateNotification,
  };
}

// Утилиты для создания уведомлений
export const createNotification = {
  success: (title: string, message: string, duration?: number): Omit<Notification, 'id'> => ({
    type: 'success',
    title,
    message,
    duration,
  }),

  error: (title: string, message: string, duration?: number): Omit<Notification, 'id'> => ({
    type: 'error',
    title,
    message,
    duration,
  }),

  warning: (title: string, message: string, duration?: number): Omit<Notification, 'id'> => ({
    type: 'warning',
    title,
    message,
    duration,
  }),

  info: (title: string, message: string, duration?: number): Omit<Notification, 'id'> => ({
    type: 'info',
    title,
    message,
    duration,
  }),
};
