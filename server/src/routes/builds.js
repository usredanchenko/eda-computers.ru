const express = require('express');
const { Pool } = require('pg');
const { requireAuth, requireUser } = require('../middleware/auth');

const router = express.Router();
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eda_computers',
  user: process.env.DB_USER || 'eda_user',
  password: process.env.DB_PASSWORD || 'eda_password',
});

// Публичный список готовых сборок (витрина) — без авторизации
router.get('/public', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        name,
        description,
        COALESCE(total_price, 0) AS total_price,
        false AS is_featured,
        COALESCE(components, '[]'::jsonb) AS components
      FROM builds
      ORDER BY id ASC`
    );

    res.json({
      success: true,
      data: {
        builds: result.rows
      }
    });
  } catch (error) {
    console.error('Get public builds error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Получить все сборки пользователя
router.get('/', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT 
        id,
        name,
        description,
        components,
        total_price,
        created_at,
        updated_at
      FROM builds
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        builds: result.rows
      }
    });
  } catch (error) {
    console.error('Get builds error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Получить конкретную сборку
router.get('/:id', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const buildId = req.params.id;
    
    const result = await pool.query(
      `SELECT 
        id,
        name,
        description,
        components,
        total_price,
        created_at,
        updated_at
      FROM builds
      WHERE id = $1 AND user_id = $2`,
      [buildId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'BUILD_NOT_FOUND',
        message: 'Сборка не найдена' 
      });
    }

    res.json({
      success: true,
      data: {
        build: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get build error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Создать новую сборку
router.post('/', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, components, total_price } = req.body;

    if (!name || !components || !Array.isArray(components) || components.length === 0) {
      return res.status(400).json({ 
        success: false, 
        code: 'INVALID_DATA',
        message: 'Название и компоненты обязательны' 
      });
    }

    const result = await pool.query(
      'INSERT INTO builds (user_id, name, description, components, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, components, total_price, created_at, updated_at',
      [userId, name, description || '', JSON.stringify(components), total_price || 0]
    );

    const build = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Сборка успешно создана',
      data: {
        build
      }
    });
  } catch (error) {
    console.error('Create build error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;
