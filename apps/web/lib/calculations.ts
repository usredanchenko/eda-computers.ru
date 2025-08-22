import { Component } from '@/types';

export interface BuildCalculation {
  totalTdp: number;
  recommendedPsu: number;
  fpsData: {
    fortnite: number;
    gta5: number;
    warzone: number;
  };
  totalPrice: number;
  compatibilityIssues: string[];
  warnings: string[];
}

export interface FpsTarget {
  fortnite: number;
  gta5: number;
  warzone: number;
}

// Целевые FPS для разных уровней качества
export const FPS_TARGETS: Record<string, FpsTarget> = {
  low: { fortnite: 60, gta5: 30, warzone: 40 },
  medium: { fortnite: 120, gta5: 60, warzone: 80 },
  high: { fortnite: 180, gta5: 90, warzone: 120 },
  ultra: { fortnite: 240, gta5: 120, warzone: 160 }
};

/**
 * Расчёт общего TDP сборки
 */
export function calculateTotalTdp(components: Component[]): number {
  return components.reduce((total, component) => total + Number(component.tdp || 0), 0);
}

/**
 * Расчёт рекомендованной мощности БП
 * Формула: TDP + 200W (для периферии) + 20% запас
 */
export function calculateRecommendedPsu(totalTdp: number): number {
  const basePower = totalTdp + 200; // Периферия
  const recommended = Math.ceil(basePower * 1.2); // 20% запас
  
  // Округляем до ближайшего стандартного значения
  const standardPsu = [550, 650, 750, 850, 1000, 1200, 1600];
  return standardPsu.find(wattage => wattage >= recommended) || recommended;
}

/**
 * Проверка совместимости БП
 */
export function checkPsuCompatibility(selectedPsu: Component | null, recommendedPsu: number): {
  isCompatible: boolean;
  isInsufficient: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  message: string;
} {
  if (!selectedPsu) {
    return {
      isCompatible: false,
      isInsufficient: false,
      riskLevel: 'none',
      message: 'Блок питания не выбран'
    };
  }

  const rawWattage = selectedPsu.specs?.wattage as unknown;
  const selectedWattage = typeof rawWattage === 'string'
    ? parseInt(rawWattage.replace(/[^0-9]/g, ''), 10) || 0
    : Number(rawWattage || 0);
  const isCompatible = selectedWattage >= recommendedPsu;
  const isInsufficient = selectedWattage > 0 && selectedWattage < recommendedPsu;
  
  let riskLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  let message = '';

  if (isCompatible) {
    const margin = ((selectedWattage - recommendedPsu) / recommendedPsu) * 100;
    if (margin >= 50) {
      riskLevel = 'none';
      message = 'Отличный выбор! Большой запас мощности';
    } else if (margin >= 20) {
      riskLevel = 'low';
      message = 'Хороший выбор с достаточным запасом';
    } else {
      riskLevel = 'low';
      message = 'Минимально допустимая мощность';
    }
  } else {
    const deficit = ((recommendedPsu - selectedWattage) / recommendedPsu) * 100;
    if (deficit <= 10) {
      riskLevel = 'medium';
      message = 'Небольшой дефицит мощности - возможны проблемы при пиковых нагрузках';
    } else if (deficit <= 25) {
      riskLevel = 'high';
      message = 'Значительный дефицит мощности - высокий риск нестабильной работы';
    } else {
      riskLevel = 'high';
      message = 'Критический дефицит мощности - использование не рекомендуется';
    }
  }

  return { isCompatible, isInsufficient, riskLevel, message };
}

/**
 * Получение подходящих БП
 */
export function getCompatiblePsus(availablePsus: Component[], recommendedPsu: number): {
  compatible: Component[];
  insufficient: Component[];
  optimal: Component[];
} {
  const getWattage = (psu: Component): number => {
    const raw = psu.specs?.wattage as unknown;
    return typeof raw === 'string' ? (parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0) : Number(raw || 0);
  };

  const compatible = availablePsus.filter(psu => getWattage(psu) >= recommendedPsu);
  const insufficient = availablePsus.filter(psu => getWattage(psu) < recommendedPsu);
  
  // Оптимальные БП с запасом 30-50%
  const optimal = compatible.filter(psu => {
    const wattage = getWattage(psu);
    const margin = ((wattage - recommendedPsu) / recommendedPsu) * 100;
    return margin >= 30 && margin <= 50;
  });

  return { compatible, insufficient, optimal };
}

/**
 * Расчёт FPS для сборки
 * Основан на CPU и GPU (самые важные компоненты для игр)
 */
export function calculateFps(components: Component[]): { fortnite: number; gta5: number; warzone: number } {
  const cpu = components.find(c => c.category_id === 1);
  const gpu = components.find(c => c.category_id === 3);
  
  if (!cpu || !gpu) {
    return { fortnite: 0, gta5: 0, warzone: 0 };
  }
  
  // Базовый FPS от GPU
  const baseFps = {
    fortnite: Number(gpu.fps_fortnite || 0),
    gta5: Number(gpu.fps_gta5 || 0),
    warzone: Number(gpu.fps_warzone || 0)
  };
  
  // Модификатор от CPU (CPU может ограничивать производительность)
  const cpuModifier = Math.min(Number(cpu.fps_fortnite || 0) / 200, 1.2); // Максимум +20%
  
  return {
    fortnite: Math.round(baseFps.fortnite * cpuModifier),
    gta5: Math.round(baseFps.gta5 * cpuModifier),
    warzone: Math.round(baseFps.warzone * cpuModifier)
  };
}

/**
 * Проверка совместимости компонентов
 */
export function checkCompatibility(components: Component[]): string[] {
  const issues: string[] = [];
  
  const cpu = components.find(c => c.category_id === 1);
  const motherboard = components.find(c => c.category_id === 2);
  const gpu = components.find(c => c.category_id === 3);
  const ram = components.find(c => c.category_id === 4);
  const psu = components.find(c => c.category_id === 6);
  
  // Проверка совместимости CPU и материнской платы
  if (cpu && motherboard) {
    const cpuSocket = typeof cpu.compatibility === 'object' ? cpu.compatibility?.socket_type : undefined;
    const mbSocket = typeof motherboard.compatibility === 'object' ? motherboard.compatibility?.socket_type : undefined;
    
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push(`Несовместимость: процессор ${cpu.name} (${cpuSocket}) не подходит к материнской плате ${motherboard.name} (${mbSocket})`);
    }
  }
  
  // Проверка совместимости RAM и материнской платы
  if (ram && motherboard) {
    const ramSpeed = typeof ram.compatibility === 'object' ? ram.compatibility?.max_speed : undefined;
    const mbMaxSpeed = motherboard.specs?.max_ram_speed;
    
    if (ramSpeed && mbMaxSpeed && ramSpeed > mbMaxSpeed) {
      issues.push(`RAM ${ram.name} (${ramSpeed}MHz) может работать медленнее на материнской плате ${motherboard.name} (макс. ${mbMaxSpeed}MHz)`);
    }
  }
  
  // Проверка мощности БП
  if (gpu && psu) {
    const gpuMinPsu = typeof gpu.compatibility === 'object' ? gpu.compatibility?.min_psu : undefined;
    const psuWattage = psu.specs?.wattage;
    
    if (gpuMinPsu && psuWattage && psuWattage < gpuMinPsu) {
      issues.push(`Блок питания ${psu.name} (${psuWattage}W) недостаточен для видеокарты ${gpu.name} (мин. ${gpuMinPsu}W)`);
    }
  }
  
  // Проверка размера корпуса для видеокарты
  if (gpu && typeof gpu.compatibility === 'object' && gpu.compatibility?.requires_atx) {
    // Здесь можно добавить проверку корпуса, если он выбран
    // Пока просто предупреждение
    issues.push(`Видеокарта ${gpu.name} требует корпус ATX или больше`);
  }
  
  return issues;
}

/**
 * Полный расчёт сборки
 */
export function calculateBuild(components: Component[]): BuildCalculation {
  const totalTdp = calculateTotalTdp(components);
  const recommendedPsu = calculateRecommendedPsu(totalTdp);
  const fpsData = calculateFps(components);
  const totalPrice = components.reduce((sum, c) => sum + Number(c.price || 0), 0);
  const compatibilityIssues = checkCompatibility(components);
  
  const warnings: string[] = [];
  
  // Проверка FPS относительно целевых значений
  Object.entries(fpsData).forEach(([game, fps]) => {
    const target = FPS_TARGETS.high[game as keyof FpsTarget];
    if (fps > 0 && fps < target) {
      warnings.push(`${game}: ${fps} FPS ниже рекомендуемых ${target} FPS`);
    }
  });
  
  // Проверка мощности БП
  const selectedPsu = components.find(c => c.category_id === 6);
  if (selectedPsu && selectedPsu.specs?.wattage < recommendedPsu) {
    warnings.push(`Рекомендуется БП мощностью ${recommendedPsu}W или больше`);
  }
  
  return {
    totalTdp,
    recommendedPsu,
    fpsData,
    totalPrice,
    compatibilityIssues,
    warnings
  };
}

/**
 * Получение уровня производительности
 */
export function getPerformanceLevel(fpsData: { fortnite: number; gta5: number; warzone: number }): string {
  const avgFps = (fpsData.fortnite + fpsData.gta5 + fpsData.warzone) / 3;
  
  if (avgFps >= 150) return 'ultra';
  if (avgFps >= 100) return 'high';
  if (avgFps >= 60) return 'medium';
  return 'low';
}

/**
 * Форматирование цены
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price);
}

/**
 * Получение цвета для FPS
 */
export function getFpsColor(fps: number, target: number): string {
  if (fps >= target) return 'text-green-400';
  if (fps >= target * 0.8) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * Получение цвета для уровня риска БП
 */
export function getRiskColor(riskLevel: 'none' | 'low' | 'medium' | 'high'): string {
  switch (riskLevel) {
    case 'none': return 'text-green-400';
    case 'low': return 'text-yellow-400';
    case 'medium': return 'text-orange-400';
    case 'high': return 'text-red-400';
    default: return 'text-gray-400';
  }
}
