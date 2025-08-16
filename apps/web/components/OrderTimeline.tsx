'use client';

import { motion } from 'framer-motion';

interface OrderTimelineProps {
  status: string;
  className?: string;
}

const timelineSteps = [
  { key: 'created', label: 'Создан', icon: '📝', color: 'bg-blue-500' },
  { key: 'processing', label: 'В обработке', icon: '⚙️', color: 'bg-purple-500' },
  { key: 'building', label: 'В сборке', icon: '🔧', color: 'bg-orange-500' },
  { key: 'shipping', label: 'В доставке', icon: '🚚', color: 'bg-indigo-500' },
  { key: 'delivered', label: 'Доставлен', icon: '✅', color: 'bg-green-500' },
  { key: 'completed', label: 'Завершён', icon: '🎉', color: 'bg-green-600' },
];

const getStepIndex = (status: string) => {
  const index = timelineSteps.findIndex(step => step.key === status);
  return index >= 0 ? index : 0;
};

export default function OrderTimeline({ status, className = '' }: OrderTimelineProps) {
  const currentStepIndex = getStepIndex(status);
  const isCompleted = ['delivered', 'completed'].includes(status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">
            ❌
          </div>
          <span className="text-red-400 font-medium">Заказ отменён</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-4 ${className}`}>
      {timelineSteps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        
        return (
          <div key={step.key} className="flex items-center flex-1">
            {/* Шаг */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  isActive ? step.color : 'bg-gray-600'
                } ${isCurrent ? 'ring-2 ring-neon-cyan ring-offset-2 ring-offset-dark-800' : ''}`}
              >
                {step.icon}
                {isCurrent && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-neon-cyan rounded-full"
                  />
                )}
              </motion.div>
              
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`text-xs mt-2 text-center ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                {step.label}
              </motion.span>
            </div>
            
            {/* Линия соединения */}
            {index < timelineSteps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 relative">
                <div className={`h-full transition-colors duration-500 ${
                  isActive ? 'bg-gradient-to-r from-neon-cyan to-neon-pink' : 'bg-gray-600'
                }`}>
                  {isActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
