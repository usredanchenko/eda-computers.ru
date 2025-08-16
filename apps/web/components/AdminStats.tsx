'use client';

import { motion } from 'framer-motion';

interface AdminStatsProps {
  stats: {
    total: number;
    active: number;
    byRole: { [key: string]: number };
    newLast30Days: number;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      title: 'Всего пользователей',
      value: stats.total,
      color: 'text-neon-cyan',
      bgColor: 'bg-neon-cyan/10',
      borderColor: 'border-neon-cyan/20',
      icon: '👥'
    },
    {
      title: 'Активных',
      value: stats.active,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      icon: '✅'
    },
    {
      title: 'Новых за 30 дней',
      value: stats.newLast30Days,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      icon: '🆕'
    },
    {
      title: 'Администраторов',
      value: stats.byRole.ADMIN || 0,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      icon: '👑'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${card.bgColor} ${card.borderColor} backdrop-blur-sm border rounded-xl p-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">{card.title}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <div className={`text-3xl ${card.color}`}>
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
