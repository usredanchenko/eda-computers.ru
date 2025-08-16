'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface CommentNotificationProps {
  orderId: string;
}

export default function CommentNotification({ orderId }: CommentNotificationProps) {
  const [hasNewComments, setHasNewComments] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { state: authState } = useAuth();

  useEffect(() => {
    // Проверяем новые комментарии каждые 30 секунд
    const checkNewComments = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}/comments/check-new`, {
          headers: {
            'Authorization': `Bearer ${authState.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.hasNewComments && !hasNewComments) {
            setHasNewComments(true);
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error('Error checking new comments:', error);
      }
    };

    const interval = setInterval(checkNewComments, 30000);
    return () => clearInterval(interval);
  }, [orderId, authState.token, hasNewComments]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleViewComments = () => {
    setHasNewComments(false);
    setIsVisible(false);
    // Прокрутка к комментариям
    const commentsTab = document.querySelector('[data-tab="comments"]');
    if (commentsTab) {
      commentsTab.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible || !hasNewComments) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div className="bg-neon-cyan/90 backdrop-blur-sm border border-neon-cyan rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💬</div>
            <div className="flex-1">
              <h4 className="font-semibold text-dark-950 mb-1">Новый комментарий</h4>
              <p className="text-sm text-dark-950/80 mb-3">
                К вашему заказу добавлен новый комментарий
              </p>
              <div className="flex gap-2">
                <motion.button
                  onClick={handleViewComments}
                  className="px-3 py-1 bg-dark-950 text-neon-cyan rounded text-sm font-medium hover:bg-dark-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Посмотреть
                </motion.button>
                <motion.button
                  onClick={handleDismiss}
                  className="px-3 py-1 bg-transparent border border-dark-950 text-dark-950 rounded text-sm font-medium hover:bg-dark-950/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Закрыть
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
