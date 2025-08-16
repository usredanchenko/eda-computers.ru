'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import AdminStats from '@/components/AdminStats';
import AdminTabs from '@/components/AdminTabs';
import { Order, Review, User, OrderStatus } from '@/types';

interface Comment {
  id: number;
  order_id: number;
  message: string;
  created_at: string;
  user_name: string;
  order_status?: string;
  order_total?: number;
}

interface UserStats {
  total: number;
  active: number;
  byRole: { [key: string]: number };
  newLast30Days: number;
}

type ActiveTab = 'orders' | 'comments' | 'reviews' | 'users';

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/admin');
      return;
    }

    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/account');
      return;
    }

    if (isAuthenticated && user?.role === 'ADMIN') {
      loadAdminData();
    }
  }, [isAuthenticated, isLoading, user, router]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ordersResponse, commentsResponse, reviewsResponse, usersResponse, statsResponse] = await Promise.all([
        api.getAllOrders(),
        api.getUserComments(),
        api.getAllReviews(),
        api.getUsers(),
        api.getUserStats()
      ]);

      if (ordersResponse.data?.orders) {
        setOrders(ordersResponse.data.orders);
      }

      if (commentsResponse.data?.comments) {
        setComments(commentsResponse.data.comments);
      }

      if (reviewsResponse.data?.reviews) {
        setReviews(reviewsResponse.data.reviews);
      }

      if (usersResponse.data?.users) {
        setUsers(usersResponse.data.users);
      }

      if (statsResponse.data) {
        setUserStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
    try {
      const response = await api.updateOrderStatus(orderId, newStatus as OrderStatus);
      if (response.data?.order) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      setError('Ошибка обновления статуса заказа');
    }
  };

  const handleReviewStatusUpdate = async (reviewId: number, newStatus: Review['status']) => {
    try {
      const response = await api.updateReviewStatus(reviewId, newStatus);
      if (response.data?.review) {
        setReviews(prev => prev.map(review => 
          review.id === reviewId ? { ...review, status: newStatus } : review
        ));
      }
    } catch (error) {
      console.error('Failed to update review status:', error);
      setError('Ошибка обновления статуса отзыва');
    }
  };

  const handleUserStatusToggle = async (userId: number, isActive: boolean) => {
    try {
      const response = await api.updateUser(userId, { is_active: !isActive });
      if (response.data?.user) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, is_active: !isActive } : user
        ));
        // Обновляем статистику
        const statsResponse = await api.getUserStats();
        if (statsResponse.data) {
          setUserStats(statsResponse.data);
        }
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      setError('Ошибка обновления статуса пользователя');
    }
  };

  const handleCommentReply = async (commentId: number) => {
    const reply = replyText[commentId];
    if (!reply?.trim()) return;

    try {
      // Здесь должен быть API для ответа на комментарий
      // const response = await api.replyToComment(commentId, reply);
      console.log('Reply to comment:', commentId, reply);
      
      // Очищаем поле ответа
      setReplyText(prev => ({ ...prev, [commentId]: '' }));
    } catch (error) {
      console.error('Failed to reply to comment:', error);
      setError('Ошибка отправки ответа');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'text-yellow-500';
      case 'processing': return 'text-blue-500';
      case 'building': return 'text-orange-500';
      case 'shipping': return 'text-purple-500';
      case 'delivered': return 'text-green-500';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created': return 'Создан';
      case 'processing': return 'В обработке';
      case 'building': return 'В сборке';
      case 'shipping': return 'В доставке';
      case 'delivered': return 'Доставлен';
      case 'completed': return 'Завершён';
      case 'cancelled': return 'Отменён';
      case 'pending': return 'На модерации';
      case 'approved': return 'Одобрен';
      case 'rejected': return 'Отклонён';
      default: return status;
    }
  };

  // Показываем загрузку пока состояние не инициализировано
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neon-cyan">Загружаем админ-панель...</p>
        </div>
      </div>
    );
  }

  // Проверяем авторизацию и права администратора
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-white mb-2">Требуется авторизация</h3>
          <p className="text-gray-400 mb-4">Войдите в систему для доступа к админ-панели</p>
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

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h3 className="text-xl font-bold text-white mb-2">Доступ запрещён</h3>
          <p className="text-gray-400 mb-4">У вас нет прав для доступа к админ-панели</p>
          <button
            onClick={() => router.push('/account')}
            className="px-6 py-2 bg-neon-cyan text-dark-950 font-bold rounded-lg hover:bg-neon-cyan/80 transition-all duration-300"
          >
            Вернуться в личный кабинет
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: 'Заказы', count: orders.length, icon: '📦' },
    { id: 'comments', label: 'Комментарии', count: comments.length, icon: '💬' },
    { id: 'reviews', label: 'Отзывы', count: reviews.length, icon: '⭐' },
    { id: 'users', label: 'Пользователи', count: users.length, icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-neon-cyan mb-2">Админ-панель</h1>
          <p className="text-gray-400">Управление системой EDA Computers</p>
        </motion.div>

        {/* Ошибка */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Статистика */}
        {userStats && (
          <AdminStats stats={userStats} />
        )}

        {/* Навигация по табам */}
        <AdminTabs
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as ActiveTab)}
          tabs={tabs}
        />

        {/* Контент табов */}
        <div className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl overflow-hidden">
          {loading && (
            <div className="p-8 text-center text-gray-400">
              <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              Загрузка данных...
            </div>
          )}

          {!loading && (
            <AnimatePresence mode="wait">
              {/* Заказы */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="text-2xl mr-3">📦</span>
                    Управление заказами
                  </h2>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-gray-400">Заказов пока нет</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-dark-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">Заказ #{order.id}</h3>
                              <p className="text-gray-400 text-sm">
                                Пользователь: {order.customer_name || `ID: ${order.user_id}`}
                              </p>
                              <p className="text-gray-400 text-sm">
                                Email: {order.customer_email}
                              </p>
                              <p className="text-gray-400 text-sm">
                                Сумма: {order.total_price.toLocaleString('ru-RU')} ₽
                              </p>
                              <p className="text-gray-400 text-sm">
                                Компонентов: {order.components?.length || 0}
                              </p>
                              <p className="text-gray-400 text-sm">
                                Создан: {new Date(order.created_at).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {['created', 'processing'].includes(order.status) && (
                              <button
                                onClick={() => handleOrderStatusUpdate(order.id, 'processing')}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                              >
                                В обработку
                              </button>
                            )}
                            {order.status === 'processing' && (
                              <button
                                onClick={() => handleOrderStatusUpdate(order.id, 'building')}
                                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded text-sm transition-colors"
                              >
                                В сборку
                              </button>
                            )}
                            {order.status === 'building' && (
                              <button
                                onClick={() => handleOrderStatusUpdate(order.id, 'shipping')}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                              >
                                В доставку
                              </button>
                            )}
                            {order.status === 'shipping' && (
                              <button
                                onClick={() => handleOrderStatusUpdate(order.id, 'delivered')}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                              >
                                Доставлен
                              </button>
                            )}
                            {['created', 'processing', 'building', 'shipping'].includes(order.status) && (
                              <button
                                onClick={() => handleOrderStatusUpdate(order.id, 'cancelled')}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                              >
                                Отменить
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Комментарии */}
              {activeTab === 'comments' && (
                <motion.div
                  key="comments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="text-2xl mr-3">💬</span>
                    Комментарии к заказам
                  </h2>
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">💬</div>
                        <p className="text-gray-400">Комментариев пока нет</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-dark-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <p className="text-gray-300 mb-2">{comment.message}</p>
                              <div className="text-sm text-gray-400">
                                <span>Заказ #{comment.order_id}</span>
                                {comment.order_status && (
                                  <span className="ml-4">Статус: {getStatusText(comment.order_status)}</span>
                                )}
                                {comment.order_total && (
                                  <span className="ml-4">Сумма: {comment.order_total.toLocaleString('ru-RU')} ₽</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right text-sm text-gray-400">
                              {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                          
                          {/* Форма ответа */}
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Ответить на комментарий..."
                                value={replyText[comment.id] || ''}
                                onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                className="flex-1 px-3 py-2 bg-dark-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                              />
                              <button
                                onClick={() => handleCommentReply(comment.id)}
                                disabled={!replyText[comment.id]?.trim()}
                                className="px-4 py-2 bg-neon-cyan text-dark-950 font-bold rounded hover:bg-neon-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Ответить
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Отзывы */}
              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="text-2xl mr-3">⭐</span>
                    Модерация отзывов
                  </h2>
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">⭐</div>
                        <p className="text-gray-400">Отзывов пока нет</p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-dark-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="font-semibold mr-3">
                                  {review.user_name || `Пользователь ${review.user_id}`}
                                </h3>
                                <div className="flex text-yellow-500">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-600'}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-300 mb-2">{review.text}</p>
                              <div className="text-sm text-gray-400">
                                <span>Заказ #{review.order_id}</span>
                                {review.order_total && (
                                  <span className="ml-4">Сумма: {review.order_total.toLocaleString('ru-RU')} ₽</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(review.status)}`}>
                                {getStatusText(review.status)}
                              </span>
                            </div>
                          </div>
                          {review.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleReviewStatusUpdate(review.id, 'approved')}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                              >
                                Одобрить
                              </button>
                              <button
                                onClick={() => handleReviewStatusUpdate(review.id, 'rejected')}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                              >
                                Отклонить
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Пользователи */}
              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    Управление пользователями
                  </h2>
                  <div className="space-y-4">
                    {users.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">👥</div>
                        <p className="text-gray-400">Пользователей пока нет</p>
                      </div>
                    ) : (
                      users.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-dark-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {user.name}
                              </h3>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  user.role === 'ADMIN' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                                }`}>
                                  {user.role}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  user.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                }`}>
                                  {user.is_active ? 'Активен' : 'Заблокирован'}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUserStatusToggle(user.id, user.is_active ?? false)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                  user.is_active
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                              >
                                {user.is_active ? 'Заблокировать' : 'Разблокировать'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
