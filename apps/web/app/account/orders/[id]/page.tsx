'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { hasAccess } from '@/lib/authUtils';
import { motion } from 'framer-motion';

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  delivery_address?: string;
  components: any[];
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
  tracking_number?: string;
  notes?: string;
}

interface OrderLog {
  id: number;
  status_from?: string;
  status_to: string;
  changed_by: string;
  comment?: string;
  changed_at: string;
}

export default function OrderDetailPage() {
  const { state } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = parseInt(params.id as string);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderLogs, setOrderLogs] = useState<OrderLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Проверяем доступ
  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!hasAccess(state.user, 'USER')) {
      router.push('/');
      return;
    }

    if (!orderId || isNaN(orderId)) {
      router.push('/account/orders');
      return;
    }
  }, [state.isAuthenticated, state.user, router, orderId]);

  // Загрузка заказа
  const fetchOrder = useCallback(async () => {
    if (!state.isAuthenticated || !state.user?.id || !orderId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getUserOrder(state.user!.id, orderId);

      if (response.success && response.data) {
        setOrder(response.data.order);
        setOrderLogs(response.data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Не удалось загрузить заказ');
    } finally {
      setLoading(false);
    }
  }, [state.isAuthenticated, state.user, orderId]);

  useEffect(() => {
    if (state.isAuthenticated && state.user?.id) {
      fetchOrder();
    }
  }, [state.isAuthenticated, state.user, orderId, fetchOrder]);

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      created: { label: 'Создан', color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: '📝' },
      processing: { label: 'В обработке', color: 'text-purple-400', bgColor: 'bg-purple-500/20', icon: '⚙️' },
      building: { label: 'В сборке', color: 'text-orange-400', bgColor: 'bg-orange-500/20', icon: '🔧' },
      shipping: { label: 'В доставке', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20', icon: '🚚' },
      delivered: { label: 'Доставлен', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: '✅' },
      completed: { label: 'Завершён', color: 'text-green-500', bgColor: 'bg-green-500/20', icon: '🎉' },
      cancelled: { label: 'Отменён', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: '❌' },
    };
    return configs[status as keyof typeof configs] || configs.created;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-dark-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Ошибка загрузки</h3>
            <p className="text-gray-400 mb-4">{error || 'Заказ не найден'}</p>
            <button
              onClick={() => router.push('/account/orders')}
              className="px-6 py-2 bg-neon-cyan text-dark-950 font-bold rounded-lg hover:bg-neon-cyan/80 transition-all duration-300"
            >
              Вернуться к заказам
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Заголовок */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/account/orders')}
              className="flex items-center gap-2 text-neon-cyan hover:text-neon-cyan/80 transition-colors mb-4"
            >
              ← Вернуться к заказам
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Заказ #{order.id}
                </h1>
                <p className="text-gray-400">
                  Детальная информация о заказе
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                {statusConfig.icon} {statusConfig.label}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основная информация */}
            <div className="lg:col-span-2 space-y-6">
              {/* Информация о заказе */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Информация о заказе</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Дата создания</label>
                    <p className="text-white">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Последнее обновление</label>
                    <p className="text-white">{formatDate(order.updated_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Общая стоимость</label>
                    <p className="text-2xl font-bold text-neon-cyan">{formatPrice(order.total_price)}</p>
                  </div>
                  {order.estimated_delivery && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Ожидаемая доставка</label>
                      <p className="text-white">{formatDate(order.estimated_delivery)}</p>
                    </div>
                  )}
                  {order.tracking_number && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Трек-номер</label>
                      <p className="text-white font-mono">{order.tracking_number}</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Компоненты */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Компоненты</h2>
                {order.components && order.components.length > 0 ? (
                  <div className="space-y-4">
                    {order.components.map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-white">{component.name}</h3>
                          <p className="text-gray-400 text-sm">{component.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-neon-cyan font-bold">{formatPrice(component.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Компоненты не указаны</p>
                )}
              </motion.div>

              {/* История статусов */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">История статусов</h2>
                {orderLogs.length > 0 ? (
                  <div className="space-y-4">
                    {orderLogs.map((log, index) => (
                      <div key={log.id} className="flex items-start gap-4 p-4 bg-dark-800/50 rounded-lg">
                        <div className="w-3 h-3 bg-neon-cyan rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">
                              {log.status_from ? `${log.status_from} → ${log.status_to}` : log.status_to}
                            </h3>
                            <span className="text-gray-400 text-sm">{formatDate(log.changed_at)}</span>
                          </div>
                          <p className="text-gray-400 text-sm">Изменено: {log.changed_by}</p>
                          {log.comment && (
                            <p className="text-white text-sm mt-2">{log.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">История изменений пуста</p>
                )}
              </motion.div>
            </div>

            {/* Боковая панель */}
            <div className="space-y-6">
              {/* Информация о клиенте */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">Информация о клиенте</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Имя</label>
                    <p className="text-white">{order.customer_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <p className="text-white">{order.customer_email}</p>
                  </div>
                  {order.customer_phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Телефон</label>
                      <p className="text-white">{order.customer_phone}</p>
                    </div>
                  )}
                  {order.delivery_address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Адрес доставки</label>
                      <p className="text-white text-sm">{order.delivery_address}</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Примечания */}
              {order.notes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6"
                >
                  <h2 className="text-xl font-bold text-white mb-4">Примечания</h2>
                  <p className="text-white">{order.notes}</p>
                </motion.div>
              )}

              {/* Действия */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">Действия</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/constructor')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold rounded-lg hover:from-neon-pink hover:to-neon-cyan transition-all duration-300"
                  >
                    Создать похожий заказ
                  </button>
                  <button
                    onClick={() => router.push('/account/orders')}
                    className="w-full px-4 py-2 bg-dark-800 border border-gray-600 text-white rounded-lg hover:border-neon-cyan transition-all duration-300"
                  >
                    Все заказы
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
