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

// Получить комментарии пользователя
router.get('/user', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT 
        oc.id,
        oc.order_id,
        oc.content as message,
        oc.created_at,
        o.status as order_status,
        o.total_price as order_total
      FROM order_comments oc
      JOIN orders o ON oc.order_id = o.id
      WHERE oc.user_id = $1
      ORDER BY oc.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        comments: result.rows
      }
    });
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Получить комментарии к конкретному заказу
router.get('/order/:orderId', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;
    
    // Проверяем, что заказ принадлежит пользователю
    const orderCheck = await pool.query(
      'SELECT id FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, userId]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'ORDER_NOT_FOUND',
        message: 'Заказ не найден' 
      });
    }
    
    const result = await pool.query(
      `SELECT 
        oc.id,
        oc.user_id,
        oc.content as message,
        oc.created_at,
        u.first_name,
        u.last_name
      FROM order_comments oc
      JOIN users u ON oc.user_id = u.id
      WHERE oc.order_id = $1
      ORDER BY oc.created_at ASC`,
      [orderId]
    );

    res.json({
      success: true,
      data: {
        comments: result.rows.map(comment => ({
          ...comment,
          user_name: `${comment.first_name} ${comment.last_name}`.trim()
        }))
      }
    });
  } catch (error) {
    console.error('Get order comments error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Создать комментарий к заказу
router.post('/', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_id, message } = req.body;

    if (!order_id || !message) {
      return res.status(400).json({ 
        success: false, 
        code: 'MISSING_FIELDS',
        message: 'ID заказа и сообщение обязательны' 
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        code: 'EMPTY_MESSAGE',
        message: 'Сообщение не может быть пустым' 
      });
    }

    // Проверяем, что заказ принадлежит пользователю
    const orderCheck = await pool.query(
      'SELECT id FROM orders WHERE id = $1 AND user_id = $2',
      [order_id, userId]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'ORDER_NOT_FOUND',
        message: 'Заказ не найден' 
      });
    }

    // Создаем комментарий
    const result = await pool.query(
      'INSERT INTO order_comments (order_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, order_id, content as message, created_at',
      [order_id, userId, message.trim()]
    );

    const comment = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Комментарий добавлен',
      data: {
        comment: {
          ...comment,
          user_name: req.user.first_name
        }
      }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Удалить комментарий (только свой)
router.delete('/:id', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;
    
    const result = await pool.query(
      'DELETE FROM order_comments WHERE id = $1 AND user_id = $2 RETURNING id',
      [commentId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'COMMENT_NOT_FOUND',
        message: 'Комментарий не найден' 
      });
    }

    res.json({
      success: true,
      message: 'Комментарий удален'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;
