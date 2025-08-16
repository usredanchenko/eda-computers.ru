'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete?: (orderId: string) => void;
  buildName?: string;
  buildPrice?: number;
  buildComponents?: any[];
}

interface OrderFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  notes: string;
}

export default function OrderModal({ 
  isOpen, 
  onClose, 
  onOrderComplete,
  buildName,
  buildPrice,
  buildComponents
}: OrderModalProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    notes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderType, setOrderType] = useState<'guest' | 'auth'>('guest');
  const [error, setError] = useState<string | null>(null);

  // Автоматическое заполнение формы данными пользователя
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.name || '',
        customer_email: user.email || '',
      }));
      setOrderType('auth');
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.customer_name.trim()) {
      setError('Введите ваше имя');
      return false;
    }
    
    if (!formData.customer_email.trim()) {
      setError('Введите email');
      return false;
    }
    
    if (!formData.customer_phone.trim()) {
      setError('Введите номер телефона');
      return false;
    }
    
    if (!formData.delivery_address.trim()) {
      setError('Введите адрес доставки');
      return false;
    }
    
    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer_email)) {
      setError('Введите корректный email');
      return false;
    }
    
    // Проверяем, что в корзине есть товары (только для заказов из корзины)
    if (!buildComponents && items.length === 0) {
      setError('Корзина пуста');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Определяем компоненты для заказа
      const orderComponents = buildComponents || items;
      const orderTotalPrice = buildPrice || totalPrice;

      // Создаем заказ
      const orderData = {
        components: orderComponents,
        total_price: orderTotalPrice,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        delivery_address: formData.delivery_address,
        notes: formData.notes,
        order_type: orderType
      };

      const response = await api.createOrder(orderData);

      if (response.data?.order) {
        // Очищаем корзину если заказ был из корзины
        if (!buildComponents) {
          clearCart();
        }

        // Вызываем callback
        onOrderComplete?.(response.data.order.id.toString());

        // Закрываем модальное окно
        onClose();

        // Перенаправляем в личный кабинет если пользователь авторизован
        if (isAuthenticated) {
          router.push('/account');
        } else {
          // Показываем сообщение об успехе
          alert('Заказ успешно создан! Мы свяжемся с вами в ближайшее время.');
        }
      } else {
        setError('Ошибка создания заказа');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setError('Ошибка создания заказа. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestOrder = () => {
    setOrderType('guest');
  };

  const handleAuthOrder = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setOrderType('auth');
  };

  // Определяем отображаемые компоненты и цену
  const displayComponents = buildComponents || items;
  const displayPrice = buildPrice || totalPrice;
  const displayName = buildName || 'Кастомная сборка';

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
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-dark-900/95 backdrop-blur-sm border border-neon-cyan/20 rounded-xl overflow-hidden"
          >
            {/* Заголовок */}
            <div className="p-6 border-b border-neon-cyan/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Оформление заказа</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <p className="text-gray-400 mt-2">{displayName}</p>
            </div>

            {/* Содержимое */}
            <div className="p-6">
              {/* Выбор типа заказа */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Тип заказа</h3>
                <div className="flex gap-4">
                  <button
                    onClick={handleGuestOrder}
                    className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                      orderType === 'guest'
                        ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    Гостевой заказ
                  </button>
                  <button
                    onClick={handleAuthOrder}
                    className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                      orderType === 'auth'
                        ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {isAuthenticated ? 'Авторизованный заказ' : 'Войти и заказать'}
                  </button>
                </div>
              </div>

              {/* Компоненты заказа */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Компоненты</h3>
                <div className="bg-dark-800/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {displayComponents.length === 0 ? (
                    <p className="text-gray-400 text-center">Нет компонентов</p>
                  ) : (
                    <div className="space-y-2">
                      {displayComponents.map((component, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-white">{component.name}</span>
                          <span className="text-neon-cyan font-semibold">
                            {component.price?.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4 text-right">
                  <span className="text-2xl font-bold text-neon-cyan">
                    Итого: {displayPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              {/* Форма заказа */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ошибка */}
                {error && (
                  <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customer_name" className="block text-white font-medium mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                      placeholder="Ваше имя"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="customer_email" className="block text-white font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="customer_email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="customer_phone" className="block text-white font-medium mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      id="customer_phone"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                      placeholder="+7 (999) 123-45-67"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="delivery_address" className="block text-white font-medium mb-2">
                      Адрес доставки *
                    </label>
                    <input
                      type="text"
                      id="delivery_address"
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                      placeholder="Адрес доставки"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-white font-medium mb-2">
                    Дополнительные пожелания
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none resize-none"
                    placeholder="Особые требования к сборке, время доставки и т.д."
                  />
                </div>

                {/* Кнопки */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold py-3 px-6 rounded-lg hover:from-neon-pink hover:to-neon-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin"></div>
                        Оформление...
                      </div>
                    ) : (
                      'Оформить заказ'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
