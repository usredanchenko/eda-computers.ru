const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { authRateLimit } = require('../middleware/rateLimit');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { logger } = require('../middleware/logger');

const router = express.Router();
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eda_computers',
  user: process.env.DB_USER || 'eda_user',
  password: process.env.DB_PASSWORD || 'eda_password',
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || '';

// Генерация CSRF токена
router.get('/csrf-token', (req, res) => {
  const csrfToken = require('crypto').randomBytes(32).toString('hex');
  res.cookie('csrf_token', csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(process.env.NODE_ENV === 'production' && COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
    maxAge: 24 * 60 * 60 * 1000 // 24 часа
  });
  res.json({ csrfToken });
});

// Валидация CSRF токена
const validateCSRF = (req, res, next) => {
  if (req.method === 'GET') return next();
  
  const csrfToken = req.headers['x-csrf-token'] || req.body.csrfToken;
  const cookieToken = req.cookies?.csrf_token;
  
  if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
    return res.status(403).json({ 
      success: false, 
      message: 'CSRF токен недействителен' 
    });
  }
  
  next();
};

// Регистрация
router.post('/register', authRateLimit, validateRegistration, validateCSRF, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Валидация входных данных
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        code: 'MISSING_FIELDS',
        message: 'Все поля обязательны' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        code: 'WEAK_PASSWORD',
        message: 'Пароль должен содержать минимум 6 символов' 
      });
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ 
        success: false, 
        code: 'INVALID_EMAIL',
        message: 'Неверный формат email' 
      });
    }

    // Проверяем, существует ли пользователь
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        success: false, 
        code: 'USER_EXISTS',
        message: 'Пользователь с таким email уже существует' 
      });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12);

    // Создаем пользователя
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, role, created_at',
      [email, hashedPassword, name, '', 'USER', true]
    );

    const user = result.rows[0];

    // Генерируем JWT токен
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Устанавливаем httpOnly cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      path: '/'
      , ...(process.env.NODE_ENV === 'production' && COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {})
    });

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.first_name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Вход
router.post('/login', authRateLimit, validateLogin, validateCSRF, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация входных данных
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Email и пароль обязательны' 
      });
    }

    console.log('Attempting login for email:', email);

    // Находим пользователя
    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, role, is_active FROM users WHERE email = $1',
      [email]
    );

    console.log('Database query completed, rows found:', result.rows.length);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Неверный email или пароль' 
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

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Неверный email или пароль' 
      });
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', user.email, 'role:', user.role);

    // Устанавливаем httpOnly cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      path: '/'
    });

    res.json({
      success: true,
      message: 'Успешный вход',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.first_name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Проверка токена
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        code: 'NO_TOKEN',
        message: 'Токен не предоставлен' 
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

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.first_name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      success: false, 
      code: 'INVALID_TOKEN',
      message: 'Недействительный токен' 
    });
  }
});

// Выход
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(process.env.NODE_ENV === 'production' && COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {})
  });
  
  res.json({ 
    success: true,
    message: 'Успешный выход' 
  });
});

module.exports = router; 