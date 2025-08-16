'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface ReviewFormProps {
  orderId: number;
  orderNumber: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ orderId, orderNumber, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Пожалуйста, оставьте комментарий');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await api.createReview({
        order_id: orderId,
        rating,
        text: comment.trim()
      });

      if (response.success) {
        onSuccess?.();
      } else {
        setError(response.message || 'Ошибка отправки отзыва');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      setError('Ошибка отправки отзыва');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-dark-800/80 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">
          Оставить отзыв
        </h3>
        <p className="text-gray-400">
          Поделитесь впечатлениями о заказе #{orderNumber}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Рейтинг */}
        <div>
          <label className="block text-white font-medium mb-3">
            Оценка
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {star <= rating ? '⭐' : '☆'}
              </motion.button>
            ))}
            <span className="ml-3 text-white font-medium">
              {rating}/5
            </span>
          </div>
        </div>

        {/* Комментарий */}
        <div>
          <label htmlFor="comment" className="block text-white font-medium mb-3">
            Комментарий
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Расскажите о вашем опыте..."
            className="w-full h-32 px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none resize-none"
            required
          />
        </div>

        {/* Ошибка */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-900/50 border border-red-500 rounded-lg"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Кнопки */}
        <div className="flex gap-4">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold py-3 px-6 rounded-lg hover:from-neon-pink hover:to-neon-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin"></div>
                Отправка...
              </div>
            ) : (
              'Отправить отзыв'
            )}
          </motion.button>
          
          <motion.button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Отмена
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
