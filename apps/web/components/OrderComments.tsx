'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

interface Comment {
  id: string;
  order_id: string;
  user_id: number;
  user_name: string;
  user_role: 'customer' | 'admin';
  content: string;
  created_at: string;
  is_internal?: boolean;
}

interface OrderCommentsProps {
  orderId: string;
}

export default function OrderComments({ orderId }: OrderCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showInternal, setShowInternal] = useState(false);
  const { state: authState } = useAuth();
  const { addNotification } = useNotifications();
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Загрузка комментариев
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}/comments`, {
          headers: {
            'Authorization': `Bearer ${authState.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }

        const data = await response.json();
        setComments(data.comments || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        addNotification({ type: 'error', title: 'Ошибка', message: 'Не удалось загрузить комментарии' });
      } finally {
        setLoading(false);
      }
    };

    if (authState.isAuthenticated && authState.token) {
      fetchComments();
    }
  }, [orderId, authState.isAuthenticated, authState.token, addNotification]);

  // Прокрутка к последнему комментарию
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      addNotification({ type: 'warning', title: 'Предупреждение', message: 'Комментарий не может быть пустым' });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          content: newComment.trim(),
          is_internal: showInternal,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      const data = await response.json();
      setComments(prev => [...prev, data.comment]);
      setNewComment('');
      addNotification({ type: 'success', title: 'Успешно', message: 'Комментарий добавлен' });
    } catch (error) {
      console.error('Error submitting comment:', error);
      addNotification({ type: 'error', title: 'Ошибка', message: 'Не удалось добавить комментарий' });
    } finally {
      setSubmitting(false);
    }
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

  const isAdmin = authState.user?.role === 'admin';

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mx-auto mb-4"></div>
        <p className="text-gray-400">Загружаем комментарии...</p>
      </div>
    );
  }

  const filteredComments = showInternal 
    ? comments 
    : comments.filter(comment => !comment.is_internal);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Комментарии к заказу</h3>
        {isAdmin && (
          <motion.button
            onClick={() => setShowInternal(!showInternal)}
            className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
              showInternal
                ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                : 'border-gray-600 hover:border-neon-pink hover:bg-neon-pink/5 text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showInternal ? 'Скрыть внутренние' : 'Показать внутренние'}
          </motion.button>
        )}
      </div>

      {/* Список комментариев */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredComments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💬</div>
            <h4 className="text-lg font-semibold text-white mb-2">Комментариев пока нет</h4>
            <p className="text-gray-400">Будьте первым, кто оставит комментарий!</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  comment.is_internal
                    ? 'bg-neon-pink/10 border-neon-pink/30'
                    : comment.user_role === 'admin'
                    ? 'bg-neon-cyan/10 border-neon-cyan/30'
                    : 'bg-dark-700/50 border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      comment.user_role === 'admin'
                        ? 'bg-neon-cyan text-dark-950'
                        : 'bg-gray-600 text-white'
                    }`}>
                      {comment.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{comment.user_name}</span>
                        {comment.user_role === 'admin' && (
                          <span className="px-2 py-1 bg-neon-cyan/20 border border-neon-cyan rounded text-xs text-neon-cyan">
                            Админ
                          </span>
                        )}
                        {comment.is_internal && (
                          <span className="px-2 py-1 bg-neon-pink/20 border border-neon-pink rounded text-xs text-neon-pink">
                            Внутренний
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{formatDate(comment.created_at)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-gray-300 whitespace-pre-wrap">{comment.content}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Форма добавления комментария */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-dark-700/50 border border-gray-600 rounded-lg"
      >
        <h4 className="text-lg font-semibold text-white mb-4">Добавить комментарий</h4>
        
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Введите ваш комментарий..."
              className="w-full h-24 p-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none resize-none"
              disabled={submitting}
            />
          </div>

          <div className="flex items-center justify-between">
            {isAdmin && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInternal}
                  onChange={(e) => setShowInternal(e.target.checked)}
                  className="w-4 h-4 text-neon-pink bg-dark-800 border-gray-600 rounded focus:ring-neon-pink focus:ring-2"
                />
                <span className="text-sm text-gray-300">Внутренний комментарий</span>
              </label>
            )}
            
            <motion.button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                submitting || !newComment.trim()
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-neon-cyan text-dark-950 hover:shadow-lg hover:shadow-neon-cyan/25'
              }`}
              whileHover={!submitting && newComment.trim() ? { scale: 1.05 } : {}}
              whileTap={!submitting && newComment.trim() ? { scale: 0.95 } : {}}
            >
              {submitting ? 'Отправка...' : 'Отправить'}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Статистика */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 bg-dark-700/50 border border-gray-600 rounded-lg"
      >
        <h4 className="text-sm font-medium text-gray-400 mb-3">Статистика комментариев</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-white font-semibold">{comments.length}</div>
            <div className="text-gray-400">Всего комментариев</div>
          </div>
          <div>
            <div className="text-white font-semibold">
              {comments.filter(c => c.user_role === 'admin').length}
            </div>
            <div className="text-gray-400">От администрации</div>
          </div>
          <div>
            <div className="text-white font-semibold">
              {comments.filter(c => c.user_role === 'customer').length}
            </div>
            <div className="text-gray-400">От клиентов</div>
          </div>
          <div>
            <div className="text-white font-semibold">
              {comments.filter(c => c.is_internal).length}
            </div>
            <div className="text-gray-400">Внутренних</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
