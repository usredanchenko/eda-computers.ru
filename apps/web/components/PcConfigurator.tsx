'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Component } from '@/types';
import { calculateBuild } from '@/lib/calculations';
import { saveDraft, generateDraftName, getDraftsStats } from '@/lib/drafts';
import ComponentCard from './ComponentCard';
import PerformanceBlock from './PerformanceBlock';
import PsuCompatibilityChecker from './PsuCompatibilityChecker';
import DraftsManager from './DraftsManager';
import BudgetMode from './BudgetMode';
import LoadingSpinner from './LoadingSpinner';
import OrderModal from './OrderModal';

interface PcConfiguratorProps {
  components: Component[];
  builds?: Record<string, unknown>[];
  className?: string;
}

const CATEGORIES = [
  { id: 1, name: 'Процессоры', icon: '🖥️', description: 'CPU' },
  { id: 2, name: 'Материнские платы', icon: '🔌', description: 'Motherboard' },
  { id: 3, name: 'Видеокарты', icon: '🎮', description: 'GPU' },
  { id: 4, name: 'Оперативная память', icon: '💾', description: 'RAM' },
  { id: 5, name: 'Накопители', icon: '💿', description: 'Storage' },
  { id: 6, name: 'Блоки питания', icon: '⚡', description: 'PSU' }
];

export default function PcConfigurator({ components, builds = [], className = '' }: PcConfiguratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);
  const [showPerformance, setShowPerformance] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDraftsManager, setShowDraftsManager] = useState(false);
  const [showBudgetMode, setShowBudgetMode] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [budget] = useState<number>(200000);
  const [draftsStats, setDraftsStats] = useState(getDraftsStats());
  const [loading, setLoading] = useState(true);

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Имитация загрузки компонентов
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Обновление статистики черновиков
  useEffect(() => {
    setDraftsStats(getDraftsStats());
  }, [selectedComponents]);

  // Фильтрация компонентов по категории
  const filteredComponents = components.filter(c => c.category_id === selectedCategory);

  // Получение выбранного компонента для текущей категории
  const getSelectedComponent = (categoryId: number) => {
    return selectedComponents.find(c => c.category_id === categoryId);
  };

  // Обработка выбора компонента
  const handleComponentSelect = (component: Component) => {
    setSelectedComponents(prev => {
      const filtered = prev.filter(c => c.category_id !== component.category_id);
      return [...filtered, component];
    });
  };

  // Удаление компонента
  const handleComponentRemove = (categoryId: number) => {
    setSelectedComponents(prev => prev.filter(c => c.category_id !== categoryId));
  };

  // Загрузка черновика
  const handleLoadDraft = (components: Component[]) => {
    setSelectedComponents(components);
  };

  // Применение сборки из режима экономии
  const handleApplyBudgetBuild = (components: Component[]) => {
    setSelectedComponents(components);
    setShowBudgetMode(false);
  };

  // Сохранение черновика
  const handleSaveDraft = () => {
    if (selectedComponents.length === 0) {
      alert('Нет компонентов для сохранения');
      return;
    }

    const draftName = generateDraftName(selectedComponents);
    const buildCalculation = calculateBuild(selectedComponents);
    saveDraft({
      name: draftName,
      components: selectedComponents,
      calculation: buildCalculation
    });
    setDraftsStats(getDraftsStats());
  };

  // Сборка заказа
  const handleBuildOrder = () => {
    if (selectedComponents.length < 6) {
      alert('Выберите все необходимые компоненты');
      return;
    }

    setShowOrderModal(true);
  };

  // Обработка завершения заказа
  const handleOrderComplete = (orderId: string) => {
    console.log('Заказ создан:', orderId);
    // Можно добавить дополнительную логику
  };

  // Расчёт сборки
  const buildCalculation = calculateBuild(selectedComponents);
  const budgetUsed = (buildCalculation.totalPrice / budget) * 100;

  // Показываем загрузку
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 ${className} flex items-center justify-center`}>
        <LoadingSpinner 
          size="lg" 
          text="Загружаем конструктор..." 
          className="text-center"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 pb-28 md:pb-8">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">
            <span className="text-gradient">Конструктор ПК</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Собери свой идеальный компьютер с проверкой совместимости и производительности
          </p>
        </motion.div>

        {/* Локальные нав-ссылки удалены: глобальная навигация уже есть в Layout */}

        {/* Панель инструментов */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* Счетчик бюджета */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-neon-cyan text-xl sm:text-2xl font-bold">
                {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0
                }).format(buildCalculation.totalPrice)}
              </div>
              <div className="text-gray-300 text-xs sm:text-sm">Стоимость</div>
            </div>
            
            <div className="text-center">
              <div className={`text-xl sm:text-2xl font-bold ${
                budgetUsed > 90 ? 'text-neon-red' : 
                budgetUsed > 75 ? 'text-neon-yellow' : 'text-neon-green'
              }`}>
                {budgetUsed.toFixed(1)}%
              </div>
              <div className="text-gray-300 text-xs sm:text-sm">Бюджета</div>
            </div>

            <div className="w-32 h-2 bg-dark-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  budgetUsed > 90 ? 'bg-neon-red' : 
                  budgetUsed > 75 ? 'bg-neon-yellow' : 'bg-neon-green'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <motion.button
              onClick={() => setShowBudgetMode(true)}
              className="w-full sm:w-auto px-4 py-2 border border-neon-pink text-neon-pink rounded hover:bg-neon-pink hover:text-dark-950 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💰 Режим экономии
            </motion.button>
            
            <motion.button
              onClick={() => setShowDraftsManager(true)}
              className="w-full sm:w-auto px-4 py-2 border border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan hover:text-dark-950 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📝 Черновики ({draftsStats.total})
            </motion.button>
            
            <motion.button
              onClick={handleSaveDraft}
              disabled={selectedComponents.length === 0}
              className="w-full sm:w-auto px-4 py-2 bg-neon-cyan text-dark-950 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: selectedComponents.length > 0 ? 1.05 : 1 }}
              whileTap={{ scale: selectedComponents.length > 0 ? 0.95 : 1 }}
            >
              💾 Сохранить
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая панель - Выбор компонентов */}
          <div className="lg:col-span-2">
            {/* Категории */}
            <>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Выберите категорию</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {CATEGORIES.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'border-neon-cyan bg-neon-cyan/10'
                        : 'border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/5'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="text-white font-semibold text-xs">{category.name}</div>
                  </motion.button>
                ))}
              </div>
            </>

            {/* Выбранные компоненты */}
            {selectedComponents.length > 0 && (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Выбранные компоненты</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CATEGORIES.map((category) => {
                    const component = getSelectedComponent(category.id);
                    if (!component) return null;

                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <div className="text-white font-semibold text-sm">{component.name}</div>
                            <div className="text-neon-cyan text-sm">
                              {new Intl.NumberFormat('ru-RU', {
                                style: 'currency',
                                currency: 'RUB',
                                minimumFractionDigits: 0
                              }).format(component.price)}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleComponentRemove(category.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ✕
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Список компонентов */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-3 sm:p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-gray-400 text-sm">
                  {filteredComponents.length} компонентов
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredComponents.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    isSelected={getSelectedComponent(component.category_id)?.id === component.id}
                    onSelect={handleComponentSelect}
                    showFps={true}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Правая панель - Производительность и совместимость */}
          <div className="space-y-6">
            {/* Блок производительности */}
            {selectedComponents.length > 0 && (
              <PerformanceBlock calculation={buildCalculation} />
            )}

            {/* Проверка совместимости БП */}
            {selectedComponents.length > 0 && (
              <PsuCompatibilityChecker
                selectedComponents={selectedComponents}
                selectedPsu={getSelectedComponent(6) || null}
                onPsuSelect={handleComponentSelect}
                availablePsus={components.filter(c => c.category_id === 6)}
              />
            )}

            {/* Кнопка показа производительности на мобильных */}
            {isMobile && selectedComponents.length > 0 && (
              <motion.button
                onClick={() => setShowPerformance(!showPerformance)}
                className="w-full neon-button py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showPerformance ? 'Скрыть' : 'Показать'} производительность
              </motion.button>
            )}

            {/* Мобильная панель производительности */}
            <AnimatePresence>
              {isMobile && showPerformance && selectedComponents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden"
                >
                  <PerformanceBlock calculation={buildCalculation} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Кнопка сборки заказа */}
        {selectedComponents.length >= 6 && (
          <>
            {/* Sticky-кнопка на мобильных */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-dark-900/90 backdrop-blur-sm border-t border-gray-800 px-4 py-3">
              <motion.button
                onClick={handleBuildOrder}
                className="w-full neon-button text-lg px-6 py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Собрать заказ за {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0
                }).format(buildCalculation.totalPrice)}
              </motion.button>
            </div>

            {/* Обычная кнопка на десктопе */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:block text-center mt-8"
            >
              <motion.button
                onClick={handleBuildOrder}
                className="neon-button text-xl px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Собрать заказ за {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0
                }).format(buildCalculation.totalPrice)}
              </motion.button>
            </motion.div>
          </>
        )}
      </div>

      {/* Модальные окна */}
      <AnimatePresence>
        {showDraftsManager && (
          <DraftsManager
            onLoadDraft={handleLoadDraft}
            onClose={() => setShowDraftsManager(false)}
            builds={builds}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBudgetMode && (
          <BudgetMode
            components={components}
            onApplyBuild={handleApplyBudgetBuild}
            onClose={() => setShowBudgetMode(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrderModal && (
          <OrderModal
            isOpen={showOrderModal}
            onClose={() => setShowOrderModal(false)}
            onOrderComplete={handleOrderComplete}
            buildName="Кастомная сборка"
            buildPrice={buildCalculation.totalPrice}
            buildComponents={selectedComponents}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
