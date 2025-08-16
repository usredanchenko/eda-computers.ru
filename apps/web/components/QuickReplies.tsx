'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface QuickRepliesProps {
  onSelectReply: (reply: string) => void;
  className?: string;
}

const quickReplies = [
  {
    id: 'status_update',
    label: 'Обновление статуса',
    replies: [
      'Заказ обрабатывается, ожидайте обновлений',
      'Сборка началась, примерное время готовности 2-3 дня',
      'Заказ собран и отправлен в доставку',
      'Курьер свяжется с вами для уточнения времени доставки'
    ]
  },
  {
    id: 'delivery',
    label: 'Доставка',
    replies: [
      'Доставка запланирована на завтра',
      'Курьер будет у вас в указанное время',
      'При необходимости изменить время доставки, свяжитесь с нами',
      'Заказ доставлен, проверьте комплектацию'
    ]
  },
  {
    id: 'support',
    label: 'Поддержка',
    replies: [
      'По всем вопросам обращайтесь в поддержку',
      'Мы работаем над решением вашего вопроса',
      'Спасибо за обращение, скоро свяжемся с вами',
      'Ваш вопрос передан специалисту'
    ]
  },
  {
    id: 'custom',
    label: 'Прочее',
    replies: [
      'Спасибо за заказ!',
      'Рады помочь!',
      'Обращайтесь, если возникнут вопросы',
      'Приятного использования!'
    ]
  }
];

export default function QuickReplies({ onSelectReply, className = "" }: QuickRepliesProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-300">Быстрые ответы:</span>
        <div className="text-xs text-gray-500">(нажмите для вставки)</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickReplies.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-neon-cyan">{category.label}</h4>
            <div className="space-y-1">
              {category.replies.map((reply, index) => (
                <motion.button
                  key={index}
                  onClick={() => onSelectReply(reply)}
                  className="w-full text-left p-2 text-xs text-gray-300 hover:text-white hover:bg-neon-cyan/10 rounded transition-all duration-200 border border-transparent hover:border-neon-cyan/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {reply}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
