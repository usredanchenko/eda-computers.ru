const fs = require('fs');
const path = require('path');

// Создаем директорию для логов если её нет
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Функция для форматирования даты
const formatDate = (date) => {
  return date.toISOString().replace('T', ' ').substr(0, 19);
};

// Функция для записи в лог файл
const writeLog = (level, message, data = {}) => {
  const timestamp = formatDate(new Date());
  const logEntry = {
    timestamp,
    level,
    message,
    ...data
  };

  const logFile = path.join(logsDir, `${level}.log`);
  const logLine = JSON.stringify(logEntry) + '\n';

  fs.appendFileSync(logFile, logLine);
};

// Middleware для логирования HTTP запросов
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip, headers } = req;

  // Логируем входящий запрос
  writeLog('info', 'HTTP Request', {
    method,
    url,
    ip,
    userAgent: headers['user-agent'],
    timestamp: new Date().toISOString()
  });

  // Перехватываем ответ
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    const { statusCode } = res;

    // Логируем ответ
    writeLog('info', 'HTTP Response', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    // Логируем ошибки
    if (statusCode >= 400) {
      writeLog('error', 'HTTP Error', {
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
        error: data,
        timestamp: new Date().toISOString()
      });
    }

    originalSend.call(this, data);
  };

  next();
};

// Middleware для логирования ошибок
const errorLogger = (err, req, res, next) => {
  const { method, url, ip } = req;

  writeLog('error', 'Application Error', {
    method,
    url,
    ip,
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  next(err);
};

// Функции для логирования в разных уровнях
const logger = {
  info: (message, data = {}) => writeLog('info', message, data),
  warn: (message, data = {}) => writeLog('warn', message, data),
  error: (message, data = {}) => writeLog('error', message, data),
  debug: (message, data = {}) => writeLog('debug', message, data)
};

module.exports = {
  requestLogger,
  errorLogger,
  logger
};

