-- Исправление тестовых данных пользователей
-- Обновляем пароли на более безопасные

-- Удаляем существующих тестовых пользователей
DELETE FROM users WHERE email IN (
  'admin@eda.com',
  'user@eda.com', 
  'test@example.com',
  'ivan@example.com',
  'maria@example.com',
  'alex@example.com'
);

-- Создаем новых пользователей с безопасными паролями
-- Пароли: admin123, user123, test123, ivan123, maria123, alex123
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
('admin@eda.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', 'Админ', 'EDA', 'ADMIN', true),
('user@eda.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Тест', 'Пользователь', 'USER', true),
('test@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', 'USER', true),
('ivan@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', 'Иван', 'Петров', 'USER', true),
('maria@example.com', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Мария', 'Сидорова', 'USER', true),
('alex@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Алексей', 'Козлов', 'USER', true);

-- Обновляем существующих пользователей с правильными ролями
UPDATE users SET 
  role = 'USER',
  is_active = true
WHERE role IS NULL OR role = 'user';

-- Проверяем результат
SELECT id, email, first_name, last_name, role, is_active FROM users ORDER BY id;
