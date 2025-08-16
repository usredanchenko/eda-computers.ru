'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus, getStatusInfo, getNextStatus, getPreviousStatus } from '@/types/order';
import { useNotifications } from '@/hooks/useNotifications';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusChange: (orderId: string, newStatus: OrderStatus, comment: string) => void;
}

export default function StatusChangeModal({ 
  isOpen, 
  onClose, 
  order, 
  onStatusChange 
}: StatusChangeModalProps) {
  const { addNotification } = useNotifications();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStatus = order?.status || 'created';
  const currentStatusInfo = getStatusInfo(currentStatus);
  const nextStatus = getNextStatus(currentStatus);
  const previousStatus = getPreviousStatus(currentStatus);

  // Доступные статусы для изменения
  const availableStatuses: OrderStatus[] = [];
  
  if (nextStatus) {
    availableStatuses.push(nextStatus);
  }
  
  if (previousStatus) {
    availableStatuses.push(previousStatus);
  }
  
  // Добавляем отмену для активных заказов
  if (currentStatus !== 'cancelled' && currentStatus !== 'completed') {
    availableStatuses.push('cancelled');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStatus || !order) return;
    
    setIsSubmitting(true);
    
    try {
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Вызываем callback
      onStatusChange(order.id, selectedStatus, comment);
      
      // Показываем уведомление
      const newStatusInfo = getStatusInfo(selectedStatus);
      addNotification({ type: 'success', title: 'Статус изменён', message: `Заказ #${order.id} переведён в статус "${newStatusInfo.label}"` });
      
      // Закрываем модальное окно
      onClose();
      
    } catch (error) {
      console.error('Error changing status:', error);
      addNotification({ type: 'error', title: 'Ошибка', message: 'Не удалось изменить статус заказа' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedStatus('');
      setComment('');
      onClose();
    }
  };

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className="glass-card w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neon-cyan/20">
                <h2 className="text-xl font-bold text-white">Изменение статуса</h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Информация о заказе */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-white">Заказ #{order.id}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${currentStatusInfo.color} bg-opacity-20`}>
                      {currentStatusInfo.icon} {currentStatusInfo.label}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Клиент: {order.customer_name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Сумма: {order.total_price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Выбор нового статуса */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Новый статус
                    </label>
                    <div className="space-y-2">
                      {availableStatuses.map((status) => {
                        const statusInfo = getStatusInfo(status);
                        const isSelected = selectedStatus === status;
                        
                        return (
                          <motion.button
                            key={status}
                            type="button"
                            onClick={() => setSelectedStatus(status)}
                            className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                              isSelected
                                ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                                : 'border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/5 text-gray-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{statusInfo.icon}</span>
                              <div>
                                <div className="font-semibold">{statusInfo.label}</div>
                                <div className="text-xs opacity-75">{statusInfo.description}</div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Комментарий */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Комментарий (необязательно)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none transition-colors resize-none"
                      placeholder="Дополнительная информация о изменении статуса..."
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Кнопки */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !selectedStatus}
                      className="flex-1 neon-button py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Изменяем...
                        </div>
                      ) : (
                        'Изменить статус'
                      )}
                    </motion.button>
                    
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-6 py-3 text-gray-400 hover:text-white transition-colors border border-gray-600 rounded-lg hover:border-gray-500 disabled:opacity-50"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
