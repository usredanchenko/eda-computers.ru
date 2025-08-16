'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cart from './Cart';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Закрытие меню пользователя при клике вне его
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { href: '/', label: 'Главная' },
    { href: '/builds', label: 'Готовые сборки' },
    { href: '/about', label: 'О нас' },
  ];

  return (
    <>
      <header className="relative z-50 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Логотип */}
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
                  <span className="text-dark-950 font-bold text-lg">E</span>
                </div>
                <div className="text-2xl font-bold">
                  <span className="text-gradient">EDA</span>
                  <span className="text-white">Computers</span>
                </div>
              </motion.div>
            </Link>

            {/* Навигация для десктопа */}
            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className={`transition-colors duration-300 font-medium ${
                        isActive 
                          ? 'text-neon-cyan border-b-2 border-neon-cyan' 
                          : 'text-white hover:text-neon-cyan'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Корзина */}
              <motion.button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-neon-cyan transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">🛒</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-neon-pink text-dark-950 text-xs font-bold px-2 py-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </motion.button>

              {/* Меню пользователя */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-white hover:text-neon-cyan transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full flex items-center justify-center">
                      <span className="text-dark-950 font-bold text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:block">{user?.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>

                  {/* Выпадающее меню пользователя */}
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg border border-gray-700 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        <p className="text-neon-cyan text-xs mt-1">
                          {user?.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                        </p>
                      </div>
                      
                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                      >
                        Личный кабинет
                      </Link>
                      
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-neon-cyan hover:text-cyan-400 hover:bg-dark-700 transition-colors"
                        >
                          Админ-панель
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-dark-700 transition-colors"
                      >
                        Выйти
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/auth/login"
                    className="text-white hover:text-neon-cyan transition-colors"
                  >
                    Войти
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold rounded-lg hover:from-neon-pink hover:to-neon-cyan transition-all duration-300"
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </nav>

            {/* Мобильное меню */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-neon-cyan transition-colors"
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

          {/* Мобильное меню */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 border-t border-gray-700 py-4"
            >
              <div className="flex flex-col space-y-4">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`transition-colors duration-300 font-medium ${
                        isActive 
                          ? 'text-neon-cyan' 
                          : 'text-white hover:text-neon-cyan'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                
                {/* Корзина в мобильном меню */}
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-white hover:text-neon-cyan transition-colors"
                >
                  <span className="text-xl">🛒</span>
                  <span>Корзина</span>
                  {totalItems > 0 && (
                    <span className="bg-neon-pink text-dark-950 text-xs font-bold px-2 py-1 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white hover:text-neon-cyan transition-colors"
                    >
                      Личный кабинет
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-neon-cyan hover:text-cyan-400 transition-colors"
                      >
                        Админ-панель
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-red-400 hover:text-red-300 transition-colors"
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white hover:text-neon-cyan transition-colors"
                    >
                      Войти
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold rounded-lg hover:from-neon-pink hover:to-neon-cyan transition-all duration-300 text-center"
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Модальное окно корзины */}
      {isCartOpen && (
        <Cart onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
}
