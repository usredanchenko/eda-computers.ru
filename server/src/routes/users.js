const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eda_computers',
  user: process.env.DB_USER || 'eda_user',
  password: process.env.DB_PASSWORD || 'eda_password',
});

// Получить всех пользователей (для админов)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        email,
        first_name,
        last_name,
        role,
        is_active,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: {
        users: result.rows
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Получить конкретного пользователя (для админов)
router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const result = await pool.query(
      `SELECT 
        id,
        email,
        first_name,
        last_name,
        role,
        is_active,
        created_at,
        updated_at
      FROM users
      WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'USER_NOT_FOUND',
        message: 'Пользователь не найден' 
      });
    }

    res.json({
      success: true,
      data: {
        user: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Создать нового пользователя (для админов)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { email, password, first_name, last_name, role = 'USER' } = req.body;

    // Валидация
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ 
        success: false, 
        code: 'MISSING_FIELDS',
        message: 'Все поля обязательны' 
      });
    }

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        code: 'INVALID_ROLE',
        message: 'Некорректная роль' 
      });
    }

    // Проверяем, существует ли пользователь
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        code: 'USER_EXISTS',
        message: 'Пользователь с таким email уже существует' 
      });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, email, first_name, last_name, role, is_active, created_at`,
      [email, hashedPassword, first_name, last_name, role]
    );

    const user = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно создан',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          is_active: user.is_active,
          created_at: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Обновить пользователя (для админов)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, first_name, last_name, role, is_active } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'USER_NOT_FOUND',
        message: 'Пользователь не найден' 
      });
    }

    // Валидация роли
    if (role && !['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        code: 'INVALID_ROLE',
        message: 'Некорректная роль' 
      });
    }

    // Проверяем email на уникальность
    if (email) {
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ 
          success: false, 
          code: 'EMAIL_EXISTS',
          message: 'Пользователь с таким email уже существует' 
        });
      }
    }

    // Обновляем пользователя
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    if (email) {
      paramCount++;
      updateFields.push(`email = $${paramCount}`);
      values.push(email);
    }

    if (first_name) {
      paramCount++;
      updateFields.push(`first_name = $${paramCount}`);
      values.push(first_name);
    }

    if (last_name) {
      paramCount++;
      updateFields.push(`last_name = $${paramCount}`);
      values.push(last_name);
    }

    if (role) {
      paramCount++;
      updateFields.push(`role = $${paramCount}`);
      values.push(role);
    }

    if (typeof is_active === 'boolean') {
      paramCount++;
      updateFields.push(`is_active = $${paramCount}`);
      values.push(is_active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        success: false, 
        code: 'NO_FIELDS_TO_UPDATE',
        message: 'Нет полей для обновления' 
      });
    }

    paramCount++;
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const result = await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING id, email, first_name, last_name, role, is_active, created_at, updated_at`,
      values
    );

    const user = result.rows[0];

    res.json({
      success: true,
      message: 'Пользователь успешно обновлен',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Получить статистику пользователей (для админов)
router.get('/stats/overview', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Общее количество пользователей
    const totalUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    
    // Активные пользователи
    const activeUsers = await pool.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    
    // Пользователи по ролям
    const usersByRole = await pool.query(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );
    
    // Новые пользователи за последние 30 дней
    const newUsers = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL \'30 days\''
    );

    res.json({
      success: true,
      data: {
        total: parseInt(totalUsers.rows[0].count),
        active: parseInt(activeUsers.rows[0].count),
        byRole: usersByRole.rows.reduce((acc, row) => {
          acc[row.role] = parseInt(row.count);
          return acc;
        }, {}),
        newLast30Days: parseInt(newUsers.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;
