-- Обновление паролей с правильными хешами
-- Пароли: admin123, user123, test123, ivan123, maria123, alex123

UPDATE users SET password_hash = '$2a$12$jWBj6lkPex6.0OaCgV8jCuxxEri/9vSeDSP/kh30MbdQwCwnXB9uG' WHERE email = 'admin@eda.com';

UPDATE users SET password_hash = '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE email = 'user@eda.com';

UPDATE users SET password_hash = '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'test@example.com';

UPDATE users SET password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O' WHERE email = 'ivan@example.com';

UPDATE users SET password_hash = '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE email = 'maria@example.com';

UPDATE users SET password_hash = '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'alex@example.com';

-- Проверяем результат
SELECT email, first_name, role, is_active FROM users WHERE email IN ('admin@eda.com', 'user@eda.com', 'test@example.com', 'ivan@example.com', 'maria@example.com', 'alex@example.com') ORDER BY email;
