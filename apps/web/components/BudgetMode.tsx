'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Component } from '@/types';
import { calculateBuild } from '@/lib/calculations';

interface BudgetModeProps {
  components: Component[];
  onApplyBuild: (components: Component[]) => void;
  onClose: () => void;
}

interface BudgetBuild {
  components: Component[];
  totalPrice: number;
  performance: number;
  compatibility: boolean;
}

export default function BudgetMode({ components, onApplyBuild, onClose }: BudgetModeProps) {
  const [budget, setBudget] = useState<number>(150000);
  const [priority, setPriority] = useState<'performance' | 'balanced' | 'budget'>('balanced');
  const [generatedBuild, setGeneratedBuild] = useState<BudgetBuild | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const budgetPresets = [
    { name: 'Бюджетная', value: 80000, description: 'Базовые игры 1080p' },
    { name: 'Средняя', value: 150000, description: 'Игры 1440p, стриминг' },
    { name: 'Высокая', value: 250000, description: 'Игры 4K, профессиональная работа' },
    { name: 'Премиум', value: 400000, description: 'Максимальная производительность' }
  ];

  const generateBudgetBuild = async () => {
    setIsGenerating(true);
    
    // Имитация задержки для UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const build = createBudgetBuild(budget, priority, components);
    setGeneratedBuild(build);
    setIsGenerating(false);
  };

  const createBudgetBuild = (
    targetBudget: number,
    buildPriority: 'performance' | 'balanced' | 'budget',
    allComponents: Component[]
  ): BudgetBuild => {
    const categories = [1, 2, 3, 4, 5, 6]; // CPU, MB, GPU, RAM, Storage, PSU
    const selectedComponents: Component[] = [];
    let remainingBudget = targetBudget;

    // Распределение бюджета по приоритету
    const budgetAllocation = {
      performance: { cpu: 0.25, gpu: 0.45, mb: 0.08, ram: 0.08, storage: 0.08, psu: 0.06 },
      balanced: { cpu: 0.20, gpu: 0.40, mb: 0.10, ram: 0.10, storage: 0.12, psu: 0.08 },
      budget: { cpu: 0.15, gpu: 0.35, mb: 0.12, ram: 0.12, storage: 0.15, psu: 0.11 }
    };

    const allocation = budgetAllocation[buildPriority];

    // Выбор компонентов по категориям
    categories.forEach((categoryId, index) => {
      const categoryComponents = allComponents.filter(c => c.category_id === categoryId);
      const categoryBudget = remainingBudget * Object.values(allocation)[index];
      
      // Сортировка по приоритету
      const sortedComponents = [...categoryComponents];
      
      if (categoryId === 1) { // CPU - по FPS
        sortedComponents.sort((a, b) => (b.fps_fortnite || 0) - (a.fps_fortnite || 0));
      } else if (categoryId === 3) { // GPU - по FPS
        sortedComponents.sort((a, b) => (b.fps_fortnite || 0) - (a.fps_fortnite || 0));
      } else { // Остальные - по цене/качеству
        sortedComponents.sort((a, b) => a.price - b.price);
      }

      // Выбор лучшего компонента в рамках бюджета
      const affordableComponents = sortedComponents.filter(c => c.price <= categoryBudget);
      const selected = affordableComponents.length > 0 
        ? affordableComponents[0] 
        : sortedComponents[0]; // Если ничего не подходит, берем самый дешевый

      selectedComponents.push(selected);
      remainingBudget -= selected.price;
    });

    const calculation = calculateBuild(selectedComponents);
    const performance = calculatePerformanceScore(selectedComponents);

    return {
      components: selectedComponents,
      totalPrice: calculation.totalPrice,
      performance,
      compatibility: calculation.compatibilityIssues.length === 0
    };
  };

  const calculatePerformanceScore = (components: Component[]): number => {
    const cpu = components.find(c => c.category_id === 1);
    const gpu = components.find(c => c.category_id === 3);
    
    if (!cpu || !gpu) return 0;

    const cpuScore = (cpu.fps_fortnite || 0) / 200; // Нормализация к 200 FPS
    const gpuScore = (gpu.fps_fortnite || 0) / 200;
    
    return Math.round((cpuScore + gpuScore) * 50); // 0-100 баллов
  };

  // Удаляем неиспользуемую функцию getPerformanceLabel

  const getPerformanceColor = (score: number): string => {
    if (score >= 80) return 'text-neon-green';
    if (score >= 60) return 'text-neon-cyan';
    if (score >= 40) return 'text-neon-yellow';
    return 'text-neon-red';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Режим экономии</h2>
            <p className="text-gray-300">Автоматический подбор компонентов под ваш бюджет</p>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </div>

        {/* Настройки бюджета */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Бюджет */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Бюджет</h3>
            
            {/* Пресеты */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {budgetPresets.map((preset) => (
                <motion.button
                  key={preset.name}
                  onClick={() => setBudget(preset.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                    budget === preset.value
                      ? 'border-neon-cyan bg-neon-cyan/10'
                      : 'border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-white font-semibold text-sm">{preset.name}</div>
                  <div className="text-neon-cyan text-lg font-bold">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0
                    }).format(preset.value)}
                  </div>
                  <div className="text-gray-400 text-xs">{preset.description}</div>
                </motion.button>
              ))}
            </div>

            {/* Кастомный бюджет */}
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Кастомный бюджет:</label>
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mb-2"
              />
              <div className="text-neon-cyan text-xl font-bold text-center">
                {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0
                }).format(budget)}
              </div>
            </div>
          </div>

          {/* Приоритет */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Приоритет сборки</h3>
            
            <div className="space-y-3">
              {[
                { key: 'performance', name: 'Производительность', icon: '🚀', description: 'Максимальная мощность' },
                { key: 'balanced', name: 'Сбалансированная', icon: '⚖️', description: 'Оптимальное соотношение' },
                { key: 'budget', name: 'Бюджетная', icon: '💰', description: 'Минимальная стоимость' }
              ].map((option) => (
                <motion.button
                  key={option.key}
                  onClick={() => setPriority(option.key as 'performance' | 'balanced' | 'budget')}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    priority === option.key
                      ? 'border-neon-cyan bg-neon-cyan/10'
                      : 'border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <div className="text-white font-semibold">{option.name}</div>
                      <div className="text-gray-400 text-sm">{option.description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Кнопка генерации */}
        <div className="text-center mb-6">
          <motion.button
            onClick={generateBudgetBuild}
            disabled={isGenerating}
            className="neon-button text-xl px-8 py-4 disabled:opacity-50"
            whileHover={{ scale: isGenerating ? 1 : 1.05 }}
            whileTap={{ scale: isGenerating ? 1 : 0.95 }}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Генерируем сборку...
              </div>
            ) : (
              '🎯 Сгенерировать сборку'
            )}
          </motion.button>
        </div>

        {/* Результат */}
        <AnimatePresence>
          {generatedBuild && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Сгенерированная сборка</h3>
              
              {/* Статистика */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-dark-800/50 rounded-lg">
                  <div className="text-neon-cyan text-2xl font-bold">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0
                    }).format(generatedBuild.totalPrice)}
                  </div>
                  <div className="text-gray-300 text-sm">Стоимость</div>
                </div>
                <div className="text-center p-4 bg-dark-800/50 rounded-lg">
                  <div className={`text-2xl font-bold ${getPerformanceColor(generatedBuild.performance)}`}>
                    {generatedBuild.performance}/100
                  </div>
                  <div className="text-gray-300 text-sm">Производительность</div>
                </div>
                <div className="text-center p-4 bg-dark-800/50 rounded-lg">
                  <div className={`text-2xl font-bold ${generatedBuild.compatibility ? 'text-neon-green' : 'text-neon-red'}`}>
                    {generatedBuild.compatibility ? '✓' : '✗'}
                  </div>
                  <div className="text-gray-300 text-sm">Совместимость</div>
                </div>
                <div className="text-center p-4 bg-dark-800/50 rounded-lg">
                  <div className="text-neon-pink text-2xl font-bold">
                    {Math.round((generatedBuild.totalPrice / budget) * 100)}%
                  </div>
                  <div className="text-gray-300 text-sm">Бюджета</div>
                </div>
              </div>

              {/* Компоненты */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Выбранные компоненты:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {generatedBuild.components.map((component) => (
                    <div key={component.id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-semibold text-sm">{component.name}</div>
                        <div className="text-gray-400 text-xs">
                          {['CPU', 'MB', 'GPU', 'RAM', 'Storage', 'PSU'][component.category_id - 1]}
                        </div>
                      </div>
                      <div className="text-neon-cyan font-bold">
                        {new Intl.NumberFormat('ru-RU', {
                          style: 'currency',
                          currency: 'RUB',
                          minimumFractionDigits: 0
                        }).format(component.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3">
                <motion.button
                  onClick={() => onApplyBuild(generatedBuild.components)}
                  className="flex-1 neon-button py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Применить сборку
                </motion.button>
                <motion.button
                  onClick={generateBudgetBuild}
                  className="px-6 py-3 border border-gray-600 text-white rounded hover:border-neon-pink transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Сгенерировать заново
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
