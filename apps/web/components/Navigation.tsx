'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div role="navigation" className="sticky top-0 z-50 bg-dark-900/50 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex items-center justify-between h-16"
        >
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center ring-1 ring-white/10 shadow-[0_0_12px_rgba(0,255,255,0.25)]"
            >
              <span className="text-dark-950 font-bold text-lg">E</span>
            </motion.div>
            <span className="text-white font-bold text-xl tracking-wide drop-shadow-[0_0_6px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.35)] transition-all">EDA Computers</span>
          </Link>

          {/* Навигационные ссылки */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-all hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
              Главная
            </Link>
            <Link href="/constructor" className="text-gray-300 hover:text-white transition-all hover:drop-shadow-[0_0_10px_rgba(255,0,153,0.6)]">
              Конструктор
            </Link>
            <Link href="/builds" className="text-gray-300 hover:text-white transition-all hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
              Готовые сборки
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-all hover:drop-shadow-[0_0_10px_rgba(255,0,153,0.6)]">
              О нас
            </Link>
          </div>

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full flex items-center justify-center ring-1 ring-white/10 shadow-[0_0_14px_rgba(0,255,255,0.35)]">
                    <span className="text-dark-950 font-bold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user?.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Выпадающее меню */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-dark-900/80 backdrop-blur-xl rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.15)] border border-white/10 py-2"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        <p className="text-neon-cyan text-xs mt-1">
                          {user?.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                        </p>
                      </div>
                      
                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Личный кабинет
                      </Link>
                      
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-neon-cyan hover:text-cyan-400 hover:bg-white/5 transition-colors"
                        >
                          Админ-панель
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                      >
                        Выйти
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-white transition-all hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]"
                >
                  Войти
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold rounded-lg hover:from-neon-пink hover:to-neon-cyan transition-all duration-300 shadow-[0_0_18px_rgba(255,0,153,0.35)]"
                >
                  Регистрация
                </Link>
              </div>
            )}

            {/* Мобильное меню */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors p-2 rounded-lg bg-white/5 border border-white/10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Мобильное меню */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 py-4 bg-dark-900/70 backdrop-blur-xl rounded-b-xl"
            >
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-1"
              >
                Главная
              </Link>
              <Link
                href="/constructor"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-1"
              >
                Конструктор
              </Link>
              <Link
                href="/builds"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-1"
              >
                Готовые сборки
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-1"
              >
                О нас
              </Link>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="text-left text-red-400 hover:text-red-300 transition-colors px-1"
                >
                  Выйти
                </button>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-300 hover:text-white transition-colors px-1"
                  >
                    Войти
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold rounded-lg hover:from-neon-пink hover:to-neon-cyan transition-all duration-300 text-center shadow-[0_0_18px_rgba(255,0,153,0.35)]"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Нижняя неоновая линия */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent opacity-60" />
    </div>
  );
}
