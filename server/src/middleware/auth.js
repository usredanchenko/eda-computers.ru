const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eda_computers',
  user: process.env.DB_USER || 'eda_user',
  password: process.env.DB_PASSWORD || 'eda_password',
});

// Middleware для проверки аутентификации
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        code: 'NO_TOKEN',
        message: 'Требуется авторизация' 
      });
    }

    // Проверяем токен
    const decoded = jwt.verify(token, JWT_SECRET);

    // Получаем данные пользователя
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        code: 'USER_NOT_FOUND',
        message: 'Пользователь не найден' 
      });
    }

    const user = result.rows[0];

    // Проверяем активность пользователя
    if (!user.is_active) {
      return res.status(401).json({ 
        success: false, 
        code: 'ACCOUNT_DISABLED',
        message: 'Аккаунт заблокирован' 
      });
    }

    // Добавляем пользователя в request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      code: 'INVALID_TOKEN',
      message: 'Недействительный токен' 
    });
  }
};

// Middleware для проверки роли ADMIN
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      code: 'NO_USER',
      message: 'Требуется авторизация' 
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      success: false, 
      code: 'INSUFFICIENT_PERMISSIONS',
      message: 'Недостаточно прав доступа' 
    });
  }

  next();
};

// Middleware для проверки роли USER или ADMIN
const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      code: 'NO_USER',
      message: 'Требуется авторизация' 
    });
  }

  if (req.user.role !== 'USER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      success: false, 
      code: 'INSUFFICIENT_PERMISSIONS',
      message: 'Недостаточно прав доступа' 
    });
  }

  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireUser
};
