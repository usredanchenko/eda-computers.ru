'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Загрузка...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Основной спиннер */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Внешний круг */}
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
        
        {/* Анимированный круг */}
        <motion.div
          className="absolute inset-0 border-4 border-transparent border-t-neon-cyan rounded-full"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        {/* Внутренний круг */}
        <div className="absolute inset-2 border-2 border-neon-pink/30 rounded-full"></div>
        
        {/* Центральная точка */}
        <motion.div
          className="absolute inset-4 bg-neon-cyan rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </motion.div>

      {/* Текст загрузки */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p
          className="text-neon-cyan font-medium text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {text}
        </motion.p>
        
        {/* Анимированные точки */}
        <div className="flex justify-center mt-2 space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-neon-pink rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut" 
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Дополнительные эффекты */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-pink/10 rounded-full"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    </div>
  );
}
