export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Сегодня';
  } else if (diffInDays === 1) {
    return 'Вчера';
  } else if (diffInDays < 7) {
    return `${diffInDays} дня назад`;
  } else {
    return formatDate(dateObj);
  }
};

export const getStatusConfig = (status: string) => {
  const configs = {
    created: {
      label: 'Создан',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    building: {
      label: 'Собирается',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    },
    shipping: {
      label: 'Отправлен',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    delivered: {
      label: 'Доставлен',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    cancelled: {
      label: 'Отменен',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    }
  };

  return configs[status as keyof typeof configs] || configs.created;
};

export const getReviewStatusConfig = (status: string) => {
  const configs = {
    pending: {
      label: 'На модерации',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    },
    approved: {
      label: 'Одобрен',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    rejected: {
      label: 'Отклонен',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    }
  };

  return configs[status as keyof typeof configs] || configs.pending;
};

import { Component } from '@/types';

interface OrderData {
  customer_name?: string;
  customer_email?: string;
  components?: any[];
}

interface ReviewData {
  rating?: number;
  content?: string;
}

export const calculateTotalPrice = (components: Component[]): number => {
  return components.reduce((total, component) => total + (component.price || 0), 0);
};

export const validateOrder = (orderData: OrderData): string[] => {
  const errors: string[] = [];

  if (!orderData.customer_name?.trim()) {
    errors.push('Имя клиента обязательно');
  }

  if (!orderData.customer_email?.trim()) {
    errors.push('Email клиента обязателен');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.customer_email)) {
    errors.push('Некорректный email');
  }

  if (!orderData.components || orderData.components.length === 0) {
    errors.push('Выберите хотя бы один компонент');
  }

  return errors;
};

export const validateReview = (reviewData: ReviewData): string[] => {
  const errors: string[] = [];

  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    errors.push('Оценка должна быть от 1 до 5');
  }

  if (!reviewData.content?.trim()) {
    errors.push('Текст отзыва обязателен');
  } else if (reviewData.content.length < 10) {
    errors.push('Отзыв должен содержать минимум 10 символов');
  } else if (reviewData.content.length > 1000) {
    errors.push('Отзыв не должен превышать 1000 символов');
  }

  return errors;
};

export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};
