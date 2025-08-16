'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardParallaxSection } from '@/components/ParallaxSection';
import { mockComponents } from '@/lib/mockData';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCart } from '@/hooks/useCart';
import { useNotifications } from '@/hooks/useNotifications';
import OrderModal from '@/components/OrderModal';
import { CaseIcon, CpuIcon, GpuIcon, RamIcon, StorageIcon, PsuIcon, CoolingIcon } from '@/components/icons/ComponentIcons';
import { api } from '@/lib/api';

interface Build {
  id: number;
  name: string;
  description: string;
  components: number[];
  total_price: number;
  performance_level: string;
  image_url?: string;
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic';

export default function BuildsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerformance, setSelectedPerformance] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [selectedSort, setSelectedSort] = useState<string>('price-asc');
  const [buildType, setBuildType] = useState<'gaming'|'office'|'creator'|'all'>('all');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailBuild, setDetailBuild] = useState<Build | null>(null);
  const [componentsMap, setComponentsMap] = useState<Record<number, any>>({});
  const [detailMetrics, setDetailMetrics] = useState<{
    totalTdp: number;
    recommendedPsu: number;
    fps: { fortnite: number; gta5: number; warzone: number };
  } | null>(null);
  const { addItem } = useCart();
  const { addNotification } = useNotifications();

  // Инициализация фильтров из URL при монтировании
  useEffect(() => {
    const perf = searchParams.get('perf');
    const sort = searchParams.get('sort');
    const min = searchParams.get('min');
    const max = searchParams.get('max');

    if (perf === 'all' || perf === 'high' || perf === 'medium') {
      setSelectedPerformance(perf);
    }
    if (sort === 'price-asc' || sort === 'price-desc' || sort === 'name-asc' || sort === 'name-desc') {
      setSelectedSort(sort);
    }
    const minNum = Number(min);
    const maxNum = Number(max);
    if (!Number.isNaN(minNum) && !Number.isNaN(maxNum) && minNum >= 0 && maxNum >= minNum) {
      setPriceRange([minNum, Math.min(maxNum, 500000)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Синхронизация URL при изменении фильтров/сортировки
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedPerformance !== 'all') params.set('perf', selectedPerformance);
    if (selectedSort !== 'price-asc') params.set('sort', selectedSort);
    if (priceRange[0] !== 0) params.set('min', String(priceRange[0]));
    if (priceRange[1] !== 500000) params.set('max', String(priceRange[1]));

    const query = params.toString();
    const url = query ? `/builds?${query}` : '/builds';
    router.replace(url);
  }, [selectedPerformance, selectedSort, priceRange, router]);

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    try {
      const [buildsRes, compsRes] = await Promise.all([
        api.getPublicBuilds(),
        api.getComponents()
      ]);
      const list: any[] = buildsRes?.data?.builds || [];
      setBuilds(list.map((b: any, i: number) => ({
        id: b.id ?? i + 1,
        name: b.name,
        description: b.description,
        components: Array.isArray(b.components) ? b.components : [],
        total_price: Number(b.total_price || b.price || 0),
        performance_level: (b.is_featured ? 'high' : 'medium') as string,
        image_url: b.image_url
      })));
      const comps: any[] = compsRes?.data?.components || [];
      const map: Record<number, any> = {};
      for (const c of comps) map[c.id] = c;
      setComponentsMap(map);
    } catch (error) {
      console.error('Error fetching builds:', error);
    } finally {
      setLoading(false);
    }
  };

  const computeBuildMetrics = (build: Build) => {
    const selectedComponents = build.components.map((id) => componentsMap[id]).filter(Boolean);
    let totalTdp = 0;
    let fpsFortnite = 0;
    let fpsGta5 = 0;
    let fpsWarzone = 0;
    for (const comp of selectedComponents) {
      const tdp = Number(comp?.tdp || 0);
      if (!Number.isNaN(tdp)) totalTdp += tdp;
    }
    // Оценка FPS: используем значения видеокарты (GPU) если есть, иначе максимум по компонентам
    const gpu = selectedComponents.find((c: any) => c?.category_name === 'GPU' || c?.category_id === 3);
    if (gpu) {
      fpsFortnite = Number(gpu.fps_fortnite || 0);
      fpsGta5 = Number(gpu.fps_gta5 || 0);
      fpsWarzone = Number(gpu.fps_warzone || 0);
    } else {
      for (const comp of selectedComponents) {
        fpsFortnite = Math.max(fpsFortnite, Number(comp?.fps_fortnite || 0));
        fpsGta5 = Math.max(fpsGta5, Number(comp?.fps_gta5 || 0));
        fpsWarzone = Math.max(fpsWarzone, Number(comp?.fps_warzone || 0));
      }
    }
    const recommendedPsu = Math.ceil((totalTdp * 1.5) / 50) * 50; // запас по питанию ~50%
    return {
      totalTdp,
      recommendedPsu,
      fps: { fortnite: fpsFortnite, gta5: fpsGta5, warzone: fpsWarzone }
    };
  };

  const filtered = builds.filter(build => {
    const performanceMatch = selectedPerformance === 'all' || build.performance_level === selectedPerformance;
    const priceMatch = build.total_price >= priceRange[0] && build.total_price <= priceRange[1];
    // Тип сборки по эвристике
    let typeMatch = true;
    if (buildType !== 'all') {
      const compObjs = build.components.map((id: number) => componentsMap[id]).filter(Boolean);
      const hasGpu = compObjs.some((c: any) => c?.category_id === 3);
      if (buildType === 'gaming') typeMatch = hasGpu && build.performance_level === 'high';
      if (buildType === 'office') typeMatch = build.performance_level === 'medium' && build.total_price < 120000;
      if (buildType === 'creator') typeMatch = hasGpu && build.total_price >= 120000;
    }
    return performanceMatch && priceMatch && typeMatch;
  });

  const sortedBuilds = [...filtered].sort((a, b) => {
    switch (selectedSort) {
      case 'price-asc':
        return a.total_price - b.total_price;
      case 'price-desc':
        return b.total_price - a.total_price;
      case 'name-asc':
        return a.name.localeCompare(b.name, 'ru');
      case 'name-desc':
        return b.name.localeCompare(a.name, 'ru');
      default:
        return 0;
    }
  });

  const performanceFilters = [
    { value: 'all', label: 'Все', color: 'text-white' },
    { value: 'high', label: 'Высокая', color: 'text-neon-pink' },
    { value: 'medium', label: 'Средняя', color: 'text-neon-cyan' },
  ];

  const typeFilters = [
    { value: 'all', label: 'Все', icon: '✨' },
    { value: 'gaming', label: 'Игровая', icon: '🎮' },
    { value: 'office', label: 'Офисная', icon: '🧑‍💻' },
    { value: 'creator', label: 'Творческая', icon: '🎨' },
  ] as const;

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

  const resetFilters = () => {
    setSelectedPerformance('all');
    setSelectedSort('price-asc');
    setPriceRange([0, 500000]);
  };

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Фильтры</h2>
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-neon-cyan transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
            
            {/* Фильтр по производительности */}
            <div className="mt-6 mb-6">
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
              {/* Тип сборки */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Тип сборки</h3>
                <div className="flex flex-wrap gap-3">
                  {typeFilters.map((t) => (
                    <motion.button
                      key={t.value}
                      onClick={() => setBuildType(t.value)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                        buildType === t.value
                          ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                          : 'border-gray-600 hover:border-neon-pink hover:bg-neon-pink/5 text-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-1">{t.icon}</span>
                      {t.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Фильтр по цене и сортировка */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-end">
              <div className="md:col-span-2">
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
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Сортировка</h3>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-neon-cyan"
                >
                  <option value="price-asc">Цена: по возрастанию</option>
                  <option value="price-desc">Цена: по убыванию</option>
                  <option value="name-asc">Название: A→Я</option>
                  <option value="name-desc">Название: Я→A</option>
                </select>
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
              Найдено сборок: {sortedBuilds.length}
            </h2>
          </div>

          {sortedBuilds.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">Сборки не найдены</h3>
              <p className="text-gray-400">Попробуйте изменить фильтры</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedBuilds.map((build, index) => (
                <motion.div
                  key={build.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 text-center hover:border-neon-cyan transition-all duration-300 component-card-hover"
                >
                  {/* Изображение сборки */}
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 flex items-center justify-center relative">
                    {build.performance_level === 'high' ? (
                      <GpuIcon size={84} className="text-neon-pink drop-shadow-[0_0_14px_rgba(255,0,128,0.8)]" glow={true} />
                    ) : (
                      <CaseIcon size={80} className="text-neon-cyan drop-shadow-[0_0_12px_rgba(0,255,255,0.8)]" glow={true} />
                    )}
                     <div className="absolute top-2 right-2">
                       <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                         build.performance_level === 'high' 
                           ? 'bg-gradient-to-r from-neon-pink to-neon-cyan text-white'
                           : 'bg-gradient-to-r from-neon-cyan to-neon-green text-white'
                       }`}>
                         {build.performance_level === 'high' ? 'HIGH' : 'MEDIUM'}
                       </div>
                     </div>
                     {/* Бейдж типа сборки */}
                     <div className="absolute bottom-2 left-2">
                       <div className="px-2 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white">
                         {buildType === 'gaming' ? '🎮 Игровая' : buildType === 'office' ? '🧑‍💻 Офисная' : buildType === 'creator' ? '🎨 Творческая' : (build.performance_level === 'high' ? '🎮 Игровая' : '🧑‍💻 Офисная')}
                       </div>
                     </div>
                   </div>

                  {/* Информация о сборке */}
                  <h3 className="text-2xl font-bold text-white mb-1">{build.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 border border-white/10 text-gray-300">
                      {build.components.length} компонентов
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 border border-white/10 text-gray-300">
                      {build.performance_level === 'high' ? 'Высокая' : 'Средняя'}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-2">{build.description}</p>
                  
                  {/* Цена */}
                  <div className="text-neon-cyan text-3xl font-bold mb-4">
                    {build.total_price.toLocaleString('ru-RU')} ₽
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
                        setDetailBuild(build);
                        setDetailMetrics(computeBuildMetrics(build));
                        setShowDetails(true);
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
          buildComponents={selectedBuild.components.map(id => componentsMap[id]).filter(Boolean)}
        />
      )}

      {/* Модальное окно деталей сборки */}
      {showDetails && detailBuild && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl glass-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-2">{detailBuild.name}</h3>
            <p className="text-gray-300 mb-4">{detailBuild.description}</p>
            {/* Картинка если есть */}
            {detailBuild.image_url && (
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={detailBuild.image_url} alt={detailBuild.name} className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
            <div className="mb-4 text-neon-cyan font-bold text-xl">
              Итого: {detailBuild.total_price.toLocaleString('ru-RU')} ₽
            </div>
            {detailMetrics && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                  <div className="text-gray-400 text-xs">Суммарный TDP</div>
                  <div className="text-white text-lg font-bold">{detailMetrics.totalTdp} Вт</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                  <div className="text-gray-400 text-xs">Реком. БП</div>
                  <div className="text-white text-lg font-bold">{detailMetrics.recommendedPsu} Вт</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                  <div className="text-gray-400 text-xs">FPS (оценка)</div>
                  <div className="text-white text-lg font-bold">F:{detailMetrics.fps.fortnite} / G:{detailMetrics.fps.gta5} / W:{detailMetrics.fps.warzone}</div>
                </div>
              </div>
            )}
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-white font-semibold mb-2">Состав сборки:</h4>
              <div className="space-y-2 max-h-72 overflow-auto pr-2">
                {detailBuild.components.map((id) => {
                  const c = componentsMap[id];
                  if (!c) return null;
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span className="text-gray-300">{c.name}</span>
                      <span className="text-gray-400">{Number(c.price || 0).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-neon-cyan"
                onClick={() => setShowDetails(false)}
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
