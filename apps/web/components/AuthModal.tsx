'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register } = useAuth();
  const { addNotification } = useNotifications();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      addNotification({ type: 'error', title: 'Ошибка', message: 'Заполните все обязательные поля' });
      return;
    }

    if (!isLogin && !formData.name) {
      addNotification({ type: 'error', title: 'Ошибка', message: 'Введите имя для регистрации' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        addNotification({ type: 'success', title: 'Успешный вход', message: 'Добро пожаловать!' });
      } else {
        await register(formData.email, formData.password, formData.name);
        addNotification({ type: 'success', title: 'Регистрация успешна', message: 'Аккаунт создан!' });
      }
      onClose();
    } catch (error: unknown) {
      addNotification({ type: 'error', title: 'Ошибка', message: error instanceof Error ? error.message : 'Произошла ошибка' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-800/90 backdrop-blur-sm border border-gray-700 rounded-xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 neon-text">
                {isLogin ? 'Вход' : 'Регистрация'}
              </h2>
              <p className="text-gray-400">
                {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Имя</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-dark-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                    placeholder="Введите ваше имя"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-dark-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                  placeholder="Введите email"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Пароль</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-dark-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                  placeholder="Введите пароль"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-neon-cyan text-dark-950 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full"
                    />
                    {isLogin ? 'Вход...' : 'Регистрация...'}
                  </div>
                ) : (
                  isLogin ? 'Войти' : 'Зарегистрироваться'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleToggleMode}
                className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
              >
                {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
