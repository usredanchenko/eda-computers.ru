const express = require('express');
const { Pool } = require('pg');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { cache } = require('../middleware/cache');

const router = express.Router();
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eda_computers',
  user: process.env.DB_USER || 'eda_user',
  password: process.env.DB_PASSWORD || 'eda_password',
});

// Получить все компоненты (временно без кэша для диагностики)
router.get('/', async (req, res) => {
  try {
    const text = `SELECT 
      c.id,
      c.category_id,
      c.name,
      c.price,
      c.image_url,
      c.specs,
      c.stock_quantity,
      c.tdp,
      c.fps_fortnite,
      c.fps_gta5,
      c.fps_warzone,
      COALESCE(cat.name, '') as category_name
    FROM components c
    LEFT JOIN categories cat ON c.category_id = cat.id
    ORDER BY c.category_id, c.name`;
    const result = await pool.query(text);

    return res.json({
      success: true,
      data: {
        components: result.rows
      }
    });
  } catch (error) {
    console.error('Get components error:', error.message, error.stack);
    return res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: `Ошибка сервера: ${error.message}` 
    });
  }
});

// Получить компонент по ID (с кэшированием на 5 минут)
router.get('/:id', cache(300), async (req, res) => {
  try {
    const componentId = req.params.id;
    
    const result = await pool.query(
      `SELECT 
        c.id,
        c.category_id,
        c.name,
        c.price,
        c.image_url,
        c.specs,
        c.stock_quantity,
        c.tdp,
        c.fps_fortnite,
        c.fps_gta5,
        c.fps_warzone,
        cat.name as category_name
      FROM components c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = $1`,
      [componentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'COMPONENT_NOT_FOUND',
        message: 'Компонент не найден' 
      });
    }

    res.json({
      success: true,
      data: {
        component: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get component error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;
