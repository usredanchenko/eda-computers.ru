'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import OrderModal from './OrderModal';
import { useState } from 'react';

interface CartProps {
  onClose: () => void;
}

export default function Cart({ onClose }: CartProps) {
  const { items, removeItem, clearCart, updateQuantity, totalItems, totalPrice } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);

  return (
    <>
      <AnimatePresence>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
        
        {/* Cart Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-900 border-l border-neon-cyan/20 z-50"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neon-cyan/20">
              <h2 className="text-2xl font-bold text-white">Корзина</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-bold text-white mb-2">Корзина пуста</h3>
                  <p className="text-gray-400">Добавьте компоненты в корзину</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-4 border border-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🖥️</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{item.name}</h3>
                          <p className="text-neon-cyan font-bold">
                            {item.price.toLocaleString('ru-RU')} ₽
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-dark-700 rounded flex items-center justify-center text-white hover:bg-dark-600 transition-colors"
                            >
                              -
                            </button>
                            <span className="text-white font-semibold min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-dark-700 rounded flex items-center justify-center text-white hover:bg-dark-600 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <span className="text-xl">🗑️</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neon-cyan/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-semibold">Итого:</span>
                  <span className="text-neon-cyan text-xl font-bold">
                    {totalPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                
                <div className="space-y-3">
                  <motion.button
                    onClick={() => setShowOrderModal(true)}
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-bold py-3 px-4 rounded-lg hover:from-neon-pink hover:to-neon-cyan transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Оформить заказ ({totalItems} {totalItems === 1 ? 'товар' : 'товара'})
                  </motion.button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Очистить корзину
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Order Modal */}
      {showOrderModal && (
        <OrderModal
          isOpen={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            onClose();
          }}
          buildName="Кастомная сборка"
          buildPrice={totalPrice}
          buildComponents={items}
        />
      )}
    </>
  );
}
