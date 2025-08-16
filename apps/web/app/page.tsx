'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import { HeroParallaxSection, ContentParallaxSection } from '@/components/ParallaxSection';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитируем загрузку
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Показываем загрузку
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          text="Загружаем EDA Computers..." 
          className="text-center"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section с параллаксом */}
      <HeroParallaxSection>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">EDA</span>
              <br />
              <span className="text-white">Computers</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Соберите свой идеальный компьютер с профессиональной поддержкой
            </p>
            
            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/constructor">
                <motion.button
                  className="neon-button text-xl px-8 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🛠️ Открыть конструктор ПК
                </motion.button>
              </Link>
              
              <Link href="/builds">
                <motion.button
                  className="glass-card text-xl px-8 py-4 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💻 Готовые сборки
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </HeroParallaxSection>

      {/* Карусель отзывов */}
      <ContentParallaxSection>
        <ReviewsCarousel 
          reviews={[
            {
              id: 1,
              user_name: 'Александр К.',
              rating: 5,
              text: 'Отличная сборка! Все работает идеально, игры запускаются без проблем. Спасибо за качественную работу!',
              order_total: 220000,
              created_at: '2024-01-25T16:45:00Z',
              components: ['RTX 4070 Ti', 'i7-13700K', '32GB RAM', '1TB SSD']
            },
            {
              id: 2,
              user_name: 'Мария С.',
              rating: 5,
              text: 'Профессиональная сборка для работы с графикой. Все компоненты подобраны идеально!',
              order_total: 180000,
              created_at: '2024-02-10T14:30:00Z',
              components: ['RX 7800 XT', 'Ryzen 7 7700X', '32GB RAM', '2TB SSD']
            },
            {
              id: 3,
              user_name: 'Дмитрий В.',
              rating: 4,
              text: 'Хорошая сборка, но немного шумновата. В целом доволен покупкой.',
              order_total: 195000,
              created_at: '2024-02-15T09:20:00Z',
              components: ['RTX 4060 Ti', 'i5-13600K', '16GB RAM', '1TB SSD']
            },
            {
              id: 4,
              user_name: 'Елена М.',
              rating: 5,
              text: 'Быстрая доставка, качественная сборка. Рекомендую всем!',
              order_total: 165000,
              created_at: '2024-02-20T11:15:00Z',
              components: ['RTX 4060', 'i5-13400F', '16GB RAM', '1TB SSD']
            },
            {
              id: 5,
              user_name: 'Сергей П.',
              rating: 5,
              text: 'Потрясающая производительность! Игры на максимальных настройках летают.',
              order_total: 280000,
              created_at: '2024-02-25T13:45:00Z',
              components: ['RTX 4080', 'i9-13900K', '64GB RAM', '2TB SSD']
            }
          ]}
          autoPlay={true}
          interval={4000}
        />
      </ContentParallaxSection>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 EDA Computers. Технологии будущего в каждом клике.
          </p>
        </div>
      </footer>
    </div>
  );
}
