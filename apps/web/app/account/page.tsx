'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import OrderTimeline from '@/components/OrderTimeline';
import ReviewForm from '@/components/ReviewForm';

interface Order {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  components: Array<{
    id: number;
    component_id: number;
    quantity: number;
    price: number;
    component_name: string;
    component_type: string;
  }>;
  has_review?: boolean;
}

interface Comment {
  id: number;
  order_id: number;
  message: string;
  created_at: string;
  user_name: string;
  order_status?: string;
  order_total?: number;
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic';

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/account');
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, isLoading, user, router]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем заказы и комментарии параллельно
      const [ordersResponse, commentsResponse] = await Promise.all([
        api.getUserOrders(),
        api.getUserComments()
      ]);

      if (ordersResponse.success) {
        setOrders(ordersResponse.data.orders);
      }

      if (commentsResponse.success) {
        setComments(commentsResponse.data.comments);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      const response = await api.cancelOrder(orderId);
      if (response.success) {
        // Обновляем локальное состояние
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ));
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      setError('Ошибка отмены заказа');
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(null);
    // Обновляем заказ, помечая что отзыв оставлен
    setOrders(prev => prev.map(order => 
      order.id === showReviewForm ? { ...order, has_review: true } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'text-blue-400';
      case 'processing': return 'text-yellow-400';
      case 'building': return 'text-orange-400';
      case 'shipping': return 'text-purple-400';
      case 'delivered': return 'text-green-400';
      case 'completed': return 'text-green-500';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created': return 'Создан';
      case 'processing': return 'Обрабатывается';
      case 'building': return 'Собирается';
      case 'shipping': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const canCancelOrder = (status: string) => {
    return status === 'created';
  };

  const canLeaveReview = (status: string, hasReview?: boolean) => {
    return (status === 'delivered' || status === 'completed') && !hasReview;
  };

  // Показываем загрузку пока состояние не инициализировано
  if (!isAuthenticated || isLoading || loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neon-cyan">Загружаем данные...</p>
        </div>
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
          <p className="text-gray-400 mb-4">Войдите в систему для просмотра личного кабинета</p>
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

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Личный кабинет
          </h1>
          <p className="text-gray-400">
            Добро пожаловать, {user.name}!
          </p>
        </motion.div>

        {/* Ошибка */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Текущие заказы */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-neon-cyan rounded-full mr-3"></span>
              Текущие заказы
            </h2>
            
            {orders.filter(order => ['created', 'processing', 'building', 'shipping'].includes(order.status)).length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-400">Нет активных заказов</p>
                <button
                  onClick={() => router.push('/constructor')}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold rounded-lg hover:from-neon-pink hover:to-neon-cyan transition-all duration-300"
                >
                  Создать заказ
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders
                  .filter(order => ['created', 'processing', 'building', 'shipping'].includes(order.status))
                  .map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">Заказ #{order.id}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(order.created_at).toLocaleDateString('ru-RU')}
                          </p>
                          <p className="text-sm text-gray-400">
                            Компонентов: {order.components?.length || 0}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      {/* Таймлайн статуса */}
                      <OrderTimeline status={order.status} className="mb-4" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-neon-cyan font-bold text-lg">
                          {order.total_price.toLocaleString('ru-RU')} ₽
                        </span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => router.push(`/account/orders/${order.id}`)}
                            className="text-neon-pink hover:text-pink-400 text-sm font-medium"
                          >
                            Подробнее
                          </button>
                          {canCancelOrder(order.status) && (
                            <button 
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-red-400 hover:text-red-300 text-sm font-medium"
                            >
                              Отменить
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>

          {/* История заказов */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-neon-pink rounded-full mr-3"></span>
              История заказов
            </h2>
            
            {orders.filter(order => ['delivered', 'completed', 'cancelled'].includes(order.status)).length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-400">История заказов пуста</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders
                  .filter(order => ['delivered', 'completed', 'cancelled'].includes(order.status))
                  .map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">Заказ #{order.id}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(order.created_at).toLocaleDateString('ru-RU')}
                          </p>
                          <p className="text-sm text-gray-400">
                            Компонентов: {order.components?.length || 0}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      {/* Таймлайн статуса */}
                      <OrderTimeline status={order.status} className="mb-4" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-neon-cyan font-bold text-lg">
                          {order.total_price.toLocaleString('ru-RU')} ₽
                        </span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => router.push(`/account/orders/${order.id}`)}
                            className="text-neon-pink hover:text-pink-400 text-sm font-medium"
                          >
                            Подробнее
                          </button>
                          {canLeaveReview(order.status, order.has_review) && (
                            <button
                              onClick={() => setShowReviewForm(order.id)}
                              className="text-green-400 hover:text-green-300 text-sm font-medium"
                            >
                              Оставить отзыв
                            </button>
                          )}
                          {order.has_review && (
                            <span className="text-yellow-400 text-sm font-medium">
                              ⭐ Отзыв оставлен
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Комментарии */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <span className="w-2 h-2 bg-neon-cyan rounded-full mr-3"></span>
            Комментарии к заказам
          </h2>
          
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-400">Нет комментариев</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-medium">{comment.user_name}</span>
                    <span className="text-sm text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{comment.message}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm">
                      <span className="text-neon-cyan">Заказ #{comment.order_id}</span>
                      {comment.order_status && (
                        <span className={`${getStatusColor(comment.order_status)}`}>
                          {getStatusText(comment.order_status)}
                        </span>
                      )}
                      {comment.order_total && (
                        <span className="text-gray-400">
                          {comment.order_total.toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Модальное окно отзыва */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReviewForm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <ReviewForm
                orderId={showReviewForm}
                orderNumber={showReviewForm.toString()}
                onSuccess={handleReviewSuccess}
                onCancel={() => setShowReviewForm(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
