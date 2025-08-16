const { body, validationResult } = require('express-validator');

// Middleware для обработки ошибок валидации
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Ошибка валидации данных',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Валидация для регистрации (синхронизирована с фронтендом: email, password, name)
const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Некорректный email адрес')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать минимум 6 символов'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Имя должно содержать от 2 до 100 символов'),
  handleValidationErrors
];

// Валидация для входа
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Некорректный email адрес')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Пароль обязателен'),
  handleValidationErrors
];

// Валидация для создания заказа
const validateOrder = [
  body('components')
    .isArray({ min: 1 })
    .withMessage('Заказ должен содержать минимум один компонент'),
  body('components.*.id')
    .isInt({ min: 1 })
    .withMessage('Некорректный ID компонента'),
  body('components.*.quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Количество должно быть от 1 до 10'),
  body('total_price')
    .isFloat({ min: 0 })
    .withMessage('Некорректная сумма заказа'),
  handleValidationErrors
];

// Валидация для комментариев
const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Комментарий должен содержать от 1 до 1000 символов'),
  handleValidationErrors
];

// Валидация для отзывов
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Рейтинг должен быть от 1 до 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Отзыв должен содержать от 10 до 2000 символов'),
  handleValidationErrors
];

// Валидация для создания пользователя (админ)
const validateUserCreation = [
  body('email')
    .isEmail()
    .withMessage('Некорректный email адрес')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать минимум 6 символов'),
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Имя должно содержать от 2 до 50 символов'),
  body('last_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Фамилия должна содержать от 2 до 50 символов'),
  body('role')
    .optional()
    .isIn(['USER', 'ADMIN'])
    .withMessage('Роль должна быть USER или ADMIN'),
  handleValidationErrors
];

// Валидация для обновления пользователя (админ)
const validateUserUpdate = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Некорректный email адрес')
    .normalizeEmail(),
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Имя должно содержать от 2 до 50 символов'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Фамилия должна содержать от 2 до 50 символов'),
  body('role')
    .optional()
    .isIn(['USER', 'ADMIN'])
    .withMessage('Роль должна быть USER или ADMIN'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active должно быть булевым значением'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateOrder,
  validateComment,
  validateReview,
  validateUserCreation,
  validateUserUpdate,
  handleValidationErrors
};

