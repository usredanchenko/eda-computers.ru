import { Order, OrderStatus, OrderLogEntry } from '@/types/order';

// Генерация ID для логов
const generateLogId = (): string => {
  return `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Создание лога изменения статуса
const createLogEntry = (
  orderId: string,
  statusFrom: OrderStatus | null,
  statusTo: OrderStatus,
  changedBy: string,
  changedAt: string,
  comment?: string,
  metadata?: Record<string, any>
): OrderLogEntry => ({
  id: generateLogId(),
  order_id: orderId,
  status_from: statusFrom,
  status_to: statusTo,
  changed_by: changedBy,
  changed_at: changedAt,
  comment,
  metadata,
});

// Создание истории логов для заказа
const createOrderLogs = (orderId: string, finalStatus: OrderStatus, createdAt: string): OrderLogEntry[] => {
  const logs: OrderLogEntry[] = [];
  const statusFlow = ['created', 'pending', 'processing', 'building', 'shipping', 'delivered', 'completed'];
  
  let currentTime = new Date(createdAt);
  
  // Создаем лог для каждого статуса до финального
  for (let i = 0; i < statusFlow.length; i++) {
    const status = statusFlow[i] as OrderStatus;
    const previousStatus = i > 0 ? statusFlow[i - 1] as OrderStatus : null;
    
    // Добавляем случайную задержку между статусами
    const delayHours = Math.random() * 24 + 1; // 1-25 часов
    currentTime = new Date(currentTime.getTime() + delayHours * 60 * 60 * 1000);
    
    const log = createLogEntry(
      orderId,
      previousStatus,
      status,
      status === 'created' ? 'system' : 'admin',
      currentTime.toISOString(),
      getStatusComment(status),
      getStatusMetadata(status)
    );
    
    logs.push(log);
    
    // Останавливаемся на финальном статусе
    if (status === finalStatus) break;
  }
  
  return logs;
};

// Комментарии для статусов
const getStatusComment = (status: OrderStatus): string => {
  const comments = {
    created: 'Заказ успешно создан и принят в обработку',
    pending: 'Ожидается подтверждение оплаты от клиента',
    processing: 'Менеджер проверяет комплектующие и совместимость',
    building: 'Мастер приступил к сборке компьютера',
    shipping: 'Заказ упакован и передан курьеру',
    delivered: 'Заказ успешно доставлен клиенту',
    completed: 'Заказ полностью выполнен, клиент доволен',
    cancelled: 'Заказ отменён по запросу клиента',
  };
  return comments[status];
};

// Метаданные для статусов
const getStatusMetadata = (status: OrderStatus): Record<string, any> => {
  switch (status) {
    case 'processing':
      return {
        manager: 'Иван Петров',
        estimated_time: '2-4 часа',
      };
    case 'building':
      return {
        master: 'Алексей Сидоров',
        workstation: 'WS-001',
        estimated_time: '1-2 дня',
      };
    case 'shipping':
      return {
        courier: 'Дмитрий Козлов',
        tracking_number: `TRK-${Date.now()}`,
        estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      };
    case 'delivered':
      return {
        delivery_time: new Date().toISOString(),
        signature: 'Подпись получена',
      };
    default:
      return {};
  }
};

export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customer_name: 'Александр Ковалев',
    customer_email: 'alex@example.com',
    customer_phone: '+7 (999) 123-45-67',
    delivery_address: 'г. Москва, ул. Тверская, д. 1, кв. 15',
    notes: 'Прошу собрать аккуратно, компьютер для работы',
    items: [
      {
        component_id: 1,
        component_name: 'Intel Core i7-13700K',
        category_name: 'Процессор',
        price: 45000,
        quantity: 1,
        total_price: 45000,
      },
      {
        component_id: 3,
        component_name: 'NVIDIA RTX 4070 Ti',
        category_name: 'Видеокарта',
        price: 85000,
        quantity: 1,
        total_price: 85000,
      },
      {
        component_id: 5,
        component_name: 'ASUS ROG STRIX Z790-E',
        category_name: 'Материнская плата',
        price: 35000,
        quantity: 1,
        total_price: 35000,
      },
      {
        component_id: 7,
        component_name: 'Corsair Vengeance 32GB DDR5-6000',
        category_name: 'Оперативная память',
        price: 18000,
        quantity: 1,
        total_price: 18000,
      },
      {
        component_id: 9,
        component_name: 'Samsung 970 EVO Plus 1TB',
        category_name: 'Накопитель',
        price: 12000,
        quantity: 1,
        total_price: 12000,
      },
      {
        component_id: 11,
        component_name: 'Corsair RM850x',
        category_name: 'Блок питания',
        price: 15000,
        quantity: 1,
        total_price: 15000,
      },
    ],
    total_price: 220000,
    status: 'completed',
    order_type: 'auth',
    user_id: 1,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:15:00Z',
    estimated_delivery: '2024-01-18T18:00:00Z',
    tracking_number: 'TRK-1705756800000',
    logs: createOrderLogs('ORD-2024-001', 'completed', '2024-01-15T10:30:00Z'),
  },
  {
    id: 'ORD-2024-002',
    customer_name: 'Мария Сидорова',
    customer_email: 'maria@example.com',
    customer_phone: '+7 (999) 234-56-78',
    delivery_address: 'г. Санкт-Петербург, Невский пр., д. 50, кв. 8',
    notes: 'Нужен тихий компьютер для работы с графикой',
    items: [
      {
        component_id: 2,
        component_name: 'AMD Ryzen 7 7700X',
        category_name: 'Процессор',
        price: 42000,
        quantity: 1,
        total_price: 42000,
      },
      {
        component_id: 4,
        component_name: 'AMD RX 7800 XT',
        category_name: 'Видеокарта',
        price: 75000,
        quantity: 1,
        total_price: 75000,
      },
      {
        component_id: 6,
        component_name: 'MSI MPG B650 CARBON',
        category_name: 'Материнская плата',
        price: 28000,
        quantity: 1,
        total_price: 28000,
      },
      {
        component_id: 8,
        component_name: 'G.Skill Trident Z5 32GB DDR5-6400',
        category_name: 'Оперативная память',
        price: 22000,
        quantity: 1,
        total_price: 22000,
      },
      {
        component_id: 10,
        component_name: 'WD Black SN850X 2TB',
        category_name: 'Накопитель',
        price: 25000,
        quantity: 1,
        total_price: 25000,
      },
      {
        component_id: 12,
        component_name: 'Seasonic Focus GX-750',
        category_name: 'Блок питания',
        price: 12000,
        quantity: 1,
        total_price: 12000,
      },
    ],
    total_price: 204000,
    status: 'shipping',
    order_type: 'guest',
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-05T11:30:00Z',
    estimated_delivery: '2024-02-08T18:00:00Z',
    tracking_number: 'TRK-1707120000000',
    logs: createOrderLogs('ORD-2024-002', 'shipping', '2024-02-01T09:15:00Z'),
  },
  {
    id: 'ORD-2024-003',
    customer_name: 'Дмитрий Волков',
    customer_email: 'dmitry@example.com',
    customer_phone: '+7 (999) 345-67-89',
    delivery_address: 'г. Екатеринбург, ул. Ленина, д. 25, кв. 42',
    notes: 'Игровой компьютер, нужен для стриминга',
    items: [
      {
        component_id: 1,
        component_name: 'Intel Core i7-13700K',
        category_name: 'Процессор',
        price: 45000,
        quantity: 1,
        total_price: 45000,
      },
      {
        component_id: 3,
        component_name: 'NVIDIA RTX 4070 Ti',
        category_name: 'Видеокарта',
        price: 85000,
        quantity: 1,
        total_price: 85000,
      },
      {
        component_id: 5,
        component_name: 'ASUS ROG STRIX Z790-E',
        category_name: 'Материнская плата',
        price: 35000,
        quantity: 1,
        total_price: 35000,
      },
      {
        component_id: 7,
        component_name: 'Corsair Vengeance 32GB DDR5-6000',
        category_name: 'Оперативная память',
        price: 18000,
        quantity: 2,
        total_price: 36000,
      },
      {
        component_id: 9,
        component_name: 'Samsung 970 EVO Plus 1TB',
        category_name: 'Накопитель',
        price: 12000,
        quantity: 2,
        total_price: 24000,
      },
      {
        component_id: 11,
        component_name: 'Corsair RM850x',
        category_name: 'Блок питания',
        price: 15000,
        quantity: 1,
        total_price: 15000,
      },
    ],
    total_price: 240000,
    status: 'building',
    order_type: 'auth',
    user_id: 2,
    created_at: '2024-02-10T14:30:00Z',
    updated_at: '2024-02-12T16:45:00Z',
    estimated_delivery: '2024-02-15T18:00:00Z',
    logs: createOrderLogs('ORD-2024-003', 'building', '2024-02-10T14:30:00Z'),
  },
  {
    id: 'ORD-2024-004',
    customer_name: 'Анна Петрова',
    customer_email: 'anna@example.com',
    customer_phone: '+7 (999) 456-78-90',
    delivery_address: 'г. Новосибирск, ул. Красная, д. 10, кв. 5',
    notes: 'Бюджетный компьютер для учёбы',
    items: [
      {
        component_id: 2,
        component_name: 'AMD Ryzen 7 7700X',
        category_name: 'Процессор',
        price: 42000,
        quantity: 1,
        total_price: 42000,
      },
      {
        component_id: 4,
        component_name: 'AMD RX 7800 XT',
        category_name: 'Видеокарта',
        price: 75000,
        quantity: 1,
        total_price: 75000,
      },
      {
        component_id: 6,
        component_name: 'MSI MPG B650 CARBON',
        category_name: 'Материнская плата',
        price: 28000,
        quantity: 1,
        total_price: 28000,
      },
      {
        component_id: 8,
        component_name: 'G.Skill Trident Z5 32GB DDR5-6400',
        category_name: 'Оперативная память',
        price: 22000,
        quantity: 1,
        total_price: 22000,
      },
      {
        component_id: 10,
        component_name: 'WD Black SN850X 2TB',
        category_name: 'Накопитель',
        price: 25000,
        quantity: 1,
        total_price: 25000,
      },
      {
        component_id: 12,
        component_name: 'Seasonic Focus GX-750',
        category_name: 'Блок питания',
        price: 12000,
        quantity: 1,
        total_price: 12000,
      },
    ],
    total_price: 204000,
    status: 'processing',
    order_type: 'guest',
    created_at: '2024-02-15T11:20:00Z',
    updated_at: '2024-02-15T13:45:00Z',
    logs: createOrderLogs('ORD-2024-004', 'processing', '2024-02-15T11:20:00Z'),
  },
];

// Функции для работы с заказами
export const getOrdersByUser = (userId?: number): Order[] => {
  if (!userId) return mockOrders.filter(order => order.order_type === 'guest');
  return mockOrders.filter(order => order.user_id === userId);
};

export const getOrderById = (orderId: string): Order | undefined => {
  return mockOrders.find(order => order.id === orderId);
};

export const getOrdersByStatus = (status: OrderStatus): Order[] => {
  return mockOrders.filter(order => order.status === status);
};
