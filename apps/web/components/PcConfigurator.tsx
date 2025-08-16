'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
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
  // Фильтры
  const [manufacturer, setManufacturer] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minFps, setMinFps] = useState<number>(0);
  const [maxTdp, setMaxTdp] = useState<number>(9999);
  const [selectedSort, setSelectedSort] = useState<string>('price-asc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

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

  // Инициализация фильтров из URL
  useEffect(() => {
    if (!searchParams) return;
    const cat = Number(searchParams.get('cat') || '1');
    if (!Number.isNaN(cat) && cat >= 1 && cat <= 6) setSelectedCategory(cat);
    const m = searchParams.get('m');
    if (m) setManufacturer(m);
    const q = searchParams.get('q');
    if (q) setSearch(q);
    const min = Number(searchParams.get('min') || '0');
    const max = Number(searchParams.get('max') || '500000');
    if (!Number.isNaN(min) && !Number.isNaN(max)) setPriceRange([min, max]);
    const stock = searchParams.get('stock') === '1';
    setInStockOnly(stock);
    const fps = Number(searchParams.get('fps') || '0');
    if (!Number.isNaN(fps)) setMinFps(fps);
    const tdp = Number(searchParams.get('tdp') || '9999');
    if (!Number.isNaN(tdp)) setMaxTdp(tdp);
    const sort = searchParams.get('sort');
    if (sort) setSelectedSort(sort);
    const p = Number(searchParams.get('page') || '1');
    if (!Number.isNaN(p) && p >= 1) setPage(p);
    const ps = Number(searchParams.get('ps') || '12');
    if (!Number.isNaN(ps)) setPageSize(ps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Синхронизация URL при изменении фильтров/сортировки/страницы
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 1) params.set('cat', String(selectedCategory));
    if (manufacturer !== 'all') params.set('m', manufacturer);
    if (search.trim()) params.set('q', search.trim());
    if (priceRange[0] !== 0) params.set('min', String(priceRange[0]));
    if (priceRange[1] !== 500000) params.set('max', String(priceRange[1]));
    if (inStockOnly) params.set('stock', '1');
    if (minFps > 0) params.set('fps', String(minFps));
    if (maxTdp !== 9999) params.set('tdp', String(maxTdp));
    if (selectedSort !== 'price-asc') params.set('sort', selectedSort);
    if (page !== 1) params.set('page', String(page));
    if (pageSize !== 12) params.set('ps', String(pageSize));
    const qs = params.toString();
    const url = qs ? `/constructor?${qs}` : '/constructor';
    router.replace(url);
  }, [selectedCategory, manufacturer, search, priceRange, inStockOnly, minFps, maxTdp, selectedSort, page, pageSize, router]);

  // Доступные производители по категории (на основе specs.brand или name)
  const manufacturers = Array.from(new Set(
    components
      .filter(c => c.category_id === selectedCategory)
      .map(c => (typeof (c as any).specs?.brand === 'string' && (c as any).specs.brand) || (c.name.split(' ')[0]))
  ));

  // Фильтрация компонентов по категории + расширенные фильтры
  const filteredComponents = components
    .filter(c => c.category_id === selectedCategory)
    .filter(c => {
      if (manufacturer !== 'all') {
        const brand = (c as any).specs?.brand || c.name.split(' ')[0];
        if (String(brand).toLowerCase() !== manufacturer.toLowerCase()) return false;
      }
      if (inStockOnly && c.stock_quantity <= 0) return false;
      const price = Number(c.price || 0);
      if (price < priceRange[0] || price > priceRange[1]) return false;
      const text = `${c.name} ${Object.values(c.specs || {}).join(' ')}`.toLowerCase();
      if (search.trim() && !text.includes(search.trim().toLowerCase())) return false;
      if (minFps > 0 && (c.category_id === 1 || c.category_id === 3)) {
        const fps = Math.max(Number((c as any).fps_fortnite || 0), Number((c as any).fps_gta5 || 0), Number((c as any).fps_warzone || 0));
        if (fps < minFps) return false;
      }
      const tdp = Number((c as any).tdp || 0);
      if (!Number.isNaN(maxTdp) && tdp > maxTdp) return false;
      return true;
    });

  // Сортировка
  const sortedComponents = [...filteredComponents].sort((a, b) => {
    switch (selectedSort) {
      case 'price-asc': return Number(a.price) - Number(b.price);
      case 'price-desc': return Number(b.price) - Number(a.price);
      case 'name-asc': return a.name.localeCompare(b.name, 'ru');
      case 'name-desc': return b.name.localeCompare(a.name, 'ru');
      case 'fps-desc': {
        const af = Math.max(Number((a as any).fps_fortnite || 0), Number((a as any).fps_gta5 || 0), Number((a as any).fps_warzone || 0));
        const bf = Math.max(Number((b as any).fps_fortnite || 0), Number((b as any).fps_gta5 || 0), Number((b as any).fps_warzone || 0));
        return bf - af;
      }
      case 'tdp-asc': return Number((a as any).tdp || 0) - Number((b as any).tdp || 0);
      case 'tdp-desc': return Number((b as any).tdp || 0) - Number((a as any).tdp || 0);
      default: return 0;
    }
  });

  // Пагинация
  const totalItems = sortedComponents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedComponents = sortedComponents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

            {/* Фильтры */}
            <div className="glass-card p-3 sm:p-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Производитель</label>
                  <select
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full bg-dark-800 border border-gray-700 rounded px-2 py-2 text-gray-200"
                  >
                    <option value="all">Все</option>
                    {manufacturers.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {/* Быстрые пресеты */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Intel','AMD','NVIDIA','AMD'].map((preset) => (
                      <button
                        key={preset + Math.random().toString(36).slice(2,6)}
                        type="button"
                        className={`px-2 py-1 rounded text-xs border transition-colors ${manufacturer.toLowerCase() === preset.toLowerCase() ? 'border-neon-cyan text-neon-cyan' : 'border-gray-700 text-gray-300 hover:border-neon-cyan hover:text-neon-cyan'}`}
                        onClick={() => { setManufacturer(preset); setPage(1); }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Поиск</label>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Название, сокет, объем..."
                    className="w-full bg-dark-800 border border-gray-700 rounded px-3 py-2 text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Цена (₽)</label>
                  <div className="flex gap-2">
                    <input type="number" min={0} value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-1/2 bg-dark-800 border border-gray-700 rounded px-3 py-2 text-gray-200" />
                    <input type="number" min={0} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-1/2 bg-dark-800 border border-gray-700 rounded px-3 py-2 text-gray-200" />
                  </div>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-gray-300">
                    <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                    Только в наличии
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Мин. FPS (CPU/GPU)</label>
                  <input type="number" min={0} value={minFps} onChange={(e) => setMinFps(Number(e.target.value))} className="w-full bg-dark-800 border border-gray-700 rounded px-3 py-2 text-gray-200" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Макс. TDP (Вт)</label>
                  <input type="number" min={0} value={maxTdp} onChange={(e) => setMaxTdp(Number(e.target.value))} className="w-full bg-dark-800 border border-gray-700 rounded px-3 py-2 text-gray-200" />
                </div>
              </div>
            </div>

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
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm hidden sm:inline">{filteredComponents.length} компонентов</span>
                  <select
                    value={selectedSort}
                    onChange={(e) => { setSelectedSort(e.target.value); setPage(1); }}
                    className="bg-dark-800 border border-gray-700 rounded px-2 py-1 text-gray-200 text-sm"
                  >
                    <option value="price-asc">Цена ↑</option>
                    <option value="price-desc">Цена ↓</option>
                    <option value="name-asc">Имя A→Я</option>
                    <option value="name-desc">Имя Я→A</option>
                    <option value="fps-desc">FPS ↓</option>
                    <option value="tdp-asc">TDP ↑</option>
                    <option value="tdp-desc">TDP ↓</option>
                  </select>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                    className="bg-dark-800 border border-gray-700 rounded px-2 py-1 text-gray-200 text-sm"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {pagedComponents.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    isSelected={getSelectedComponent(component.category_id)?.id === component.id}
                    onSelect={handleComponentSelect}
                    showFps={true}
                  />
                ))}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    className="px-3 py-1 border border-gray-700 rounded text-gray-300 disabled:opacity-50"
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Назад
                  </button>
                  {/* Номера страниц */}
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const p = idx + 1;
                    // Сокращенная пагинация: показываем 1, последние, текущую±2
                    const near = Math.abs(p - currentPage) <= 2;
                    const firstOrLast = p === 1 || p === totalPages;
                    if (!near && !firstOrLast) {
                      if (p === 2 || p === totalPages - 1) {
                        return <span key={p} className="px-2 text-gray-500">…</span>;
                      }
                      return null;
                    }
                    return (
                      <button
                        key={p}
                        className={`px-3 py-1 rounded border ${p === currentPage ? 'border-neon-cyan text-neon-cyan' : 'border-gray-700 text-gray-300 hover:border-neon-cyan hover:text-neon-cyan'}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    className="px-3 py-1 border border-gray-700 rounded text-gray-300 disabled:opacity-50"
                    onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Вперед
                  </button>
                </div>
              )}
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
