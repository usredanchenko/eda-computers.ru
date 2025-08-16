// Статусы заказов
export type OrderStatus = 
  | 'created'      // Создан
  | 'pending'      // Ожидает оплаты
  | 'processing'   // В обработке
  | 'building'     // В сборке
  | 'shipping'     // В доставке
  | 'delivered'    // Доставлен
  | 'completed'    // Завершён
  | 'cancelled';   // Отменён

// Информация о статусе
export interface OrderStatusInfo {
  status: OrderStatus;
  label: string;
  description: string;
  color: string;
  icon: string;
  isCompleted: boolean;
  isActive: boolean;
}

// Запись в журнале изменений
export interface OrderLogEntry {
  id: string;
  order_id: string;
  status_from: OrderStatus | null;
  status_to: OrderStatus;
  changed_by: string; // 'system' | 'admin' | 'customer'
  changed_at: string;
  comment?: string;
  metadata?: Record<string, any>;
}

// Расширенный тип заказа
export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  notes?: string;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  order_type: 'guest' | 'auth';
  user_id?: number;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
  tracking_number?: string;
  logs: OrderLogEntry[];
  has_review?: boolean;
}

// Позиция заказа
export interface OrderItem {
  component_id: number;
  component_name: string;
  category_name: string;
  price: number;
  quantity: number;
  total_price: number;
}

// Данные для создания заказа
export interface CreateOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  notes?: string;
  items: OrderItem[];
  total_price: number;
  order_type: 'guest' | 'auth';
  user_id?: number;
}

// Данные для обновления статуса
export interface UpdateOrderStatusData {
  order_id: string;
  status: OrderStatus;
  comment?: string;
  metadata?: Record<string, any>;
}

// Константы статусов
export const ORDER_STATUSES: Record<OrderStatus, OrderStatusInfo> = {
  created: {
    status: 'created',
    label: 'Создан',
    description: 'Заказ создан и ожидает обработки',
    color: 'text-blue-400',
    icon: '📝',
    isCompleted: false,
    isActive: true,
  },
  pending: {
    status: 'pending',
    label: 'Ожидает оплаты',
    description: 'Ожидается подтверждение оплаты',
    color: 'text-yellow-400',
    icon: '💰',
    isCompleted: false,
    isActive: true,
  },
  processing: {
    status: 'processing',
    label: 'В обработке',
    description: 'Заказ обрабатывается менеджером',
    color: 'text-purple-400',
    icon: '⚙️',
    isCompleted: false,
    isActive: true,
  },
  building: {
    status: 'building',
    label: 'В сборке',
    description: 'Компьютер собирается в мастерской',
    color: 'text-orange-400',
    icon: '🔧',
    isCompleted: false,
    isActive: true,
  },
  shipping: {
    status: 'shipping',
    label: 'В доставке',
    description: 'Заказ отправлен курьером',
    color: 'text-indigo-400',
    icon: '🚚',
    isCompleted: false,
    isActive: true,
  },
  delivered: {
    status: 'delivered',
    label: 'Доставлен',
    description: 'Заказ доставлен клиенту',
    color: 'text-green-400',
    icon: '📦',
    isCompleted: true,
    isActive: false,
  },
  completed: {
    status: 'completed',
    label: 'Завершён',
    description: 'Заказ полностью выполнен',
    color: 'text-green-500',
    icon: '✅',
    isCompleted: true,
    isActive: false,
  },
  cancelled: {
    status: 'cancelled',
    label: 'Отменён',
    description: 'Заказ отменён',
    color: 'text-red-400',
    icon: '❌',
    isCompleted: true,
    isActive: false,
  },
};

// Порядок статусов для таймлайна
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'created',
  'pending',
  'processing',
  'building',
  'shipping',
  'delivered',
  'completed',
];

// Утилиты для работы со статусами
export const getStatusInfo = (status: OrderStatus): OrderStatusInfo => {
  return ORDER_STATUSES[status];
};

export const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === ORDER_STATUS_FLOW.length - 1) {
    return null;
  }
  return ORDER_STATUS_FLOW[currentIndex + 1];
};

export const getPreviousStatus = (currentStatus: OrderStatus): OrderStatus | null => {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
  if (currentIndex <= 0) {
    return null;
  }
  return ORDER_STATUS_FLOW[currentIndex - 1];
};

export const isStatusCompleted = (status: OrderStatus): boolean => {
  return ORDER_STATUSES[status].isCompleted;
};

export const getStatusProgress = (status: OrderStatus): number => {
  const index = ORDER_STATUS_FLOW.indexOf(status);
  if (index === -1) return 0;
  return ((index + 1) / ORDER_STATUS_FLOW.length) * 100;
};
