-- Очистка существующих данных
DELETE FROM order_logs;
DELETE FROM order_comments;
DELETE FROM reviews;
DELETE FROM orders;
DELETE FROM user_carts;
DELETE FROM builds;
DELETE FROM users;

-- Сброс последовательностей
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_comments_id_seq RESTART WITH 1;
ALTER SEQUENCE reviews_id_seq RESTART WITH 1;
ALTER SEQUENCE builds_id_seq RESTART WITH 1;
ALTER SEQUENCE user_carts_id_seq RESTART WITH 1;

-- Создание тестовых пользователей
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
-- Администраторы
('admin@eda.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Администратор', 'Системы', 'ADMIN', true),
('manager@eda.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Менеджер', 'Отдела', 'ADMIN', true),

-- Обычные пользователи
('ivan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Иван', 'Петров', 'USER', true),
('maria@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Мария', 'Сидорова', 'USER', true),
('alex@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Алексей', 'Козлов', 'USER', true),
('elena@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Елена', 'Новикова', 'USER', true),
('dmitry@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Дмитрий', 'Волков', 'USER', true),
('anna@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Анна', 'Морозова', 'USER', true),
('sergey@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Сергей', 'Алексеев', 'USER', true),
('olga@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ольга', 'Лебедева', 'USER', true),

-- Заблокированные пользователи
('blocked@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Заблокированный', 'Пользователь', 'USER', false);

-- Заказы пользователей (с учётом актуальной схемы с полями покупателя)
INSERT INTO orders (
  user_id, status, total_price, components,
  customer_name, customer_email, customer_phone, delivery_address, notes, order_type
) VALUES
-- Заказы админа
(1, 'processing', 89999, '[{"id": 1, "name": "Intel Core i7-12700K", "price": 50000, "quantity": 1}, {"id": 2, "name": "NVIDIA RTX 4070", "price": 39999, "quantity": 1}]'::jsonb,
 'Администратор Системы','admin@eda.com','+7 (999) 000-00-01','Москва, ул. Технологическая, 1','', 'auth'),
(1, 'delivered', 129999, '[{"id": 3, "name": "Kingston Fury 32GB DDR4", "price": 10000, "quantity": 2}, {"id": 4, "name": "Samsung 970 EVO Plus 1TB", "price": 109999, "quantity": 1}]'::jsonb,
 'Администратор Системы','admin@eda.com','+7 (999) 000-00-01','Москва, ул. Технологическая, 1','', 'auth'),
(1, 'cancelled', 75000, '[{"id": 5, "name": "MSI B660M", "price": 15000, "quantity": 1}, {"id": 6, "name": "Corsair RM750x", "price": 60000, "quantity": 1}]'::jsonb,
 'Администратор Системы','admin@eda.com','+7 (999) 000-00-01','Москва, ул. Технологическая, 1','', 'auth'),

-- Заказы обычных пользователей
(3, 'created', 45000, '[{"id": 7, "name": "AMD Ryzen 5 5600X", "price": 25000, "quantity": 1}, {"id": 8, "name": "Gigabyte B550", "price": 20000, "quantity": 1}]'::jsonb,
 'Иван Петров','ivan@example.com','+7 (999) 000-00-03','Санкт-Петербург, Невский пр., 10','', 'auth'),
(3, 'processing', 85000, '[{"id": 9, "name": "NVIDIA RTX 3060", "price": 45000, "quantity": 1}, {"id": 10, "name": "Crucial P2 500GB", "price": 40000, "quantity": 1}]'::jsonb,
 'Иван Петров','ivan@example.com','+7 (999) 000-00-03','Санкт-Петербург, Невский пр., 10','', 'auth'),

(4, 'delivered', 120000, '[{"id": 11, "name": "Intel Core i9-12900K", "price": 80000, "quantity": 1}, {"id": 12, "name": "ASUS ROG Strix Z690", "price": 40000, "quantity": 1}]'::jsonb,
 'Мария Сидорова','maria@example.com','+7 (999) 000-00-04','Екатеринбург, ул. Ленина, 5','', 'auth'),
(4, 'processing', 65000, '[{"id": 13, "name": "G.Skill Ripjaws 16GB DDR5", "price": 15000, "quantity": 2}, {"id": 14, "name": "Seagate Barracuda 2TB", "price": 35000, "quantity": 1}]'::jsonb,
 'Мария Сидорова','maria@example.com','+7 (999) 000-00-04','Екатеринбург, ул. Ленина, 5','', 'auth'),

(5, 'created', 95000, '[{"id": 15, "name": "AMD Ryzen 7 5800X", "price": 35000, "quantity": 1}, {"id": 16, "name": "MSI MPG B550", "price": 20000, "quantity": 1}, {"id": 17, "name": "NVIDIA RTX 3070", "price": 40000, "quantity": 1}]'::jsonb,
 'Алексей Козлов','alex@example.com','+7 (999) 000-00-05','Казань, ул. Кремлевская, 3','', 'auth'),

(6, 'delivered', 180000, '[{"id": 18, "name": "Intel Core i9-13900K", "price": 100000, "quantity": 1}, {"id": 19, "name": "NVIDIA RTX 4080", "price": 80000, "quantity": 1}]'::jsonb,
 'Елена Новикова','elena@example.com','+7 (999) 000-00-06','Новосибирск, Красный пр., 20','', 'auth'),

(7, 'processing', 55000, '[{"id": 20, "name": "AMD Ryzen 5 7600X", "price": 30000, "quantity": 1}, {"id": 21, "name": "ASRock B650", "price": 25000, "quantity": 1}]'::jsonb,
 'Дмитрий Волков','dmitry@example.com','+7 (999) 000-00-07','Нижний Новгород, ул. Большая, 7','', 'auth'),

(8, 'created', 75000, '[{"id": 22, "name": "Intel Core i5-13600K", "price": 35000, "quantity": 1}, {"id": 23, "name": "Gigabyte Z690", "price": 40000, "quantity": 1}]'::jsonb,
 'Анна Морозова','anna@example.com','+7 (999) 000-00-08','Самара, Московское ш., 15','', 'auth'),

(9, 'delivered', 140000, '[{"id": 24, "name": "AMD Ryzen 9 7900X", "price": 60000, "quantity": 1}, {"id": 25, "name": "NVIDIA RTX 4070 Ti", "price": 80000, "quantity": 1}]'::jsonb,
 'Сергей Алексеев','sergey@example.com','+7 (999) 000-00-09','Уфа, пр. Октября, 12','', 'auth'),

(10, 'processing', 85000, '[{"id": 26, "name": "Intel Core i7-13700K", "price": 45000, "quantity": 1}, {"id": 27, "name": "MSI MPG Z690", "price": 40000, "quantity": 1}]'::jsonb,
 'Ольга Лебедева','olga@example.com','+7 (999) 000-00-10','Челябинск, ул. Труда, 9','', 'auth');

-- Комментарии к заказам
INSERT INTO order_comments (order_id, user_id, content) VALUES
-- Комментарии админа
(1, 1, 'Когда будет готов заказ?'),
(1, 1, 'Спасибо за быструю обработку!'),
(2, 1, 'Отличный сервис!'),
(3, 1, 'Почему заказ отменен?'),

-- Комментарии обычных пользователей
(4, 3, 'Хотелось бы узнать статус заказа'),
(4, 3, 'Спасибо за информацию'),
(5, 3, 'Когда придет комплект?'),

(6, 4, 'Отличное качество сборки!'),
(6, 4, 'Рекомендую всем'),
(7, 4, 'Есть ли возможность ускорить?'),

(8, 5, 'Вопрос по совместимости компонентов'),
(9, 6, 'Превосходная работа!'),
(10, 7, 'Нужна консультация по настройке'),
(11, 8, 'Когда начнется сборка?'),
(12, 9, 'Отличный выбор комплектующих'),
(13, 10, 'Есть ли гарантия на сборку?');

-- Отзывы пользователей
INSERT INTO reviews (order_id, user_id, customer_name, rating, comment, status) VALUES
-- Отзывы админа
(2, 1, 'Администратор Системы', 5, 'Отличный сервис! Быстрая сборка и качественные компоненты. Рекомендую всем!', 'approved'),

-- Отзывы обычных пользователей
(6, 4, 'Мария Сидорова', 5, 'Превосходная работа! Компьютер работает отлично, сборка качественная.', 'approved'),
(9, 6, 'Елена Новикова', 4, 'Хороший сервис, но можно было бы быстрее. В целом доволен.', 'approved'),
(12, 9, 'Анна Морозова', 5, 'Отличный выбор комплектующих и профессиональная сборка!', 'pending'),

-- Отзывы на модерации
(4, 3, 'Иван Петров', 3, 'Нормально, но есть задержки в обработке заказа.', 'pending'),
(7, 4, 'Мария Сидорова', 4, 'Хороший сервис, но цены немного высокие.', 'pending'),
(10, 7, 'Сергей Алексеев', 5, 'Отличная работа! Все сделано качественно и в срок.', 'pending'),

-- Отклоненные отзывы
(8, 5, 'Алексей Козлов', 1, 'Ужасный сервис! Все плохо!', 'rejected'),
(11, 8, 'Ольга Лебедева', 2, 'Не доволен качеством сборки.', 'rejected');

-- Сборки пользователей (без user_id, так как его нет в схеме)
INSERT INTO builds (name, description, components, total_price) VALUES
('Игровая сборка', 'Мощная игровая система для современных игр', '[{"id": 7, "name": "AMD Ryzen 5 5600X", "price": 25000, "quantity": 1}, {"id": 9, "name": "NVIDIA RTX 3060", "price": 45000, "quantity": 1}]'::jsonb, 70000),
('Рабочая станция', 'Профессиональная система для работы', '[{"id": 11, "name": "Intel Core i9-12900K", "price": 80000, "quantity": 1}, {"id": 13, "name": "G.Skill Ripjaws 16GB DDR5", "price": 15000, "quantity": 2}]'::jsonb, 110000),
('Бюджетная сборка', 'Доступная система для повседневных задач', '[{"id": 15, "name": "AMD Ryzen 7 5800X", "price": 35000, "quantity": 1}, {"id": 20, "name": "AMD Ryzen 5 7600X", "price": 30000, "quantity": 1}]'::jsonb, 65000),
('Топовая сборка', 'Максимальная производительность', '[{"id": 18, "name": "Intel Core i9-13900K", "price": 100000, "quantity": 1}, {"id": 19, "name": "NVIDIA RTX 4080", "price": 80000, "quantity": 1}]'::jsonb, 180000);

-- Корзины пользователей (используем cart_data вместо отдельных компонентов)
INSERT INTO user_carts (user_id, cart_data) VALUES
(3, '[{"id": 7, "name": "AMD Ryzen 5 5600X", "price": 25000, "quantity": 1}, {"id": 8, "name": "Gigabyte B550", "price": 20000, "quantity": 1}]'::jsonb),
(4, '[{"id": 11, "name": "Intel Core i9-12900K", "price": 80000, "quantity": 1}, {"id": 12, "name": "ASUS ROG Strix Z690", "price": 40000, "quantity": 1}]'::jsonb),
(5, '[{"id": 15, "name": "AMD Ryzen 7 5800X", "price": 35000, "quantity": 1}, {"id": 16, "name": "MSI MPG B550", "price": 20000, "quantity": 1}]'::jsonb),
(6, '[{"id": 18, "name": "Intel Core i9-13900K", "price": 100000, "quantity": 1}, {"id": 19, "name": "NVIDIA RTX 4080", "price": 80000, "quantity": 1}]'::jsonb);


