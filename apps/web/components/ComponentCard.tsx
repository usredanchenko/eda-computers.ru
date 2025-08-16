'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Component } from '@/types';
import { getFpsColor, FPS_TARGETS } from '@/lib/calculations';
import { useCategoryIcon } from './icons/ComponentIcons';
import { useCart } from '@/hooks/useCart';


interface ComponentCardProps {
  component: Component;
  isSelected?: boolean;
  onSelect?: (component: Component) => void;
  showFps?: boolean;
  className?: string;
}

export default function ComponentCard({
  component,
  isSelected = false,
  onSelect,
  showFps = false,
  className = ''
}: ComponentCardProps) {
  const hasFpsData = component.fps_fortnite > 0 || component.fps_gta5 > 0 || component.fps_warzone > 0;
  const { addItem, hasItem, getItemById } = useCart();
  
  const IconComponent = useCategoryIcon(component.category_id);

  const getCategoryName = (categoryId: number) => {
    const names = {
      1: 'CPU',
      2: 'Motherboard',
      3: 'GPU',
      4: 'RAM',
      5: 'Storage',
      6: 'PSU'
    };
    return names[categoryId as keyof typeof names] || 'Component';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`glass-card p-4 md:p-6 transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-neon-cyan bg-neon-cyan/10 shadow-lg shadow-neon-cyan/20' 
          : 'border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/5'
      } ${className}`}
      onClick={() => onSelect?.(component)}
    >
      {/* Изображение компонента */}
      <div className="relative mb-4">
        <div className="w-full h-32 md:h-40 rounded-lg overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900">
          {component.image_url ? (
            <Image
              src={component.image_url}
              alt={component.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-cyan/10 to-neon-pink/10">
              <IconComponent 
                size={64} 
                className="text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" 
                glow={true}
              />
            </div>
          )}
        </div>
        
        {/* Индикатор выбора */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center"
          >
            <span className="text-dark-950 text-sm font-bold">✓</span>
          </motion.div>
        )}
        
        {/* Категория */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-dark-900/80 rounded text-xs text-gray-300">
          {getCategoryName(component.category_id)}
        </div>
      </div>

      {/* Название компонента */}
      <h3 className="text-sm md:text-base font-bold text-white mb-2 line-clamp-2">
        {component.name}
      </h3>

      {/* Цена */}
      <div className="text-neon-cyan text-lg md:text-xl font-bold mb-3">
        {new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          minimumFractionDigits: 0
        }).format(component.price)}
      </div>

      {/* TDP */}
      {component.tdp > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-neon-pink text-sm">⚡</span>
          <span className="text-gray-300 text-sm">TDP: {component.tdp}W</span>
        </div>
      )}

      {/* FPS данные (только для GPU и CPU) */}
      {showFps && hasFpsData && (component.category_id === 1 || component.category_id === 3) && (
        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-2">FPS в играх:</div>
          <div className="space-y-1">
            {component.fps_fortnite > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">Fortnite:</span>
                <span className={getFpsColor(component.fps_fortnite, FPS_TARGETS.high.fortnite)}>
                  {component.fps_fortnite}
                </span>
              </div>
            )}
            {component.fps_gta5 > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">GTA 5:</span>
                <span className={getFpsColor(component.fps_gta5, FPS_TARGETS.high.gta5)}>
                  {component.fps_gta5}
                </span>
              </div>
            )}
            {component.fps_warzone > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">Warzone:</span>
                <span className={getFpsColor(component.fps_warzone, FPS_TARGETS.high.warzone)}>
                  {component.fps_warzone}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Спецификации */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">Спецификации:</div>
        <div className="space-y-1">
          {Object.entries(component.specs || {}).slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-gray-300 capitalize">{key}:</span>
              <span className="text-gray-400">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Наличие */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${component.stock_quantity > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-xs text-gray-400">
            {component.stock_quantity > 0 ? `В наличии: ${component.stock_quantity}` : 'Нет в наличии'}
          </span>
        </div>
        
        {/* Кнопки */}
        <div className="flex gap-2">
          {/* Кнопка выбора */}
          {onSelect && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 text-xs rounded transition-all duration-300 ${
                isSelected
                  ? 'bg-neon-cyan text-dark-950 font-bold'
                  : 'bg-dark-800 text-white hover:bg-neon-cyan hover:text-dark-950'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(component);
              }}
            >
              {isSelected ? 'Выбрано' : 'Выбрать'}
            </motion.button>
          )}
          
          {/* Кнопка корзины */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 text-xs rounded transition-all duration-300 ${
              hasItem(component.id)
                ? 'bg-neon-pink text-white font-bold'
                : 'bg-dark-800 text-white hover:bg-neon-pink hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              addItem(component);
            }}
          >
            {hasItem(component.id) ? `🛒 ${getItemById(component.id)?.quantity ?? 1}` : '🛒'}
          </motion.button>
        </div>
      </div>

      {/* Совместимость предупреждения */}
      {component.compatibility && typeof component.compatibility === 'object' && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          {(component.compatibility as Record<string, any>).requires_atx && (
            <div className="text-xs text-yellow-400 flex items-center gap-1">
              <span>⚠️</span>
              <span>Требует корпус ATX</span>
            </div>
          )}
          {(component.compatibility as Record<string, any>).min_psu && (
            <div className="text-xs text-yellow-400 flex items-center gap-1">
              <span>⚡</span>
              <span>Мин. БП: {(component.compatibility as Record<string, any>).min_psu}W</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
