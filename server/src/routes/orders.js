const express = require('express');
const { Pool } = require('pg');
const { requireAuth, requireUser, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eda_computers',
  user: process.env.DB_USER || 'eda_user',
  password: process.env.DB_PASSWORD || 'eda_password',
});

// Получить все заказы пользователя
router.get('/', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT 
        id,
        status,
        total_price,
        created_at,
        updated_at,
        COALESCE(components, '[]'::jsonb) as components
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        orders: result.rows
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// [ADMIN] Получить все заказы
router.get('/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        user_id,
        status,
        total_price,
        created_at,
        updated_at,
        COALESCE(components, '[]'::jsonb) as components
      FROM orders
      ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: { orders: result.rows }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Получить конкретный заказ пользователя
router.get('/:id', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    const result = await pool.query(
      `SELECT 
        id,
        status,
        total_price,
        created_at,
        updated_at,
        COALESCE(components, '[]'::jsonb) as components
      FROM orders
      WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'ORDER_NOT_FOUND',
        message: 'Заказ не найден' 
      });
    }

    res.json({
      success: true,
      data: {
        order: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Создать новый заказ
router.post('/', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      components,
      total_price,
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      notes = '',
      order_type = 'auth'
    } = req.body || {};

    if (!components || !Array.isArray(components) || components.length === 0) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_COMPONENTS',
        message: 'Список компонентов обязателен'
      });
    }

    if (!total_price || Number(total_price) <= 0) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_PRICE',
        message: 'Некорректная цена'
      });
    }

    if (!customer_name || !customer_email || !customer_phone || !delivery_address) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_CUSTOMER_FIELDS',
        message: 'Имя, email, телефон и адрес доставки обязательны'
      });
    }

    const insertQuery = `
      INSERT INTO orders (
        user_id, status, total_price, components,
        customer_name, customer_email, customer_phone, delivery_address, notes, order_type
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id, user_id, status, total_price, created_at, updated_at,
        COALESCE(components, '[]'::jsonb) as components
    `;

    const result = await pool.query(insertQuery, [
      userId,
      'created',
      total_price,
      JSON.stringify(components),
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      notes,
      order_type
    ]);

    const order = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Заказ успешно создан',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера'
    });
  }
});

// Отменить заказ (только если статус 'created')
router.post('/:id/cancel', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 AND user_id = $3 AND status = $4 RETURNING id',
      ['cancelled', orderId, userId, 'created']
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        code: 'CANCEL_NOT_ALLOWED',
        message: 'Заказ нельзя отменить' 
      });
    }

    res.json({
      success: true,
      message: 'Заказ отменен'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// [ADMIN] Получить все заказы
router.get('/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        user_id,
        status,
        total_price,
        created_at,
        updated_at,
        COALESCE(components, '[]'::jsonb) as components
      FROM orders
      ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: { orders: result.rows }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// [ADMIN] Обновить статус заказа
router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body || {};

    const allowedStatuses = new Set(['created','processing','building','shipping','delivered','completed','cancelled']);
    if (!status || !allowedStatuses.has(status)) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_STATUS',
        message: 'Недопустимый статус заказа'
      });
    }

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, user_id, status, total_price, created_at, updated_at, COALESCE(components, '[]'::jsonb) as components`,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        code: 'ORDER_NOT_FOUND',
        message: 'Заказ не найден'
      });
    }

    res.json({
      success: true,
      data: { order: result.rows[0] }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;
