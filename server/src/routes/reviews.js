const express = require('express');
const { Pool } = require('pg');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eda_computers',
  user: process.env.DB_USER || 'eda_user',
  password: process.env.DB_PASSWORD || 'eda_password',
});

// Получить все отзывы (для админов)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        r.id,
        r.order_id,
        r.user_id,
        r.rating,
        r.comment,
        r.status,
        r.created_at,
        u.first_name,
        u.last_name,
        o.total_price as order_total
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN orders o ON r.order_id = o.id
      ORDER BY r.created_at DESC`
    );

    res.json({
      success: true,
      data: {
        reviews: result.rows.map(review => ({
          ...review,
          user_name: `${review.first_name} ${review.last_name}`.trim()
        }))
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Получить конкретный отзыв
router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    const result = await pool.query(
      `SELECT 
        r.id,
        r.order_id,
        r.user_id,
        r.rating,
        r.comment,
        r.status,
        r.created_at,
        u.first_name,
        u.last_name,
        o.total_price as order_total
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN orders o ON r.order_id = o.id
      WHERE r.id = $1`,
      [reviewId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'REVIEW_NOT_FOUND',
        message: 'Отзыв не найден' 
      });
    }

    const review = result.rows[0];
    res.json({
      success: true,
      data: {
        review: {
          ...review,
          user_name: `${review.first_name} ${review.last_name}`.trim()
        }
      }
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Обновить статус отзыва
router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        code: 'INVALID_STATUS',
        message: 'Некорректный статус' 
      });
    }

    const result = await pool.query(
      'UPDATE reviews SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, reviewId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'REVIEW_NOT_FOUND',
        message: 'Отзыв не найден' 
      });
    }

    res.json({
      success: true,
      message: 'Статус отзыва обновлен',
      data: {
        review: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;
