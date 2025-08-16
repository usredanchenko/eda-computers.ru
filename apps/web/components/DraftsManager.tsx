'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Draft, getDrafts, deleteDraft, updateDraft, getDraftsStats, isCompleteBuild } from '@/lib/drafts';
import { Component } from '@/types';

interface DraftsManagerProps {
  onLoadDraft: (components: Component[]) => void;
  onClose: () => void;
  builds: Record<string, unknown>[];
}

export default function DraftsManager({ onLoadDraft, onClose, builds }: DraftsManagerProps) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = () => {
    const savedDrafts = getDrafts();
    setDrafts(savedDrafts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
  };

  const handleDeleteDraft = (id: string) => {
    if (deleteDraft(id)) {
      loadDrafts();
      setShowDeleteConfirm(null);
    }
  };

  const handleLoadDraft = (draft: Draft) => {
    onLoadDraft(draft.components);
    onClose();
  };

  const handleEditName = (draft: Draft) => {
    setEditingName(draft.id);
    setNewName(draft.name);
  };

  const handleSaveName = (draft: Draft) => {
    if (newName.trim()) {
      updateDraft(draft.id, { name: newName.trim() });
      loadDrafts();
    }
    setEditingName(null);
    setNewName('');
  };

  const handleToggleFavorite = (draft: Draft) => {
    updateDraft(draft.id, { isFavorite: !draft.isFavorite });
    loadDrafts();
  };

  const stats = getDraftsStats();

  return (
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
        className="glass-card p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Черновики сборок</h2>
            <p className="text-gray-300">Управление сохраненными конфигурациями</p>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-dark-800/50 rounded-lg">
            <div className="text-neon-cyan text-2xl font-bold">{stats.total}</div>
            <div className="text-gray-300 text-sm">Всего</div>
          </div>
          <div className="text-center p-4 bg-dark-800/50 rounded-lg">
            <div className="text-neon-green text-2xl font-bold">{stats.complete}</div>
            <div className="text-gray-300 text-sm">Полные</div>
          </div>
          <div className="text-center p-4 bg-dark-800/50 rounded-lg">
            <div className="text-neon-yellow text-2xl font-bold">{stats.incomplete}</div>
            <div className="text-gray-300 text-sm">Неполные</div>
          </div>
          <div className="text-center p-4 bg-dark-800/50 rounded-lg">
            <div className="text-neon-pink text-2xl font-bold">
              {new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0
              }).format(stats.averagePrice)}
            </div>
            <div className="text-gray-300 text-sm">Средняя цена</div>
          </div>
        </div>

        {/* Список черновиков */}
        <div className="space-y-4">
          {drafts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-2">Нет сохраненных черновиков</h3>
              <p className="text-gray-300">Создайте свою первую сборку и сохраните её как черновик</p>
            </div>
          ) : (
            drafts.map((draft) => (
              <motion.div
                key={draft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 border border-gray-600 hover:border-neon-cyan transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {draft.isFavorite && (
                      <span className="text-neon-yellow text-xl">⭐</span>
                    )}
                    <div>
                      {editingName === draft.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-dark-800 text-white px-2 py-1 rounded text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveName(draft)}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveName(draft)}
                            className="text-neon-cyan hover:text-white text-sm"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <h3 className="text-lg font-semibold text-white">{draft.name}</h3>
                      )}
                      <p className="text-gray-400 text-sm">
                        {draft.updatedAt.toLocaleDateString('ru-RU')} в {draft.updatedAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => handleToggleFavorite(draft)}
                      className="p-1 text-gray-400 hover:text-neon-yellow transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {draft.isFavorite ? '⭐' : '☆'}
                    </motion.button>
                    <motion.button
                      onClick={() => handleEditName(draft)}
                      className="p-1 text-gray-400 hover:text-neon-cyan transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✏️
                    </motion.button>
                    <motion.button
                      onClick={() => setShowDeleteConfirm(draft.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      🗑️
                    </motion.button>
                  </div>
                </div>

                {/* Информация о сборке */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="text-center p-3 bg-dark-800/50 rounded-lg">
                    <div className="text-neon-cyan text-xl font-bold">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 0
                      }).format(draft.calculation.totalPrice)}
                    </div>
                    <div className="text-gray-300 text-sm">Стоимость</div>
                  </div>
                  <div className="text-center p-3 bg-dark-800/50 rounded-lg">
                    <div className="text-neon-pink text-xl font-bold">
                      {draft.calculation.totalTdp}W
                    </div>
                    <div className="text-gray-300 text-sm">TDP</div>
                  </div>
                  <div className="text-center p-3 bg-dark-800/50 rounded-lg">
                    <div className={`text-xl font-bold ${
                      isCompleteBuild(draft.components) ? 'text-neon-green' : 'text-neon-yellow'
                    }`}>
                      {draft.components.length}/6
                    </div>
                    <div className="text-gray-300 text-sm">Компонентов</div>
                  </div>
                </div>

                {/* Список компонентов */}
                <div className="mb-3">
                  <div className="text-gray-400 text-sm mb-2">Компоненты:</div>
                  <div className="flex flex-wrap gap-2">
                    {draft.components.map((component) => (
                      <span
                        key={component.id}
                        className="px-2 py-1 bg-dark-800/50 rounded text-xs text-gray-300"
                      >
                        {component.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleLoadDraft(draft)}
                    className="flex-1 neon-button py-2 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Загрузить
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedDraft(draft)}
                    className="px-4 py-2 border border-gray-600 text-white rounded hover:border-neon-pink transition-all duration-300 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Сравнить
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Модальное окно подтверждения удаления */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/80"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">Удалить черновик?</h3>
                <p className="text-gray-300 mb-6">
                  Это действие нельзя отменить. Черновик будет удален навсегда.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-600 text-white rounded hover:border-neon-cyan transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Отмена
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteDraft(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Удалить
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Модальное окно сравнения */}
        <AnimatePresence>
          {selectedDraft && (
            <DraftComparisonModal
              draft={selectedDraft}
              builds={builds}
              onClose={() => setSelectedDraft(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// Компонент сравнения черновика с готовыми сборками
function DraftComparisonModal({ draft, builds, onClose }: {
  draft: Draft;
  builds: Record<string, unknown>[];
  onClose: () => void;
}) {
  const comparison = builds
    .map(build => {
      const buildPrice = parseFloat(String(build.price));
      const savings = buildPrice - draft.calculation.totalPrice;
      const savingsPercent = (savings / buildPrice) * 100;

      return {
        id: build.id,
        name: build.name,
        price: buildPrice,
        savings,
        savingsPercent
      };
    })
    .filter(build => build.savings > 0)
    .sort((a, b) => b.savingsPercent - a.savingsPercent)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Сравнение с готовыми сборками</h3>
          <motion.button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-2">Ваша сборка: {draft.name}</h4>
          <div className="text-neon-cyan text-2xl font-bold">
            {new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              minimumFractionDigits: 0
            }).format(draft.calculation.totalPrice)}
          </div>
        </div>

        {comparison.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Похожие готовые сборки:</h4>
            {comparison.map((build) => (
              <div key={String(build.id)} className="p-4 bg-dark-800/50 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-white font-semibold">{String(build.name)}</h5>
                  <div className="text-neon-green text-sm font-bold">
                    Экономия {build.savingsPercent.toFixed(1)}%
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0
                    }).format(build.price)}
                  </div>
                  <div className="text-neon-green font-bold">
                    +{new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0
                    }).format(build.savings)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-lg font-semibold text-white mb-2">Отличная работа!</h4>
            <p className="text-gray-300">
              Ваша сборка дешевле всех готовых вариантов. Вы сэкономили деньги!
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
