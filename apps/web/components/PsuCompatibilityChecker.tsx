'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Component } from '@/types';
import { calculateRecommendedPsu } from '@/lib/calculations';

interface PsuCompatibilityCheckerProps {
  selectedComponents: Component[];
  selectedPsu: Component | null;
  onPsuSelect: (psu: Component) => void;
  availablePsus: Component[];
}

export default function PsuCompatibilityChecker({
  selectedComponents,
  selectedPsu,
  onPsuSelect,
  availablePsus
}: PsuCompatibilityCheckerProps) {
  const totalTdp = selectedComponents.reduce((sum, c) => sum + c.tdp, 0);
  const recommendedPsu = calculateRecommendedPsu(totalTdp);
  const selectedPsuWattage = selectedPsu?.specs?.wattage || 0;
  
  const isCompatible = selectedPsuWattage >= recommendedPsu;
  const isInsufficient = selectedPsuWattage > 0 && selectedPsuWattage < recommendedPsu;
  
  // Фильтруем подходящие БП
  const compatiblePsus = availablePsus.filter(psu => psu.specs?.wattage >= recommendedPsu);
  const insufficientPsus = availablePsus.filter(psu => psu.specs?.wattage < recommendedPsu);

  return (
    <div className="space-y-6">
      {/* Информация о мощности */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Требования к блоку питания</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-dark-800/50 rounded-lg">
            <div className="text-neon-cyan text-2xl font-bold">{totalTdp}W</div>
            <div className="text-gray-300 text-sm">Общий TDP</div>
          </div>
          <div className="text-center p-4 bg-dark-800/50 rounded-lg">
            <div className="text-neon-pink text-2xl font-bold">{recommendedPsu}W</div>
            <div className="text-gray-300 text-sm">Рекомендуемая мощность</div>
          </div>
          <div className="text-center p-4 bg-dark-800/50 rounded-lg">
            <div className={`text-2xl font-bold ${isCompatible ? 'text-green-400' : 'text-red-400'}`}>
              {selectedPsuWattage}W
            </div>
            <div className="text-gray-300 text-sm">Выбранный БП</div>
          </div>
        </div>

        {/* Статус совместимости */}
        <AnimatePresence>
          {selectedPsu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 rounded-lg border-2 ${
                isCompatible 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompatible ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {isCompatible ? '✓' : '✗'}
                </div>
                <div>
                  <h4 className={`font-semibold ${isCompatible ? 'text-green-400' : 'text-red-400'}`}>
                    {isCompatible ? 'Совместим' : 'Несовместим'}
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {isCompatible 
                      ? `Блок питания ${selectedPsu.name} подходит для вашей сборки`
                      : `Блок питания ${selectedPsu.name} недостаточен. Требуется минимум ${recommendedPsu}W`
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Рекомендуемые БП */}
      {compatiblePsus.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">✅ Рекомендуемые блоки питания</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compatiblePsus.slice(0, 6).map((psu) => (
              <motion.button
                key={psu.id}
                onClick={() => onPsuSelect(psu)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedPsu?.id === psu.id
                    ? 'border-neon-cyan bg-neon-cyan/10'
                    : 'border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-neon-cyan font-bold text-lg">{psu.name}</div>
                  <div className="text-white text-2xl font-bold">{psu.specs?.wattage}W</div>
                  <div className="text-gray-300 text-sm">{psu.specs?.efficiency}</div>
                  <div className="text-neon-pink font-semibold mt-2">
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
        </motion.div>
      )}

      {/* Неподходящие БП (скрыты по умолчанию) */}
      {insufficientPsus.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">❌ Неподходящие блоки питания</h3>
          <p className="text-gray-300 mb-4">
            Следующие блоки питания недостаточны для вашей сборки:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insufficientPsus.slice(0, 3).map((psu) => (
              <div
                key={psu.id}
                className="p-4 rounded-lg border-2 border-red-500/30 bg-red-500/5 opacity-60"
              >
                <div className="text-center">
                  <div className="text-red-400 font-bold text-lg">{psu.name}</div>
                  <div className="text-red-300 text-2xl font-bold">{psu.specs?.wattage}W</div>
                  <div className="text-gray-400 text-sm">Недостаточно</div>
                  <div className="text-gray-500 font-semibold mt-2">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0
                    }).format(psu.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Предупреждение о недостаточной мощности */}
      <AnimatePresence>
        {isInsufficient && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-6 border-2 border-red-500/30 bg-red-500/10"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h4 className="text-red-400 font-bold text-lg mb-2">Внимание!</h4>
                <p className="text-red-300 mb-3">
                  Выбранный блок питания {selectedPsu?.name} ({selectedPsuWattage}W) 
                  недостаточен для вашей сборки. Рекомендуется использовать БП мощностью 
                  {recommendedPsu}W или больше.
                </p>
                <div className="text-red-200 text-sm">
                  <strong>Последствия недостаточной мощности:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Нестабильная работа системы</li>
                    <li>Случайные перезагрузки</li>
                    <li>Повреждение компонентов</li>
                    <li>Снижение производительности</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
