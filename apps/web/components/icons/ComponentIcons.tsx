import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

// Базовые стили для неоновых иконок
const baseIconStyle = "transition-all duration-300 hover:scale-110";
const glowStyle = "drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]";

// Процессор
export const CpuIcon: React.FC<IconProps> = ({ className = "", size = 24, glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${baseIconStyle} ${glow ? glowStyle : ""} ${className}`}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="6" y="6" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="8" cy="8" r="1" fill="currentColor"/>
    <circle cx="16" cy="8" r="1" fill="currentColor"/>
    <circle cx="8" cy="16" r="1" fill="currentColor"/>
    <circle cx="16" cy="16" r="1" fill="currentColor"/>
    <path d="M12 6V8M12 16V18M6 12H8M16 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Материнская плата
export const MotherboardIcon: React.FC<IconProps> = ({ className = "", size = 24, glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${baseIconStyle} ${glow ? glowStyle : ""} ${className}`}
  >
    <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="4" y="4" width="4" height="4" rx="1" fill="currentColor"/>
    <rect x="16" y="4" width="4" height="4" rx="1" fill="currentColor"/>
    <rect x="4" y="16" width="4" height="4" rx="1" fill="currentColor"/>
    <rect x="16" y="16" width="4" height="4" rx="1" fill="currentColor"/>
    <rect x="10" y="8" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="7" cy="7" r="0.5" fill="currentColor"/>
    <circle cx="17" cy="7" r="0.5" fill="currentColor"/>
    <circle cx="7" cy="17" r="0.5" fill="currentColor"/>
    <circle cx="17" cy="17" r="0.5" fill="currentColor"/>
  </svg>
);

// Видеокарта
export const GpuIcon: React.FC<IconProps> = ({ className = "", size = 24, glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${baseIconStyle} ${glow ? glowStyle : ""} ${className}`}
  >
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="4" y="8" width="16" height="8" rx="1" fill="currentColor" fillOpacity="0.1"/>
    <rect x="6" y="10" width="4" height="4" rx="1" fill="currentColor"/>
    <rect x="14" y="10" width="4" height="4" rx="1" fill="currentColor"/>
    <rect x="10" y="12" width="4" height="2" rx="1" fill="currentColor"/>
    <path d="M22 10H24M22 14H24M0 10H2M0 14H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Оперативная память
export const RamIcon: React.FC<IconProps> = ({ className = "", size = 24, glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${baseIconStyle} ${glow ? glowStyle : ""} ${className}`}
  >
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="5" y="6" width="14" height="12" rx="1" fill="currentColor" fillOpacity="0.1"/>
    <rect x="7" y="8" width="10" height="2" rx="1" fill="currentColor"/>
    <rect x="7" y="11" width="10" height="2" rx="1" fill="currentColor"/>
    <rect x="7" y="14" width="10" height="2" rx="1" fill="currentColor"/>
    <circle cx="8" cy="9" r="0.5" fill="currentColor"/>
    <circle cx="16" cy="9" r="0.5" fill="currentColor"/>
    <circle cx="8" cy="12" r="0.5" fill="currentColor"/>
    <circle cx="16" cy="12" r="0.5" fill="currentColor"/>
    <circle cx="8" cy="15" r="0.5" fill="currentColor"/>
    <circle cx="16" cy="15" r="0.5" fill="currentColor"/>
  </svg>
);

// Накопитель
export const StorageIcon: React.FC<IconProps> = ({ className = "", size = 24, glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${baseIconStyle} ${glow ? glowStyle : ""} ${className}`}
  >
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="4" y="8" width="16" height="8" rx="1" fill="currentColor" fillOpacity="0.1"/>
    <rect x="6" y="10" width="12" height="4" rx="1" fill="currentColor"/>
    <path d="M8 12H16M8 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="11" r="0.5" fill="currentColor"/>
    <circle cx="17" cy="11" r="0.5" fill="currentColor"/>
    <circle cx="7" cy="15" r="0.5" fill="currentColor"/>
    <circle cx="17" cy="15" r="0.5" fill="currentColor"/>
  </svg>
);

// Блок питания
export const PsuIcon: React.FC<IconProps> = ({ className = "", size = 24, glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${baseIconStyle} ${glow ? glowStyle : ""} ${className}`}
  >
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="5" y="6" width="14" height="12" rx="1" fill="currentColor" fillOpacity="0.1"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 9V15M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 8H8M6 16H8M16 8H18M16 16H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 6V8M8 16V18M16 6V8M16 16V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Система охлаждения
export const CoolingIcon: React.FC<IconProps> = ({ className = "", size = 24, glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${baseIconStyle} ${glow ? glowStyle : ""} ${className}`}
  >
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 4V8M12 16V20M4 12H8M16 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6.34 6.34L8.93 8.93M15.07 15.07L17.66 17.66M6.34 17.66L8.93 15.07M15.07 8.93L17.66 6.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

// Корпус
export const CaseIcon: React.FC<IconProps> = ({ className = "", size = 24, glow = true }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${baseIconStyle} ${glow ? glowStyle : ""} ${className}`}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="4" y="6" width="16" height="12" rx="1" fill="currentColor" fillOpacity="0.1"/>
    <rect x="6" y="8" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="8" cy="10" r="1" fill="currentColor"/>
    <circle cx="16" cy="10" r="1" fill="currentColor"/>
    <circle cx="8" cy="14" r="1" fill="currentColor"/>
    <circle cx="16" cy="14" r="1" fill="currentColor"/>
    <path d="M10 12H14M10 16H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Карта категорий для быстрого доступа
export const categoryIcons = {
  1: CpuIcon,
  2: MotherboardIcon,
  3: GpuIcon,
  4: RamIcon,
  5: StorageIcon,
  6: PsuIcon,
  7: CoolingIcon,
  8: CaseIcon
};

// Хук для получения иконки по категории
export const useCategoryIcon = (categoryId: number) => {
  return categoryIcons[categoryId as keyof typeof categoryIcons] || CpuIcon;
};
