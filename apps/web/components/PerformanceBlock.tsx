'use client';

import { motion } from 'framer-motion';
import { BuildCalculation, FPS_TARGETS, getFpsColor, getPerformanceLevel } from '@/lib/calculations';

interface PerformanceBlockProps {
  calculation: BuildCalculation;
  className?: string;
}

export default function PerformanceBlock({ calculation, className = '' }: PerformanceBlockProps) {
  const performanceLevel = getPerformanceLevel(calculation.fpsData);
  
  const performanceColors = {
    ultra: 'from-purple-500 to-pink-500',
    high: 'from-green-500 to-cyan-500',
    medium: 'from-yellow-500 to-orange-500',
    low: 'from-red-500 to-pink-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Производительность</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${performanceColors[performanceLevel as keyof typeof performanceColors] || performanceColors.medium} text-white`}>
          {performanceLevel.toUpperCase()}
        </div>
      </div>

      {/* TDP и БП */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-dark-800/50 rounded-lg">
          <div className="text-neon-cyan text-2xl font-bold">{calculation.totalTdp}W</div>
          <div className="text-gray-300 text-sm">Общий TDP</div>
        </div>
        <div className="text-center p-4 bg-dark-800/50 rounded-lg">
          <div className="text-neon-pink text-2xl font-bold">{calculation.recommendedPsu}W</div>
          <div className="text-gray-300 text-sm">Рекомендуемый БП</div>
        </div>
      </div>

      {/* FPS в играх */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4">FPS в играх</h4>
        <div className="space-y-3">
          {Object.entries(calculation.fpsData).map(([game, fps]) => {
            const target = FPS_TARGETS.high[game as keyof typeof FPS_TARGETS.high];
            const color = getFpsColor(fps, target);
            const gameName = {
              fortnite: 'Fortnite',
              gta5: 'GTA 5',
              warzone: 'Warzone'
            }[game];
            
            return (
              <div key={game} className="flex items-center justify-between p-3 bg-dark-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-neon-cyan"></div>
                  <span className="text-white">{gameName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-bold ${color}`}>{fps}</span>
                  <span className="text-gray-400 text-sm">FPS</span>
                  {fps > 0 && fps < target && (
                    <span className="text-yellow-400 text-xs">(цель: {target})</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Предупреждения */}
      {calculation.warnings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-yellow-400 mb-3">⚠️ Предупреждения</h4>
          <div className="space-y-2">
            {calculation.warnings.map((warning, index) => (
              <div key={index} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-sm">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Проблемы совместимости */}
      {calculation.compatibilityIssues.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-red-400 mb-3">🚨 Проблемы совместимости</h4>
          <div className="space-y-2">
            {calculation.compatibilityIssues.map((issue, index) => (
              <div key={index} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{issue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Общая стоимость */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-white text-lg">Общая стоимость:</span>
          <span className="text-neon-cyan text-2xl font-bold">
            {new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              minimumFractionDigits: 0
            }).format(calculation.totalPrice)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
