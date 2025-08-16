'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryIcon } from './icons/ComponentIcons';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  text: string;
  order_total: number;
  created_at: string;
  components: string[];
}

interface ReviewsCarouselProps {
  reviews: Review[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ReviewsCarousel({ 
  reviews, 
  autoPlay = true, 
  interval = 5000 
}: ReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Автопрокрутка с паузой при фокусе
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, reviews.length, isPaused]);

  // Пауза при фокусе
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);


  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Анимации
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };





  if (!reviews.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-xl font-bold text-white mb-2">Нет отзывов</h3>
        <p className="text-gray-400">Будьте первым, кто оставит отзыв!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      {/* Заголовок секции */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-gradient">Отзывы клиентов</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Что говорят наши клиенты о собранных компьютерах
        </p>
      </motion.div>

      {/* Карусель */}
      <div 
        className="relative h-96 md:h-80"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        tabIndex={0}
        role="region"
        aria-label="Карусель отзывов"
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              
            }}
            className="absolute w-full h-full"
          >
            <div className="glass-card p-8 h-full flex flex-col justify-between">
              {/* Верхняя часть */}
              <div>
                {/* Рейтинг */}
                <div className="flex items-center justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`text-2xl ${
                        i < reviews[currentIndex].rating 
                          ? 'text-yellow-400' 
                          : 'text-gray-600'
                      }`}
                    >
                      ★
                    </motion.div>
                  ))}
                </div>

                {/* Текст отзыва */}
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl text-gray-300 text-center mb-6 italic leading-relaxed"
                >
                  &ldquo;{reviews[currentIndex].text}&rdquo;
                </motion.blockquote>
              </div>

              {/* Нижняя часть */}
              <div>
                {/* Информация о заказе */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mb-4"
                >
                  <div className="text-neon-cyan font-bold text-lg">
                    {reviews[currentIndex].order_total.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-gray-400 text-sm">
                    Стоимость заказа
                  </div>
                </motion.div>

                {/* Компоненты */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center gap-2 mb-4"
                >
                  {reviews[currentIndex].components.slice(0, 4).map((component, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="w-8 h-8 bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 rounded-lg flex items-center justify-center border border-neon-cyan/30"
                    >
                      <span className="text-xs text-neon-cyan">⚡</span>
                    </motion.div>
                  ))}
                  {reviews[currentIndex].components.length > 4 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 }}
                      className="w-8 h-8 bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 rounded-lg flex items-center justify-center border border-neon-pink/30"
                    >
                      <span className="text-xs text-neon-pink">+</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Имя клиента */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center"
                >
                  <div className="text-white font-semibold">
                    {reviews[currentIndex].user_name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {new Date(reviews[currentIndex].created_at).toLocaleDateString('ru-RU')}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>


      </div>

      {/* Индикаторы */}
      <div className="flex justify-center gap-2 mt-8">
        {reviews.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-neon-cyan scale-125'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>

      {/* Счетчик */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-4 text-gray-400"
      >
        {currentIndex + 1} из {reviews.length}
      </motion.div>
    </div>
  );
}
