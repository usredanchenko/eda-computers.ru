'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CardParallaxSection } from '@/components/ParallaxSection';
import { mockBuilds, mockComponents } from '@/lib/mockData';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCart } from '@/hooks/useCart';
import { useNotifications } from '@/hooks/useNotifications';
import OrderModal from '@/components/OrderModal';
import { CaseIcon } from '@/components/icons/ComponentIcons';

interface Build {
  id: number;
  name: string;
  description: string;
  components: number[];
  total_price: number;
  performance_level: string;
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic';

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerformance, setSelectedPerformance] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);
  const { addItem } = useCart();
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    try {
      // Имитация загрузки данных
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBuilds(mockBuilds);
    } catch (error) {
      console.error('Error fetching builds:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBuilds = builds.filter(build => {
    const performanceMatch = selectedPerformance === 'all' || build.performance_level === selectedPerformance;
    const priceMatch = build.total_price >= priceRange[0] && build.total_price <= priceRange[1];
    return performanceMatch && priceMatch;
  });

  const performanceFilters = [
    { value: 'all', label: 'Все', color: 'text-white' },
    { value: 'high', label: 'Высокая', color: 'text-neon-pink' },
    { value: 'medium', label: 'Средняя', color: 'text-neon-cyan' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          text="Загружаем готовые сборки..." 
          className="text-center"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <CardParallaxSection>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Готовые сборки</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Профессионально собранные компьютеры для любых задач
            </p>
          </motion.div>
        </div>
      </CardParallaxSection>

      {/* Фильтры */}
      <CardParallaxSection>
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass-card p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Фильтры</h2>
            
            {/* Фильтр по производительности */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Уровень производительности</h3>
              <div className="flex flex-wrap gap-3">
                {performanceFilters.map((filter) => (
                  <motion.button
                    key={filter.value}
                    onClick={() => setSelectedPerformance(filter.value)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                      selectedPerformance === filter.value
                        ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                        : 'border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/5 text-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Фильтр по цене */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">
                Цена: {priceRange[0].toLocaleString('ru-RU')} - {priceRange[1].toLocaleString('ru-RU')} ₽
              </h3>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </div>
      </CardParallaxSection>

      {/* Каталог сборок */}
      <CardParallaxSection>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Найдено сборок: {filteredBuilds.length}
            </h2>
          </div>

          {filteredBuilds.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">Сборки не найдены</h3>
              <p className="text-gray-400">Попробуйте изменить фильтры</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBuilds.map((build, index) => (
                <motion.div
                  key={build.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 text-center hover:border-neon-cyan transition-all duration-300 component-card-hover"
                >
                  {/* Изображение сборки */}
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 flex items-center justify-center relative">
                    <CaseIcon 
                      size={80} 
                      className="text-neon-cyan drop-shadow-[0_0_12px_rgba(0,255,255,0.8)]" 
                      glow={true}
                    />
                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        build.performance_level === 'high' 
                          ? 'bg-gradient-to-r from-neon-pink to-neon-cyan text-white'
                          : 'bg-gradient-to-r from-neon-cyan to-neon-green text-white'
                      }`}>
                        {build.performance_level === 'high' ? 'HIGH' : 'MEDIUM'}
                      </div>
                    </div>
                  </div>

                  {/* Информация о сборке */}
                  <h3 className="text-2xl font-bold text-white mb-2">{build.name}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{build.description}</p>
                  
                  {/* Цена */}
                  <div className="text-neon-cyan text-3xl font-bold mb-4">
                    {build.total_price.toLocaleString('ru-RU')} ₽
                  </div>

                  {/* Характеристики */}
                  <div className="space-y-2 mb-6 text-left">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Производительность:</span>
                      <span className="text-white">
                        {build.performance_level === 'high' ? 'Высокая' : 'Средняя'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Компонентов:</span>
                      <span className="text-white">{build.components.length}</span>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => {
                        setSelectedBuild(build);
                        setShowOrderModal(true);
                      }}
                      className="w-full neon-button py-3 text-lg font-bold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      💻 Купить сейчас
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        // Показать детали
                        console.log('Показать детали:', build);
                      }}
                      className="w-full py-3 text-gray-400 hover:text-neon-cyan transition-colors border border-gray-600 rounded-lg hover:border-neon-cyan"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      📋 Подробнее
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardParallaxSection>

      {/* CTA Section */}
      <CardParallaxSection>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Не нашли подходящую сборку?
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Создайте свою уникальную конфигурацию в нашем конструкторе
            </p>
            <Link href="/constructor">
              <motion.button
                className="neon-button text-xl px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🛠️ Открыть конструктор
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </CardParallaxSection>

      {/* Модальное окно оформления заказа */}
      {showOrderModal && selectedBuild && (
        <OrderModal
          isOpen={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedBuild(null);
          }}
          buildName={selectedBuild.name}
          buildPrice={selectedBuild.total_price}
          buildComponents={selectedBuild.components.map(id => 
            mockComponents.find(c => c.id === id)
          ).filter(Boolean)}
        />
      )}
    </div>
  );
}
