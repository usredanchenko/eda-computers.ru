'use client';

import { motion } from 'framer-motion';
import { CardParallaxSection } from '@/components/ParallaxSection';

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">О нас</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            Мы создаем будущее компьютерных технологий, объединяя инновации и стиль
          </p>
        </motion.div>

        {/* Миссия */}
        <CardParallaxSection>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Наша миссия</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              EDA Computers - это инновационная платформа для создания персональных компьютеров, 
              которая объединяет передовые технологии с интуитивно понятным интерфейсом. 
              Мы стремимся сделать процесс сборки ПК доступным, увлекательным и точным для каждого пользователя.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Точность</h3>
                <p className="text-gray-400">Точные расчеты TDP и FPS для оптимальной производительности</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-white mb-2">Скорость</h3>
                <p className="text-gray-400">Быстрая сборка компьютера за считанные минуты</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-white mb-2">Стиль</h3>
                <p className="text-gray-400">Современный дизайн в стиле Трон</p>
              </div>
            </div>
          </motion.div>
        </CardParallaxSection>

        {/* История */}
        <CardParallaxSection>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Наша история</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neon-cyan rounded-full flex items-center justify-center text-dark-950 font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">2023 - Основание</h3>
                  <p className="text-gray-300">
                    Команда энтузиастов объединилась для создания революционной платформы сборки ПК
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neon-pink rounded-full flex items-center justify-center text-dark-950 font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">2024 - Запуск</h3>
                  <p className="text-gray-300">
                    Первая версия конструктора с расчетом TDP, FPS и проверкой совместимости
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neon-yellow rounded-full flex items-center justify-center text-dark-950 font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">2024 - Развитие</h3>
                  <p className="text-gray-300">
                    Добавление режима экономии, черновиков и личного кабинета
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </CardParallaxSection>

        {/* Команда */}
        <CardParallaxSection>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Наша команда</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Егор', role: 'CEO & Founder', avatar: '👨‍💼' },
                { name: 'Максим', role: 'Аналитик', avatar: '👨‍💻' }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-neon-cyan to-neon-pink rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-gray-400">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardParallaxSection>

        {/* Контакты */}
        <CardParallaxSection>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="glass-card p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Свяжитесь с нами</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Контакты</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-neon-cyan">📧</span>
                    <span className="text-gray-300">info@edacomputers.ru</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neon-cyan">📱</span>
                    <span className="text-gray-300">+7 (999) 123-45-67</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neon-cyan">📍</span>
                    <span className="text-gray-300">Москва, ул. Технологическая, 1</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Социальные сети</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-neon-cyan">📘</span>
                    <span className="text-gray-300">VK: @edacomputers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neon-cyan">📷</span>
                    <span className="text-gray-300">Instagram: @edacomputers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neon-cyan">🐦</span>
                    <span className="text-gray-300">Twitter: @edacomputers</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </CardParallaxSection>
      </main>
    </div>
  );
}
