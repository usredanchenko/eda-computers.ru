'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Component } from '@/types';
import { calculateRecommendedPsu } from '@/lib/calculations';

interface PsuWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPsu: Component;
  selectedComponents: Component[];
  onConfirm: () => void;
  onSelectCompatible: (psu: Component) => void;
  compatiblePsus: Component[];
}

export default function PsuWarningModal({
  isOpen,
  onClose,
  selectedPsu,
  selectedComponents,
  onConfirm,
  onSelectCompatible,
  compatiblePsus
}: PsuWarningModalProps) {
  const totalTdp = selectedComponents.reduce((sum, c) => sum + c.tdp, 0);
  const recommendedPsu = calculateRecommendedPsu(totalTdp);
  const selectedPsuWattage = selectedPsu?.specs?.wattage || 0;

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                ⚠️
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-400">Предупреждение о совместимости</h2>
                <p className="text-gray-300">Блок питания может быть недостаточен</p>
              </div>
            </div>

            {/* Основная информация */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-dark-800/50 rounded-lg">
                  <div className="text-neon-cyan text-xl font-bold">{totalTdp}W</div>
                  <div className="text-gray-300 text-sm">Общий TDP</div>
                </div>
                <div className="text-center p-4 bg-dark-800/50 rounded-lg">
                  <div className="text-neon-pink text-xl font-bold">{recommendedPsu}W</div>
                  <div className="text-gray-300 text-sm">Рекомендуется</div>
                </div>
                <div className="text-center p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                  <div className="text-red-400 text-xl font-bold">{selectedPsuWattage}W</div>
                  <div className="text-gray-300 text-sm">Выбранный БП</div>
                </div>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h3 className="text-red-400 font-semibold mb-2">Проблема:</h3>
                <p className="text-red-300 text-sm">
                  Блок питания <strong>{selectedPsu.name}</strong> ({selectedPsuWattage}W) 
                  недостаточен для вашей сборки. Рекомендуется использовать БП мощностью 
                  <strong> {recommendedPsu}W</strong> или больше.
                </p>
              </div>
            </div>

            {/* Последствия */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Возможные последствия:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-red-300 font-medium text-sm">Нестабильная работа</span>
                  </div>
                  <p className="text-gray-400 text-xs">Случайные перезагрузки и зависания</p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-red-300 font-medium text-sm">Повреждение компонентов</span>
                  </div>
                  <p className="text-gray-400 text-xs">Риск выхода из строя железа</p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-red-300 font-medium text-sm">Снижение производительности</span>
                  </div>
                  <p className="text-gray-400 text-xs">Ограничение мощности компонентов</p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-red-300 font-medium text-sm">Потеря гарантии</span>
                  </div>
                  <p className="text-gray-400 text-xs">Возможный отказ в гарантийном обслуживании</p>
                </div>
              </div>
            </div>

            {/* Альтернативные варианты */}
            {compatiblePsus.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">✅ Рекомендуемые альтернативы:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {compatiblePsus.slice(0, 4).map((psu) => (
                    <motion.button
                      key={psu.id}
                      onClick={() => onSelectCompatible(psu)}
                      className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center">
                        <div className="text-green-400 font-bold text-sm">{psu.name}</div>
                        <div className="text-white text-lg font-bold">{psu.specs?.wattage}W</div>
                        <div className="text-gray-300 text-xs">{psu.specs?.efficiency}</div>
                        <div className="text-neon-pink font-semibold text-sm mt-1">
                          {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                            minimumFractionDigits: 0
                          }).format(psu.price)}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-600 text-white rounded-lg hover:border-neon-cyan transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Отмена
              </motion.button>
              <motion.button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Продолжить с риском
              </motion.button>
            </div>

            {/* Дополнительная информация */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400 text-sm text-center">
                <strong>Примечание:</strong> Мы рекомендуем использовать блок питания с запасом мощности 
                для обеспечения стабильной работы и возможности будущих апгрейдов.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
