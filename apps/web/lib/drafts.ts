import { Component } from '@/types';
import { BuildCalculation } from './calculations';

export interface Draft {
  id: string;
  name: string;
  components: Component[];
  calculation: BuildCalculation;
  createdAt: Date;
  updatedAt: Date;
  isFavorite?: boolean;
}

export interface DraftComparison {
  draft: Draft;
  similarBuilds: Array<{
    id: number;
    name: string;
    price: number;
    savings: number;
    savingsPercent: number;
  }>;
}

/**
 * Сохранение черновика в localStorage
 */
export function saveDraft(draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>): Draft {
  const newDraft: Draft = {
    ...draft,
    id: generateDraftId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const drafts = getDrafts();
  drafts.push(newDraft);
  
  // Проверяем, что мы в браузере
  if (typeof window !== 'undefined') {
    localStorage.setItem('eda-drafts', JSON.stringify(drafts));
  }

  return newDraft;
}

/**
 * Получение всех черновиков
 */
export function getDrafts(): Draft[] {
  try {
    // Проверяем, что мы в браузере
    if (typeof window === 'undefined') {
      return [];
    }
    
    const draftsJson = localStorage.getItem('eda-drafts');
    if (!draftsJson) return [];

    const drafts = JSON.parse(draftsJson);
    return drafts.map((draft: Record<string, unknown>) => ({
      ...draft,
      createdAt: new Date(draft.createdAt as string),
      updatedAt: new Date(draft.updatedAt as string)
    }));
  } catch (error) {
    console.error('Error loading drafts:', error);
    return [];
  }
}

/**
 * Обновление черновика
 */
export function updateDraft(id: string, updates: Partial<Draft>): Draft | null {
  const drafts = getDrafts();
  const index = drafts.findIndex(d => d.id === id);
  
  if (index === -1) return null;

  const updatedDraft: Draft = {
    ...drafts[index],
    ...updates,
    updatedAt: new Date()
  };

  drafts[index] = updatedDraft;
  
  // Проверяем, что мы в браузере
  if (typeof window !== 'undefined') {
    localStorage.setItem('eda-drafts', JSON.stringify(drafts));
  }

  return updatedDraft;
}

/**
 * Удаление черновика
 */
export function deleteDraft(id: string): boolean {
  const drafts = getDrafts();
  const filteredDrafts = drafts.filter(d => d.id !== id);
  
  if (filteredDrafts.length === drafts.length) return false;

  // Проверяем, что мы в браузере
  if (typeof window !== 'undefined') {
    localStorage.setItem('eda-drafts', JSON.stringify(filteredDrafts));
  }
  return true;
}

/**
 * Получение черновика по ID
 */
export function getDraft(id: string): Draft | null {
  const drafts = getDrafts();
  return drafts.find(d => d.id === id) || null;
}

/**
 * Генерация уникального ID для черновика
 */
function generateDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Сравнение черновика с готовыми сборками
 */
export function compareWithBuilds(draft: Draft, builds: Record<string, unknown>[]): DraftComparison {
  const similarBuilds = builds
    .map(build => {
      const buildPrice = parseFloat(build.price as string);
      const savings = buildPrice - draft.calculation.totalPrice;
      const savingsPercent = (savings / buildPrice) * 100;

      return {
        id: build.id as number,
        name: build.name as string,
        price: buildPrice,
        savings,
        savingsPercent
      };
    })
    .filter(build => build.savings > 0) // Только если готовая сборка дороже
    .sort((a, b) => b.savingsPercent - a.savingsPercent) // Сортировка по экономии
    .slice(0, 3); // Топ-3 варианта

  return {
    draft,
    similarBuilds
  };
}

/**
 * Автоматическое создание названия черновика
 */
export function generateDraftName(components: Component[]): string {
  const cpu = components.find(c => c.category_id === 1);
  const gpu = components.find(c => c.category_id === 3);
  
  if (cpu && gpu) {
    return `${cpu.name} + ${gpu.name}`;
  } else if (cpu) {
    return `${cpu.name} сборка`;
  } else if (gpu) {
    return `${gpu.name} сборка`;
  }
  
  return `Сборка ${new Date().toLocaleDateString('ru-RU')}`;
}

/**
 * Проверка, является ли сборка полной
 */
export function isCompleteBuild(components: Component[]): boolean {
  const requiredCategories = [1, 2, 3, 4, 5, 6]; // CPU, MB, GPU, RAM, Storage, PSU
  return requiredCategories.every(categoryId => 
    components.some(c => c.category_id === categoryId)
  );
}

/**
 * Получение статистики черновиков
 */
export function getDraftsStats(): {
  total: number;
  complete: number;
  incomplete: number;
  totalValue: number;
  averagePrice: number;
} {
  const drafts = getDrafts();
  const complete = drafts.filter(d => isCompleteBuild(d.components));
  const incomplete = drafts.filter(d => !isCompleteBuild(d.components));
  const totalValue = drafts.reduce((sum, d) => sum + d.calculation.totalPrice, 0);

  return {
    total: drafts.length,
    complete: complete.length,
    incomplete: incomplete.length,
    totalValue,
    averagePrice: drafts.length > 0 ? totalValue / drafts.length : 0
  };
}
