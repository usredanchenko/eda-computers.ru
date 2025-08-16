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

// Получить все компоненты (с кэшированием на 10 минут)
router.get('/', cache(600), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        c.id,
        c.name,
        c.type,
        c.description,
        c.price,
        c.image_url,
        c.specifications,
        c.stock_quantity,
        c.is_active,
        cat.name as category_name
      FROM components c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.is_active = true
      ORDER BY c.type, c.name`
    );

    res.json({
      success: true,
      data: {
        components: result.rows
      }
    });
  } catch (error) {
    console.error('Get components error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
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
        c.name,
        c.type,
        c.description,
        c.price,
        c.image_url,
        c.specifications,
        c.stock_quantity,
        c.is_active,
        cat.name as category_name
      FROM components c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = $1 AND c.is_active = true`,
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
