// Типы для тестов
export interface TestResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: Record<string, any>;
  error?: any;
}

export interface TestResults {
  auth?: TestResult;
  notifications?: TestResult;
  performance?: TestResult;
  localStorage?: TestResult;
  browser?: TestResult;
}

// Утилиты для проверки окружения
export const isClient = typeof window !== 'undefined';

export const getBrowserInfo = (): Record<string, any> => {
  if (!isClient) return {};
  
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    online: navigator.onLine,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  };
};

export const getPerformanceInfo = (): Record<string, any> => {
  if (!isClient) return {};
  
  try {
    const timing = performance.timing;
    return {
      loadTime: timing ? Math.round(timing.loadEventEnd - timing.navigationStart) : 'N/A',
      memoryUsage: 'N/A',
    };
  } catch {
    return {
      loadTime: 'N/A',
      memoryUsage: 'N/A',
    };
  }
};

export const getTestName = (testName: string) => {
  const names: Record<string, string> = {
    auth: 'Авторизация',
    notifications: 'Уведомления',
    performance: 'Производительность',
    localStorage: 'Локальное хранилище',
    browser: 'Браузер'
  };
  return names[testName] || testName;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-green-400';
    case 'error': return 'text-red-400';
    case 'warning': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    default: return '❓';
  }
};


