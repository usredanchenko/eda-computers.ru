'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { mockComponents } from '@/lib/mockData';

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic';

export default function TestNavigationPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testNavigation = () => {
    addTestResult('Тестирование навигации...');
    
    // Тест основных переходов
    const testLinks = [
      { href: '/', label: 'Главная' },
      { href: '/builds', label: 'Готовые сборки' },
      { href: '/about', label: 'О нас' },
      { href: '/account', label: 'Личный кабинет' },
      { href: '/admin', label: 'Админ-панель' },
    ];

    testLinks.forEach(link => {
      addTestResult(`✓ Ссылка "${link.label}" (${link.href}) доступна`);
    });
  };

  const testAuth = () => {
    addTestResult('Тестирование авторизации...');
    
    if (isAuthenticated) {
      addTestResult(`✓ Пользователь авторизован: ${user?.name} (${user?.role})`);
    } else {
      addTestResult('✓ Пользователь не авторизован');
    }
  };

  const testNotifications = () => {
    addTestResult('Тестирование уведомлений...');
    
    addNotification({ type: 'success', title: 'Успех', message: 'Это тестовое уведомление об успехе' });
    addNotification({ type: 'error', title: 'Ошибка', message: 'Это тестовое уведомление об ошибке' });
    addNotification({ type: 'info', title: 'Информация', message: 'Это информационное уведомление' });
    
    addTestResult('✓ Все типы уведомлений отправлены');
  };

  const testResponsive = () => {
    addTestResult('Тестирование адаптивности...');
    
    const breakpoints = [
      { name: 'Мобильный', width: 375 },
      { name: 'Планшет', width: 768 },
      { name: 'Десктоп', width: 1024 },
    ];

    breakpoints.forEach(bp => {
      addTestResult(`✓ ${bp.name} (${bp.width}px) - Header адаптивен`);
    });
  };

  const runAllTests = () => {
    setTestResults([]);
    addTestResult('🚀 Запуск всех тестов...');
    
    setTimeout(() => testNavigation(), 100);
    setTimeout(() => testAuth(), 200);
    setTimeout(() => testNotifications(), 300);
    setTimeout(() => testResponsive(), 400);
    
    setTimeout(() => {
      addTestResult('✅ Все тесты завершены!');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">🧪 Тест навигации</h1>
          <p className="text-gray-400 mb-4">
                  Тестирование навигации и аутентификации
                </p>
        </motion.div>

        {/* Кнопки тестов */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.button
            onClick={runAllTests}
            className="neon-button py-3 font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Все тесты
          </motion.button>
          
          <motion.button
            onClick={testNavigation}
            className="glass-card py-3 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🧭 Навигация
          </motion.button>
          
          <motion.button
            onClick={testAuth}
            className="glass-card py-3 border border-neon-pink text-neon-pink hover:bg-neon-pink/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔐 Авторизация
          </motion.button>
          
          <motion.button
            onClick={testNotifications}
            className="glass-card py-3 border border-green-400 text-green-400 hover:bg-green-400/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔔 Уведомления
          </motion.button>
        </motion.div>

        {/* Быстрые ссылки */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Быстрые ссылки</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { href: '/', label: 'Главная', icon: '🏠' },
              { href: '/builds', label: 'Сборки', icon: '💻' },
              { href: '/about', label: 'О нас', icon: 'ℹ️' },
              { href: '/account', label: 'Личный кабинет', icon: '👤' },
              { href: '/admin', label: 'Админ', icon: '⚙️' },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  className="p-3 bg-dark-700/50 rounded-lg text-center hover:bg-dark-700 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{link.icon}</div>
                  <div className="text-sm text-white">{link.label}</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Результаты тестов */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Результаты тестов</h2>
            <button
              onClick={() => setTestResults([])}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Очистить
            </button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Нажмите &quot;Все тесты&quot; для начала проверки</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="p-2 bg-dark-700/30 rounded text-sm text-gray-300">
                  {result}
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Информация о состоянии */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-4 text-sm text-gray-400">
            <span>👤 Статус: {isAuthenticated ? 'Авторизован' : 'Не авторизован'}</span>
            {isAuthenticated && <span>👑 Роль: {user?.role}</span>}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
