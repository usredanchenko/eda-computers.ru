const { logger } = require('./logger');

// Middleware для мониторинга производительности
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();
  const startMemory = process.memoryUsage();

  // Перехватываем завершение ответа
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // в миллисекундах
    const endMemory = process.memoryUsage();
    
    const memoryDiff = {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      external: endMemory.external - startMemory.external
    };

    // Логируем медленные запросы (> 1000ms)
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode,
        memoryDiff,
        timestamp: new Date().toISOString()
      });
    }

    // Логируем все запросы для анализа производительности
    logger.info('Request performance', {
      method: req.method,
      url: req.url,
      duration: `${duration.toFixed(2)}ms`,
      statusCode: res.statusCode,
      memoryDiff,
      timestamp: new Date().toISOString()
    });
  });

  next();
};

// Функция для получения статистики производительности
const getPerformanceStats = () => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  return {
    memory: {
      rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memUsage.external / 1024 / 1024).toFixed(2)} MB`
    },
    cpu: {
      user: `${(cpuUsage.user / 1000).toFixed(2)} ms`,
      system: `${(cpuUsage.system / 1000).toFixed(2)} ms`
    },
    uptime: `${(process.uptime() / 3600).toFixed(2)} hours`,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  performanceMonitor,
  getPerformanceStats
};

