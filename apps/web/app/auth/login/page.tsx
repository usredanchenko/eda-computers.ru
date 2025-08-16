'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getRedirectPath } from '@/lib/authUtils';

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic';

function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRedirect = searchParams.get('redirect') || '/dashboard';

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRedirectPath(user, defaultRedirect);
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, router, defaultRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      // Редирект будет обработан в useEffect после успешной авторизации
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      // setIsLoading(false); // This line is removed as per the new useAuth hook
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Логотип */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link href="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
              <span className="text-dark-950 font-bold text-xl">E</span>
            </div>
            <div className="text-3xl font-bold">
              <span className="text-gradient">EDA</span>
              <span className="text-white">Computers</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Вход в систему</h2>
          <p className="text-gray-400">Войдите в свой аккаунт</p>
        </motion.div>

        {/* Форма входа */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-900/50 backdrop-blur-sm border border-neon-cyan/20 rounded-xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all duration-300"
                placeholder="Введите ваш email"
              />
            </div>

            {/* Пароль */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all duration-300"
                placeholder="Введите ваш пароль"
              />
            </div>

            {/* Ошибка */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Кнопка входа */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold py-3 px-4 rounded-lg hover:from-neon-pink hover:to-neon-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-950 mr-2"></div>
                  Вход...
                </div>
              ) : (
                'Войти'
              )}
            </motion.button>
          </form>

          {/* Ссылки */}
          <div className="mt-6 text-center space-y-3">
            <Link
              href="/auth/register"
              className="text-neon-cyan hover:text-neon-pink transition-colors duration-300 text-sm"
            >
              Нет аккаунта? Зарегистрироваться
            </Link>
            <div>
              <Link
                href="/auth/forgot-password"
                className="text-gray-400 hover:text-neon-cyan transition-colors duration-300 text-sm"
              >
                Забыли пароль?
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Назад на главную */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/"
            className="text-gray-400 hover:text-neon-cyan transition-colors duration-300 text-sm"
          >
            ← Вернуться на главную
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-cyan"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
