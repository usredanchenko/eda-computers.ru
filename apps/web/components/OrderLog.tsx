'use client';

import { motion } from 'framer-motion';

interface OrderLogEntry {
  id: string;
  order_id: string;
  status_from: string | null;
  status_to: string;
  changed_by: string;
  changed_at: string;
  comment?: string;
  metadata?: Record<string, any>;
}

interface OrderLogProps {
  logs: OrderLogEntry[];
}

const getStatusLabel = (status: string) => {
  const labels = {
    created: 'Создан',
    processing: 'В обработке',
    building: 'В сборке',
    shipping: 'В доставке',
    delivered: 'Доставлен',
    completed: 'Завершён',
    cancelled: 'Отменён',
  };
  return labels[status as keyof typeof labels] || status;
};

const getStatusColor = (status: string) => {
  const colors = {
    created: 'text-blue-400',
    processing: 'text-purple-400',
    building: 'text-orange-400',
    shipping: 'text-indigo-400',
    delivered: 'text-green-400',
    completed: 'text-green-500',
    cancelled: 'text-red-400',
  };
  return colors[status as keyof typeof colors] || 'text-gray-400';
};

const getStatusIcon = (status: string) => {
  const icons = {
    created: '📝',
    processing: '⚙️',
    building: '🔧',
    shipping: '🚚',
    delivered: '📦',
    completed: '✅',
    cancelled: '❌',
  };
  return icons[status as keyof typeof icons] || '📋';
};

export default function OrderLog({ logs }: OrderLogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-white mb-2">Журнал пуст</h3>
        <p className="text-gray-400">Изменения статуса заказа появятся здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-6">Журнал изменений</h3>
      
      <div className="space-y-4">
        {logs.map((log, index) => {
          const isStatusChange = log.status_from !== log.status_to;
          const isFirstLog = index === logs.length - 1; // Самый старый лог в конце массива

          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-lg border transition-all duration-300 ${
                isFirstLog
                  ? 'bg-neon-cyan/10 border-neon-cyan/30'
                  : 'bg-dark-700/50 border-gray-600'
              }`}
            >
              {/* Линия соединения */}
              {index < logs.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-600" />
              )}

              <div className="flex items-start gap-4">
                {/* Иконка */}
                <div className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg ${
                  isFirstLog
                    ? 'border-neon-cyan bg-neon-cyan text-dark-950'
                    : 'border-gray-600 bg-dark-700 text-gray-400'
                }`}>
                  {isStatusChange ? getStatusIcon(log.status_to) : '📝'}
                </div>

                {/* Контент */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {log.changed_by === 'system' ? 'Система' : 'Администратор'}
                      </span>
                      {isStatusChange && (
                        <>
                          <span className="text-gray-500">→</span>
                          <span className={`text-sm font-medium ${getStatusColor(log.status_to)}`}>
                            {getStatusLabel(log.status_to)}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{formatDate(log.changed_at)}</div>
                      <div className="text-xs text-gray-500">{formatTime(log.changed_at)}</div>
                    </div>
                  </div>

                  {/* Комментарий */}
                  {log.comment && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 0.2 }}
                      className="mt-3 p-3 bg-dark-800/50 rounded-lg border border-gray-600"
                    >
                      <p className="text-gray-300 text-sm">{log.comment}</p>
                    </motion.div>
                  )}

                  {/* Метаданные */}
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 p-3 bg-dark-800/30 rounded-lg border border-gray-600"
                    >
                      <h4 className="text-xs font-medium text-gray-400 mb-2">Дополнительная информация:</h4>
                      <div className="space-y-1">
                        {Object.entries(log.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-500">{key}:</span>
                            <span className="text-gray-300">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Индикатор первого лога */}
                  {isFirstLog && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-3 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                      <span className="text-neon-cyan text-sm font-medium">Текущий статус</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Статистика */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-dark-700/50 border border-gray-600 rounded-lg"
      >
        <h4 className="text-sm font-medium text-gray-400 mb-3">Статистика изменений</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-white font-semibold">{logs.length}</div>
            <div className="text-gray-400">Всего записей</div>
          </div>
          <div>
            <div className="text-white font-semibold">
              {logs.filter(log => log.status_from !== log.status_to).length}
            </div>
            <div className="text-gray-400">Изменений статуса</div>
          </div>
          <div>
            <div className="text-white font-semibold">
              {logs.filter(log => log.comment).length}
            </div>
            <div className="text-gray-400">С комментариями</div>
          </div>
          <div>
            <div className="text-white font-semibold">
              {logs.length > 0 ? formatDate(logs[logs.length - 1].changed_at) : '—'}
            </div>
            <div className="text-gray-400">Последнее изменение</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
