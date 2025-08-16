'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
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

interface OrderStats {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  totalSpent: number;
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic';

export default function UserOrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [error, setError] = useState<string>('');

  // Проверяем доступ
  useEffect(() => {
    if (isAuthenticated && !user) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated && user && !hasAccess(user, 'USER')) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Загрузка заказов
  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getUserOrders(
        user!.id,
        currentPage,
        10,
        selectedStatus === 'all' ? undefined : selectedStatus
      );

      if (response.success && response.data) {
        setOrders(response.data.orders || []);
        setTotalPages(Math.ceil((response.data.total || 0) / 10));
        
        // Вычисляем статистику
        const allOrders = response.data.orders || [];
        const stats: OrderStats = {
          total: allOrders.length,
          active: allOrders.filter((o: Order) => ['created', 'processing', 'building', 'shipping'].includes(o.status)).length,
          completed: allOrders.filter((o: Order) => ['delivered', 'completed'].includes(o.status)).length,
          cancelled: allOrders.filter((o: Order) => o.status === 'cancelled').length,
          totalSpent: allOrders.reduce((sum: number, o: Order) => sum + o.total_price, 0)
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, currentPage, selectedStatus]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user, currentPage, selectedStatus, fetchOrders]);

  // Показываем загрузку пока состояние не инициализировано
  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  // Проверяем авторизацию
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-white mb-2">Требуется авторизация</h3>
          <p className="text-gray-400 mb-4">Войдите в систему для просмотра заказов</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-2 bg-neon-cyan text-dark-950 font-bold rounded-lg hover:bg-neon-cyan/80 transition-all duration-300"
          >
            Войти
          </button>
        </div>
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

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Мои заказы
            </h1>
            <p className="text-gray-400">
              История и статус ваших заказов
            </p>
          </div>

          {/* Статистика */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
          >
            <div className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Всего заказов</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
                  <span className="text-dark-950 font-bold text-xl">📦</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Активные</p>
                  <p className="text-2xl font-bold text-neon-cyan">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
                  <span className="text-dark-950 font-bold text-xl">⚡</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Завершённые</p>
                  <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
                  <span className="text-dark-950 font-bold text-xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Отменённые</p>
                  <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
                  <span className="text-dark-950 font-bold text-xl">❌</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Общие траты</p>
                  <p className="text-2xl font-bold text-neon-pink">{formatPrice(stats.totalSpent)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
                  <span className="text-dark-950 font-bold text-xl">💰</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Фильтры */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-gray-300 font-medium">Статус:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-dark-800 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                >
                  <option value="all">Все статусы</option>
                  <option value="created">Создан</option>
                  <option value="processing">В обработке</option>
                  <option value="building">В сборке</option>
                  <option value="shipping">В доставке</option>
                  <option value="delivered">Доставлен</option>
                  <option value="completed">Завершён</option>
                  <option value="cancelled">Отменён</option>
                </select>
              </div>

              <button
                onClick={() => router.push('/constructor')}
                className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold rounded-lg hover:from-neon-pink hover:to-neon-cyan transition-all duration-300"
              >
                Создать новый заказ
              </button>
            </div>
          </motion.div>

          {/* Список заказов */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
                <p className="text-gray-400">Загружаем заказы...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-2">Ошибка загрузки</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-neon-cyan text-dark-950 font-bold rounded-lg hover:bg-neon-cyan/80 transition-all duration-300"
                >
                  Попробовать снова
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-white mb-2">Заказов пока нет</h3>
                <p className="text-gray-400 mb-6">Создайте свой первый заказ в конструкторе</p>
                <button
                  onClick={() => router.push('/constructor')}
                  className="px-8 py-3 bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold rounded-lg hover:from-neon-pink hover:to-neon-cyan transition-all duration-300"
                >
                  Перейти к конструктору
                </button>
              </div>
            ) : (
              <>
                {orders.map((order, index) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6 hover:border-neon-cyan/40 transition-all duration-300 cursor-pointer"
                      onClick={() => router.push(`/account/orders/${order.id}`)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <h3 className="text-xl font-bold text-white">Заказ #{order.id}</h3>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                            {statusConfig.icon} {statusConfig.label}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-neon-cyan mb-1">{formatPrice(order.total_price)}</div>
                          <div className="text-sm text-gray-400">{formatDate(order.created_at)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Компонентов:</span>
                          <span className="text-white ml-2">{order.components?.length || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Обновлён:</span>
                          <span className="text-white ml-2">{formatDate(order.updated_at)}</span>
                        </div>
                        {order.tracking_number && (
                          <div>
                            <span className="text-gray-400">Трек-номер:</span>
                            <span className="text-white ml-2">{order.tracking_number}</span>
                          </div>
                        )}
                      </div>

                      {order.notes && (
                        <div className="mt-4 p-3 bg-dark-800/50 rounded-lg">
                          <span className="text-gray-400 text-sm">Примечание:</span>
                          <p className="text-white text-sm mt-1">{order.notes}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Пагинация */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                          currentPage === page
                            ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                            : 'border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/5 text-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
