const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

// Middleware для кэширования
const cache = (duration = 300) => { // по умолчанию 5 минут
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        const data = JSON.parse(cached);
        return res.json(data);
      }
      
      // Перехватываем res.json для сохранения в кэш
      const originalJson = res.json;
      res.json = function(data) {
        redis.setex(key, duration, JSON.stringify(data));
        originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      // В случае ошибки Redis, пропускаем кэширование
      console.error('Cache error:', error);
      next();
    }
  };
};

// Функция для очистки кэша
const clearCache = async (pattern = '*') => {
  try {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Clear cache error:', error);
  }
};

// Функция для инвалидации кэша по ключу
const invalidateCache = async (key) => {
  try {
    await redis.del(`cache:${key}`);
  } catch (error) {
    console.error('Invalidate cache error:', error);
  }
};

module.exports = {
  cache,
  clearCache,
  invalidateCache
};

