const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

// Rate limiting middleware
const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 минут
    max = 100, // максимум 100 запросов
    message = 'Слишком много запросов, попробуйте позже',
    keyGenerator = (req) => req.ip, // ключ по IP
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return async (req, res, next) => {
    const key = `rate_limit:${keyGenerator(req)}`;
    
    try {
      const current = await redis.get(key);
      const requests = current ? parseInt(current) : 0;

      if (requests >= max) {
        return res.status(429).json({
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      // Увеличиваем счетчик
      await redis.multi()
        .incr(key)
        .expire(key, Math.ceil(windowMs / 1000))
        .exec();

      // Добавляем заголовки
      res.set({
        'X-RateLimit-Limit': max,
        'X-RateLimit-Remaining': Math.max(0, max - requests - 1),
        'X-RateLimit-Reset': Math.ceil(Date.now() / 1000) + Math.ceil(windowMs / 1000)
      });

      next();
    } catch (error) {
      // В случае ошибки Redis, пропускаем rate limiting
      console.error('Rate limiting error:', error);
      next();
    }
  };
};

// Специальные лимиты для разных эндпоинтов
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // 5 попыток входа
  message: 'Слишком много попыток входа, попробуйте позже',
  keyGenerator: (req) => `auth:${req.ip}`
});

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 1000, // 1000 запросов к API
  message: 'Превышен лимит запросов к API'
});

const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 10, // 10 запросов в минуту
  message: 'Слишком много запросов, подождите минуту'
});

module.exports = {
  rateLimit,
  authRateLimit,
  apiRateLimit,
  strictRateLimit
};

