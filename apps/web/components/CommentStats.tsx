'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CommentStatsProps {
  totalComments: number;
  userComments: number;
  adminComments: number;
  recentComments: number;
  className?: string;
}

export default function CommentStats({ 
  totalComments, 
  userComments, 
  adminComments, 
  recentComments,
  className = "" 
}: CommentStatsProps) {
  const stats = [
    {
      label: 'Всего комментариев',
      value: totalComments,
      color: 'text-white',
      icon: '💬'
    },
    {
      label: 'От пользователей',
      value: userComments,
      color: 'text-neon-cyan',
      icon: '👤'
    },
    {
      label: 'От администраторов',
      value: adminComments,
      color: 'text-neon-pink',
      icon: '👨‍💼'
    },
    {
      label: 'За последние 24ч',
      value: recentComments,
      color: 'text-yellow-400',
      icon: '🕒'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white">Статистика комментариев</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 text-center border border-gray-700 hover:border-neon-cyan/30 transition-all duration-300"
          >
            <div className={`text-2xl mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Прогресс-бар активности */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Активность комментариев</span>
          <span className="text-sm text-neon-cyan">
            {totalComments > 0 ? Math.round((recentComments / totalComments) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalComments > 0 ? (recentComments / totalComments) * 100 : 0}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-2 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
