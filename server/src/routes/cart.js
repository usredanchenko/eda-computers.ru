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

// Получить корзину пользователя
router.get('/', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT 
        uc.id,
        uc.component_id,
        uc.quantity,
        c.name,
        c.type,
        c.price,
        c.image_url
      FROM user_carts uc
      JOIN components c ON uc.component_id = c.id
      WHERE uc.user_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        cart: result.rows
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Добавить товар в корзину
router.post('/', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { component_id, quantity = 1 } = req.body;

    if (!component_id) {
      return res.status(400).json({ 
        success: false, 
        code: 'MISSING_COMPONENT',
        message: 'ID компонента обязателен' 
      });
    }

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = await pool.query(
      'SELECT id, quantity FROM user_carts WHERE user_id = $1 AND component_id = $2',
      [userId, component_id]
    );

    if (existingItem.rows.length > 0) {
      // Обновляем количество
      const newQuantity = existingItem.rows[0].quantity + quantity;
      await pool.query(
        'UPDATE user_carts SET quantity = $1 WHERE id = $2',
        [newQuantity, existingItem.rows[0].id]
      );
    } else {
      // Добавляем новый товар
      await pool.query(
        'INSERT INTO user_carts (user_id, component_id, quantity) VALUES ($1, $2, $3)',
        [userId, component_id, quantity]
      );
    }

    res.json({
      success: true,
      message: 'Товар добавлен в корзину'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Обновить количество товара в корзине
router.put('/:id', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        code: 'INVALID_QUANTITY',
        message: 'Количество должно быть больше 0' 
      });
    }

    const result = await pool.query(
      'UPDATE user_carts SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING id',
      [quantity, cartItemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'CART_ITEM_NOT_FOUND',
        message: 'Товар в корзине не найден' 
      });
    }

    res.json({
      success: true,
      message: 'Количество обновлено'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Удалить товар из корзины
router.delete('/:id', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    
    const result = await pool.query(
      'DELETE FROM user_carts WHERE id = $1 AND user_id = $2 RETURNING id',
      [cartItemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        code: 'CART_ITEM_NOT_FOUND',
        message: 'Товар в корзине не найден' 
      });
    }

    res.json({
      success: true,
      message: 'Товар удален из корзины'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

// Очистить корзину
router.delete('/', requireAuth, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await pool.query(
      'DELETE FROM user_carts WHERE user_id = $1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Корзина очищена'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false, 
      code: 'SERVER_ERROR',
      message: 'Ошибка сервера' 
    });
  }
});

module.exports = router;
