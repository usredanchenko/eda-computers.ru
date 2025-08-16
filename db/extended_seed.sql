-- Дополнительные тестовые данные для EDA Computers
-- Этот файл добавляет больше данных к существующим

-- Дополнительные пользователи
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('test1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Тест', 'Пользователь1', 'USER'),
('test2@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Тест', 'Пользователь2', 'USER'),
('test3@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Тест', 'Пользователь3', 'USER'),
('moderator@eda.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Модератор', 'EDA', 'ADMIN');

-- Дополнительные компоненты (корпуса)
INSERT INTO components (name, category_id, price, specs, stock_quantity, image_url, tdp, fps_fortnite, fps_gta5, fps_warzone) VALUES
-- Корпуса
('NZXT H510 Elite', 7, 8999.00, '{"form_factor": "ATX", "fans": 2, "rgb": true}', 15, 'https://picsum.photos/300/200?random=33', 0, 0, 0, 0),
('Corsair 4000D Airflow', 7, 7999.00, '{"form_factor": "ATX", "fans": 2, "rgb": false}', 20, 'https://picsum.photos/300/200?random=34', 0, 0, 0, 0),
('Lian Li O11 Dynamic', 7, 12999.00, '{"form_factor": "ATX", "fans": 3, "rgb": true}', 10, 'https://picsum.photos/300/200?random=35', 0, 0, 0, 0),
('Fractal Design Meshify C', 7, 6999.00, '{"form_factor": "ATX", "fans": 2, "rgb": false}', 18, 'https://picsum.photos/300/200?random=36', 0, 0, 0, 0),
('Phanteks P400A', 7, 5999.00, '{"form_factor": "ATX", "fans": 2, "rgb": true}', 25, 'https://picsum.photos/300/200?random=37', 0, 0, 0, 0);

-- Дополнительные процессоры
INSERT INTO components (name, category_id, price, specs, stock_quantity, image_url, tdp, fps_fortnite, fps_gta5, fps_warzone) VALUES
('Intel Core i3-14100', 1, 12999.00, '{"socket": "LGA1700", "tdp": 60, "cores": 4, "threads": 8}', 35, 'https://picsum.photos/300/200?random=38', 60, 120, 80, 100),
('AMD Ryzen 5 5500', 1, 9999.00, '{"socket": "AM4", "tdp": 65, "cores": 6, "threads": 12}', 40, 'https://picsum.photos/300/200?random=39', 65, 130, 90, 110),
('Intel Core i9-13900K', 1, 49999.00, '{"socket": "LGA1700", "tdp": 253, "cores": 24, "threads": 32}', 12, 'https://picsum.photos/300/200?random=40', 253, 190, 140, 170),
('AMD Ryzen 9 7900X', 1, 44999.00, '{"socket": "AM5", "tdp": 170, "cores": 12, "threads": 24}', 10, 'https://picsum.photos/300/200?random=41', 170, 180, 130, 160);

-- Дополнительные видеокарты
INSERT INTO components (name, category_id, price, specs, stock_quantity, image_url, tdp, fps_fortnite, fps_gta5, fps_warzone) VALUES
('NVIDIA RTX 4060 Ti', 2, 29999.00, '{"length_mm": 242, "tdp": 160, "memory": "8GB"}', 25, 'https://picsum.photos/300/200?random=42', 160, 180, 130, 160),
('AMD RX 7600', 2, 24999.00, '{"length_mm": 204, "tdp": 165, "memory": "8GB"}', 30, 'https://picsum.photos/300/200?random=43', 165, 170, 120, 150),
('NVIDIA RTX 4060', 2, 19999.00, '{"length_mm": 242, "tdp": 115, "memory": "8GB"}', 35, 'https://picsum.photos/300/200?random=44', 115, 160, 110, 140),
('AMD RX 6750 XT', 2, 29999.00, '{"length_mm": 267, "tdp": 250, "memory": "12GB"}', 12, 'https://picsum.photos/300/200?random=45', 250, 190, 140, 170);

-- Дополнительные заказы
INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, components, total_price, status, created_at, updated_at) VALUES
(6, 'Тест Пользователь1', 'test1@example.com', '+7 (999) 456-78-90', '[{"id": 38, "name": "Intel Core i3-14100", "price": 12999}, {"id": 42, "name": "NVIDIA RTX 4060 Ti", "price": 29999}, {"id": 15, "name": "Kingston Fury Beast DDR4-3600 32GB", "price": 5999}]', 48997, 'pending', '2024-02-15 09:30:00', '2024-02-15 09:30:00'),
(7, 'Тест Пользователь2', 'test2@example.com', '+7 (999) 567-89-01', '[{"id": 39, "name": "AMD Ryzen 5 5500", "price": 9999}, {"id": 43, "name": "AMD RX 7600", "price": 24999}, {"id": 14, "name": "G.Skill Trident Z5 DDR5-5600 16GB", "price": 6999}]', 41997, 'paid', '2024-02-16 10:15:00', '2024-02-16 10:15:00'),
(8, 'Тест Пользователь3', 'test3@example.com', '+7 (999) 678-90-12', '[{"id": 40, "name": "Intel Core i9-13900K", "price": 49999}, {"id": 44, "name": "NVIDIA RTX 4060", "price": 19999}, {"id": 13, "name": "Corsair Dominator Platinum DDR5-6000 32GB", "price": 12999}]', 82997, 'building', '2024-02-17 11:45:00', '2024-02-17 11:45:00');

-- Дополнительные отзывы
INSERT INTO reviews (user_id, order_id, customer_name, rating, comment, status, order_total, components) VALUES
(6, 6, 'Тест Пользователь1', 4, 'Хорошая сборка для начального уровня. Все работает стабильно.', 'pending', 48997, '[{"id": 38, "name": "Intel Core i3-14100"}, {"id": 42, "name": "NVIDIA RTX 4060 Ti"}]'),
(7, 7, 'Тест Пользователь2', 5, 'Отличное соотношение цена/качество. Рекомендую!', 'approved', 41997, '[{"id": 39, "name": "AMD Ryzen 5 5500"}, {"id": 43, "name": "AMD RX 7600"}]'),
(8, 8, 'Тест Пользователь3', 3, 'Нормально, но ожидал большего за такие деньги.', 'pending', 82997, '[{"id": 40, "name": "Intel Core i9-13900K"}, {"id": 44, "name": "NVIDIA RTX 4060"}]');

-- Дополнительные комментарии к заказам
INSERT INTO order_comments (order_id, user_id, content, is_admin_comment) VALUES
(6, 6, 'Когда будет готов заказ?', false),
(6, 9, 'Заказ будет готов через 1-2 дня.', true),
(7, 7, 'Можно ли добавить еще один компонент?', false),
(7, 9, 'Конечно! Какой компонент хотите добавить?', true),
(8, 8, 'Статус заказа?', false),
(8, 9, 'Заказ в сборке, будет готов завтра.', true);

-- Дополнительные корзины пользователей
INSERT INTO user_carts (user_id, cart_data) VALUES
(6, '[{"id": 38, "name": "Intel Core i3-14100", "price": 12999, "quantity": 1}, {"id": 33, "name": "NZXT H510 Elite", "price": 8999, "quantity": 1}]'),
(7, '[{"id": 39, "name": "AMD Ryzen 5 5500", "price": 9999, "quantity": 1}, {"id": 34, "name": "Corsair 4000D Airflow", "price": 7999, "quantity": 1}]'),
(8, '[{"id": 40, "name": "Intel Core i9-13900K", "price": 49999, "quantity": 1}, {"id": 35, "name": "Lian Li O11 Dynamic", "price": 12999, "quantity": 1}]');

-- Дополнительные готовые сборки
INSERT INTO builds (name, description, total_price, components, performance_level) VALUES
('Entry Level Gaming', 'Бюджетная игровая сборка', 79999.00, '[38, 42, 15, 20, 25, 30]', 'low'),
('Mid Range Gaming', 'Средняя игровая сборка', 129999.00, '[39, 43, 14, 19, 24, 29]', 'medium'),
('High End Gaming', 'Высокопроизводительная игровая сборка', 199999.00, '[40, 44, 13, 18, 23, 28]', 'high'),
('Streaming Setup', 'Сборка для стриминга', 159999.00, '[1, 9, 13, 18, 23, 30]', 'high'),
('Workstation', 'Рабочая станция', 179999.00, '[2, 8, 13, 19, 24, 31]', 'high');

-- Дополнительная история изменений заказов
INSERT INTO order_logs (order_id, status_from, status_to, changed_by, comment) VALUES
(6, 'created', 'pending', 'Система', 'Заказ создан'),
(7, 'created', 'pending', 'Система', 'Заказ создан'),
(7, 'pending', 'paid', 'Тест Пользователь2', 'Оплата получена'),
(8, 'created', 'pending', 'Система', 'Заказ создан'),
(8, 'pending', 'paid', 'Тест Пользователь3', 'Оплата получена'),
(8, 'paid', 'building', 'Администратор', 'Заказ принят в работу');
