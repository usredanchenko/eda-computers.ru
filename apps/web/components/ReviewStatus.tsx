'use client';

import { motion } from 'framer-motion';

interface ReviewStatusProps {
  status: 'pending' | 'approved' | 'rejected';
  adminComment?: string;
}

export default function ReviewStatus({ status, adminComment }: ReviewStatusProps) {
  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        label: 'На модерации',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        icon: '⏳',
        description: 'Ваш отзыв проверяется администратором',
      },
      approved: {
        label: 'Одобрен',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        icon: '✅',
        description: 'Отзыв опубликован на сайте',
      },
      rejected: {
        label: 'Отклонён',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        icon: '❌',
        description: 'Отзыв не прошёл модерацию',
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const statusConfig = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`p-4 rounded-lg border ${statusConfig.bgColor} ${statusConfig.color.replace('text-', 'border-')}/30`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">{statusConfig.icon}</div>
        <div>
          <h4 className="font-semibold">{statusConfig.label}</h4>
          <p className="text-sm opacity-80">{statusConfig.description}</p>
        </div>
      </div>

      {adminComment && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.3 }}
          className="mt-3 p-3 bg-dark-800/50 rounded-lg border border-gray-600"
        >
          <h5 className="text-sm font-medium mb-1">Комментарий администратора:</h5>
          <p className="text-sm text-gray-300">{adminComment}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
