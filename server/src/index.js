const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const Redis = require('ioredis');
const { requestLogger, errorLogger, logger } = require('./middleware/logger');
const { performanceMonitor, getPerformanceStats } = require('./middleware/performance');

const app = express();

// CORS (allow credentials; allow configured domains including production)
const rawAllowed = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.FRONTEND_URL_ALT || '',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost',
  'https://localhost',
  'https://eda-computers.ru',
  'https://www.eda-computers.ru'
].filter(Boolean);
const allowedOrigins = new Set(rawAllowed);
const allowedHostnames = new Set(
  rawAllowed.map((o) => {
    try { return new URL(o).hostname; } catch { return null; }
  }).filter(Boolean)
);

app.use((req, res, next) => {
  res.header('Vary', 'Origin');
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      if (allowedOrigins.has(origin) || allowedHostnames.has(url.hostname)) {
        return callback(null, true);
      }
    } catch {}
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization']
}));

app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      if (allowedOrigins.has(origin) || allowedHostnames.has(url.hostname)) {
        return callback(null, true);
      }
    } catch {}
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());

// Логирование запросов
app.use(requestLogger);

// Мониторинг производительности
app.use(performanceMonitor);

// Подключение к базе данных
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eda_computers',
  user: process.env.DB_USER || 'eda_user',
  password: process.env.DB_PASSWORD || 'eda_password',
});

// Подключение к Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

// Проверка подключения к базе данных
pool.on('connect', () => {
  logger.info('Database connected successfully', {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'eda_computers'
  });
});

pool.on('error', (err) => {
  logger.error('Database connection error', { error: err.message });
});

// Проверка подключения к Redis
redis.on('connect', () => {
  logger.info('Redis connected successfully', {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  });
});

redis.on('error', (err) => {
  logger.error('Redis connection error', { error: err.message });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Проверяем подключение к базе данных
    await pool.query('SELECT 1');
    
    // Проверяем подключение к Redis
    await redis.ping();
    
    // Получаем статистику производительности
    const perfStats = getPerformanceStats();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected'
      },
      performance: perfStats
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/components', require('./routes/components'));
app.use('/api/builds', require('./routes/builds'));
app.use('/api/cart', require('./routes/cart'));

// 404 handler
app.use('*', (req, res) => {
  logger.warn('Route not found', { 
    method: req.method, 
    url: req.originalUrl,
    ip: req.ip 
  });
  
  res.status(404).json({
    success: false,
    code: 'ROUTE_NOT_FOUND',
    message: 'Маршрут не найден'
  });
});

// Логирование ошибок
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip
  });

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Внутренняя ошибка сервера'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  try {
    await pool.end();
    await redis.quit();
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown', { error: error.message });
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  try {
    await pool.end();
    await redis.quit();
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown', { error: error.message });
    process.exit(1);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
