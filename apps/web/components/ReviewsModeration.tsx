'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

interface Review {
  id: number;
  user_id: number;
  order_id: number;
  customer_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_comment?: string;
  created_at: string;
  updated_at: string;
}

interface ReviewsModerationProps {
  className?: string;
}

export default function ReviewsModeration({ className = "" }: ReviewsModerationProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const { state: authState } = useAuth();
  const { addNotification } = useNotifications();

  // Загрузка отзывов
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/admin/reviews', {
          headers: {
            'Authorization': `Bearer ${authState.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        addNotification({ type: 'error', title: 'Ошибка', message: 'Не удалось загрузить отзывы' });
      } finally {
        setLoading(false);
      }
    };

    if (authState.isAuthenticated && authState.user?.role === 'ADMIN') {
      fetchReviews();
    }
  }, [authState.isAuthenticated, authState.user?.role, authState.token, addNotification]);

  // Фильтрация отзывов
  const filteredReviews = reviews.filter(review => {
    return selectedStatus === 'all' || review.status === selectedStatus;
  });

  // Обработка модерации отзыва
  const handleModeration = async (reviewId: number, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          status: action === 'approve' ? 'approved' : 'rejected',
          admin_comment: adminComment.trim() || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review status');
      }

      // Обновляем локальное состояние
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { 
                ...review, 
                status: action === 'approve' ? 'approved' : 'rejected',
                admin_comment: adminComment.trim() || review.admin_comment,
                updated_at: new Date().toISOString()
              }
            : review
        )
      );

      setSelectedReview(null);
      setAdminComment('');
      addNotification({
        type: 'success', 
        title: 'Успешно', 
        message: `Отзыв ${action === 'approve' ? 'одобрен' : 'отклонён'}`
      });
    } catch (error) {
      console.error('Error moderating review:', error);
      addNotification({ type: 'error', title: 'Ошибка', message: 'Не удалось обработать отзыв' });
    }
  };

  // Удаление отзыва
  const handleDelete = async (reviewId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }

      // Удаляем из локального состояния
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      addNotification({ type: 'success', title: 'Успешно', message: 'Отзыв удалён' });
    } catch (error) {
      console.error('Error deleting review:', error);
      addNotification({ type: 'error', title: 'Ошибка', message: error instanceof Error ? error.message : 'Не удалось удалить отзыв' });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
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
        label: 'Отклонён',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30'
      }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mx-auto"></div>
        <p className="text-gray-400 mt-2">Загружаем отзывы...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Заголовок и фильтры */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Модерация отзывов</h2>
          <p className="text-gray-400">Управление отзывами пользователей</p>
        </div>
        
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <motion.button
              key={status}
              onClick={() => setSelectedStatus(status as any)}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                selectedStatus === status
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                  : 'border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/5 text-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status === 'all' ? 'Все' : 
               status === 'pending' ? 'На модерации' :
               status === 'approved' ? 'Одобренные' : 'Отклонённые'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{reviews.length}</div>
          <div className="text-gray-400">Всего отзывов</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {reviews.filter(r => r.status === 'pending').length}
          </div>
          <div className="text-gray-400">На модерации</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {reviews.filter(r => r.status === 'approved').length}
          </div>
          <div className="text-gray-400">Одобрено</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {reviews.filter(r => r.status === 'rejected').length}
          </div>
          <div className="text-gray-400">Отклонено</div>
        </div>
      </div>

      {/* Список отзывов */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-white mb-2">Отзывов нет</h3>
              <p className="text-gray-400">
                {selectedStatus === 'all' 
                  ? 'Пока нет отзывов для модерации'
                  : `Нет отзывов со статусом "${selectedStatus}"`
                }
              </p>
            </motion.div>
          ) : (
            filteredReviews.map((review, index) => {
              const statusConfig = getStatusConfig(review.status);
              
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 border border-gray-700 hover:border-neon-cyan/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">⭐</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Отзыв от {review.customer_name}
                        </h3>
                        <p className="text-gray-400">
                          Заказ #{review.order_id} • {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-400">({review.rating}/5)</span>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{review.comment}</p>
                  </div>

                  {review.admin_comment && (
                    <div className="mb-4 p-3 bg-neon-pink/10 border border-neon-pink/20 rounded-lg">
                      <div className="text-sm text-neon-pink font-medium mb-1">Комментарий администратора:</div>
                      <p className="text-gray-300 text-sm">{review.admin_comment}</p>
                    </div>
                  )}
                  
                  {/* Действия */}
                  <div className="flex flex-wrap gap-2">
                    {review.status === 'pending' && (
                      <>
                        <motion.button
                          onClick={() => setSelectedReview(review)}
                          className="px-4 py-2 bg-neon-cyan text-dark-950 rounded-lg font-medium hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Модерировать
                        </motion.button>
                      </>
                    )}
                    
                    {review.status === 'approved' && (
                      <motion.button
                        onClick={() => handleDelete(review.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Удалить
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Модальное окно модерации */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 border border-gray-700 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Модерация отзыва</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Комментарий администратора (необязательно)
                </label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Введите комментарий..."
                  className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all duration-300 resize-none"
                  rows={3}
                  maxLength={200}
                />
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={() => handleModeration(selectedReview.id, 'approve')}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Одобрить
                </motion.button>
                <motion.button
                  onClick={() => handleModeration(selectedReview.id, 'reject')}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Отклонить
                </motion.button>
                <motion.button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Отмена
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
