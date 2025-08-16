-- Чистые тестовые данные для EDA Computers
-- Пароль для всех пользователей: 123456

-- Очистка существующих данных
TRUNCATE TABLE order_comments, order_logs, reviews, orders, user_carts, user_sessions, components, builds, categories, users RESTART IDENTITY CASCADE;

-- Пользователи
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@eda.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Администратор', 'EDA', 'ADMIN'),
('user@eda.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Тест', 'Пользователь', 'USER'),
('ivan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Иван', 'Петров', 'USER'),
('maria@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Мария', 'Сидорова', 'USER'),
('alex@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Алексей', 'Козлов', 'USER');

-- Категории компонентов
INSERT INTO categories (name, description, icon, sort_order) VALUES
('Процессоры', 'Центральные процессоры Intel и AMD', 'cpu', 1),
('Видеокарты', 'Графические карты NVIDIA и AMD', 'gpu', 2),
('Оперативная память', 'Модули памяти DDR4 и DDR5', 'ram', 3),
('Материнские платы', 'Основные платы для сборки', 'motherboard', 4),
('Накопители', 'SSD и HDD накопители', 'storage', 5),
('Блоки питания', 'Источники питания', 'psu', 6),
('Корпуса', 'Корпуса для компьютеров', 'case', 7);

-- Компоненты
INSERT INTO components (name, category_id, price, specs, stock_quantity, image_url, tdp, fps_fortnite, fps_gta5, fps_warzone) VALUES
-- Процессоры
('Intel Core i9-14900K', 1, 59999.00, '{"socket": "LGA1700", "tdp": 253, "cores": 24, "threads": 32}', 10, 'https://picsum.photos/300/200?random=1', 253, 200, 150, 180),
('AMD Ryzen 9 7950X', 1, 54999.00, '{"socket": "AM5", "tdp": 170, "cores": 16, "threads": 32}', 8, 'https://picsum.photos/300/200?random=2', 170, 190, 140, 170),
('Intel Core i7-14700K', 1, 39999.00, '{"socket": "LGA1700", "tdp": 253, "cores": 20, "threads": 28}', 15, 'https://picsum.photos/300/200?random=3', 253, 180, 130, 160),
('AMD Ryzen 7 7700X', 1, 29999.00, '{"socket": "AM5", "tdp": 105, "cores": 8, "threads": 16}', 20, 'https://picsum.photos/300/200?random=4', 105, 170, 120, 150),
('Intel Core i5-14600K', 1, 24999.00, '{"socket": "LGA1700", "tdp": 181, "cores": 14, "threads": 20}', 25, 'https://picsum.photos/300/200?random=5', 181, 160, 110, 140),
('AMD Ryzen 5 7600X', 1, 19999.00, '{"socket": "AM5", "tdp": 105, "cores": 6, "threads": 12}', 30, 'https://picsum.photos/300/200?random=6', 105, 150, 100, 130),

-- Видеокарты
('NVIDIA RTX 4090 Founders Edition', 2, 199999.00, '{"length_mm": 304, "tdp": 450, "memory": "24GB"}', 3, 'https://picsum.photos/300/200?random=7', 450, 300, 200, 250),
('AMD RX 7900 XTX', 2, 89999.00, '{"length_mm": 287, "tdp": 355, "memory": "24GB"}', 6, 'https://picsum.photos/300/200?random=8', 355, 280, 180, 230),
('NVIDIA RTX 4080 Super', 2, 79999.00, '{"length_mm": 304, "tdp": 320, "memory": "16GB"}', 8, 'https://picsum.photos/300/200?random=9', 320, 260, 170, 220),
('AMD RX 7900 XT', 2, 69999.00, '{"length_mm": 287, "tdp": 315, "memory": "20GB"}', 10, 'https://picsum.photos/300/200?random=10', 315, 250, 160, 210),
('NVIDIA RTX 4070 Ti Super', 2, 59999.00, '{"length_mm": 285, "tdp": 285, "memory": "16GB"}', 12, 'https://picsum.photos/300/200?random=11', 285, 240, 150, 200),
('AMD RX 7800 XT', 2, 49999.00, '{"length_mm": 267, "tdp": 263, "memory": "16GB"}', 15, 'https://picsum.photos/300/200?random=12', 263, 220, 140, 190),

-- Оперативная память
('Corsair Dominator Platinum DDR5-6000 32GB', 3, 12999.00, '{"type": "DDR5", "size_gb": 32, "speed": 6000}', 20, 'https://picsum.photos/300/200?random=13', 0, 0, 0, 0),
('G.Skill Trident Z5 DDR5-5600 16GB', 3, 6999.00, '{"type": "DDR5", "size_gb": 16, "speed": 5600}', 25, 'https://picsum.photos/300/200?random=14', 0, 0, 0, 0),
('Kingston Fury Beast DDR4-3600 32GB', 3, 5999.00, '{"type": "DDR4", "size_gb": 32, "speed": 3600}', 30, 'https://picsum.photos/300/200?random=15', 0, 0, 0, 0),
('Crucial Ballistix DDR5-5200 32GB', 3, 8999.00, '{"type": "DDR5", "size_gb": 32, "speed": 5200}', 18, 'https://picsum.photos/300/200?random=16', 0, 0, 0, 0),
('TeamGroup T-Force Delta DDR5-6000 16GB', 3, 7999.00, '{"type": "DDR5", "size_gb": 16, "speed": 6000}', 22, 'https://picsum.photos/300/200?random=17', 0, 0, 0, 0),

-- Материнские платы
('ASUS ROG Maximus Z790 Hero', 4, 29999.00, '{"socket": "LGA1700", "ram_type": "DDR5", "form_factor": "ATX"}', 5, 'https://picsum.photos/300/200?random=18', 0, 0, 0, 0),
('MSI MPG B650 Carbon WiFi', 4, 19999.00, '{"socket": "AM5", "ram_type": "DDR5", "form_factor": "ATX"}', 7, 'https://picsum.photos/300/200?random=19', 0, 0, 0, 0),
('Gigabyte B760 Aorus Elite', 4, 15999.00, '{"socket": "LGA1700", "ram_type": "DDR4", "form_factor": "ATX"}', 12, 'https://picsum.photos/300/200?random=20', 0, 0, 0, 0),
('ASUS TUF Gaming B650-Plus', 4, 14999.00, '{"socket": "AM5", "ram_type": "DDR5", "form_factor": "ATX"}', 10, 'https://picsum.photos/300/200?random=21', 0, 0, 0, 0),
('MSI PRO Z790-P WiFi', 4, 18999.00, '{"socket": "LGA1700", "ram_type": "DDR5", "form_factor": "ATX"}', 8, 'https://picsum.photos/300/200?random=22', 0, 0, 0, 0),

-- Накопители
('Samsung 990 PRO 2TB NVMe', 5, 12999.00, '{"type": "NVMe", "capacity": "2TB", "speed": "7450MB/s"}', 15, 'https://picsum.photos/300/200?random=23', 0, 0, 0, 0),
('WD Black SN850X 1TB NVMe', 5, 7999.00, '{"type": "NVMe", "capacity": "1TB", "speed": "7300MB/s"}', 18, 'https://picsum.photos/300/200?random=24', 0, 0, 0, 0),
('Seagate Barracuda 2TB HDD', 5, 2999.00, '{"type": "HDD", "capacity": "2TB", "speed": "190MB/s"}', 40, 'https://picsum.photos/300/200?random=25', 0, 0, 0, 0),
('Crucial P5 Plus 2TB NVMe', 5, 11999.00, '{"type": "NVMe", "capacity": "2TB", "speed": "6600MB/s"}', 12, 'https://picsum.photos/300/200?random=26', 0, 0, 0, 0),
('Kingston KC3000 1TB NVMe', 5, 6999.00, '{"type": "NVMe", "capacity": "1TB", "speed": "7000MB/s"}', 20, 'https://picsum.photos/300/200?random=27', 0, 0, 0, 0),

-- Блоки питания
('Corsair AX1600i 1600W', 6, 29999.00, '{"power_watt": 1600, "efficiency": "80+ Titanium", "modular": "Full"}', 5, 'https://picsum.photos/300/200?random=28', 0, 0, 0, 0),
('Seasonic PRIME TX-1300 1300W', 6, 24999.00, '{"power_watt": 1300, "efficiency": "80+ Titanium", "modular": "Full"}', 7, 'https://picsum.photos/300/200?random=29', 0, 0, 0, 0),
('EVGA SuperNOVA 850 G6 850W', 6, 12999.00, '{"power_watt": 850, "efficiency": "80+ Gold", "modular": "Full"}', 12, 'https://picsum.photos/300/200?random=30', 0, 0, 0, 0),
('be quiet! Dark Power Pro 12 1200W', 6, 27999.00, '{"power_watt": 1200, "efficiency": "80+ Titanium", "modular": "Full"}', 6, 'https://picsum.photos/300/200?random=31', 0, 0, 0, 0),
('Corsair RM850x 850W', 6, 11999.00, '{"power_watt": 850, "efficiency": "80+ Gold", "modular": "Full"}', 15, 'https://picsum.photos/300/200?random=32', 0, 0, 0, 0);

-- Готовые сборки
INSERT INTO builds (name, description, total_price, components, performance_level) VALUES
('Gaming Beast RTX 4090', 'Максимальная производительность для 4K игр', 399999.00, '[1, 7, 13, 18, 23, 28]', 'high'),
('Streamer Pro RTX 4080', 'Идеально для стриминга и игр', 299999.00, '[3, 9, 14, 19, 24, 30]', 'high'),
('Creator Workstation', 'Для работы с видео и 3D', 249999.00, '[2, 8, 13, 20, 25, 31]', 'high'),
('Budget Gaming', 'Отличная производительность за разумные деньги', 99999.00, '[5, 11, 15, 21, 26, 32]', 'medium'),
('Office PC', 'Для работы и учебы', 49999.00, '[6, 12, 16, 22, 27, 29]', 'medium');

-- Заказы
INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, components, total_price, status, created_at, updated_at) VALUES
(3, 'Иван Петров', 'ivan@example.com', '+7 (999) 123-45-67', '[{"id": 1, "name": "Intel Core i9-14900K", "price": 59999}, {"id": 7, "name": "NVIDIA RTX 4090 Founders Edition", "price": 199999}, {"id": 13, "name": "Corsair Dominator Platinum DDR5-6000 32GB", "price": 12999}]', 272997, 'delivered', '2024-01-15 10:30:00', '2024-01-20 14:15:00'),
(3, 'Иван Петров', 'ivan@example.com', '+7 (999) 123-45-67', '[{"id": 2, "name": "AMD Ryzen 9 7950X", "price": 54999}, {"id": 8, "name": "AMD RX 7900 XTX", "price": 89999}, {"id": 14, "name": "G.Skill Trident Z5 DDR5-5600 16GB", "price": 6999}]', 151997, 'shipping', '2024-02-01 09:15:00', '2024-02-05 16:30:00'),
(3, 'Иван Петров', 'ivan@example.com', '+7 (999) 123-45-67', '[{"id": 3, "name": "Intel Core i7-14700K", "price": 39999}, {"id": 9, "name": "NVIDIA RTX 4080 Super", "price": 79999}, {"id": 15, "name": "Kingston Fury Beast DDR4-3600 32GB", "price": 5999}]', 125997, 'building', '2024-02-10 11:45:00', '2024-02-10 11:45:00'),
(4, 'Мария Сидорова', 'maria@example.com', '+7 (999) 234-56-78', '[{"id": 2, "name": "AMD Ryzen 9 7950X", "price": 54999}, {"id": 7, "name": "NVIDIA RTX 4090 Founders Edition", "price": 199999}, {"id": 13, "name": "Corsair Dominator Platinum DDR5-6000 32GB", "price": 12999}]', 267997, 'delivered', '2024-01-20 12:00:00', '2024-01-25 15:30:00'),
(5, 'Алексей Козлов', 'alex@example.com', '+7 (999) 345-67-89', '[{"id": 1, "name": "Intel Core i9-14900K", "price": 59999}, {"id": 8, "name": "AMD RX 7900 XTX", "price": 89999}, {"id": 14, "name": "G.Skill Trident Z5 DDR5-5600 16GB", "price": 6999}]', 156997, 'delivered', '2024-01-25 14:20:00', '2024-01-30 11:45:00');

-- Отзывы
INSERT INTO reviews (user_id, order_id, customer_name, rating, comment, status, order_total, components) VALUES
(3, 1, 'Иван Петров', 5, 'Отличный сервис! ПК собран качественно, все работает как часы. Доставка быстрая, менеджер был на связи на всех этапах.', 'approved', 272997, '[{"id": 1, "name": "Intel Core i9-14900K"}, {"id": 7, "name": "NVIDIA RTX 4090 Founders Edition"}]'),
(4, 4, 'Мария Сидорова', 4, 'Хорошая сборка, но немного задержалась доставка. В целом доволен качеством.', 'approved', 267997, '[{"id": 2, "name": "AMD Ryzen 9 7950X"}, {"id": 7, "name": "NVIDIA RTX 4090 Founders Edition"}]'),
(5, 5, 'Алексей Козлов', 5, 'Профессиональная сборка, все компоненты совместимы. Рекомендую!', 'approved', 156997, '[{"id": 1, "name": "Intel Core i9-14900K"}, {"id": 8, "name": "AMD RX 7900 XTX"}]');

-- Комментарии к заказам
INSERT INTO order_comments (order_id, user_id, content, is_admin_comment) VALUES
(1, 3, 'Когда будет готов мой заказ?', false),
(1, 1, 'Ваш заказ в сборке, будет готов через 2-3 дня.', true),
(1, 3, 'Спасибо за информацию!', false),
(2, 3, 'Можно ли изменить адрес доставки?', false),
(2, 1, 'Конечно! Напишите новый адрес.', true),
(3, 3, 'Какой статус моего заказа?', false),
(3, 1, 'Заказ отправлен, трек-номер: TRK123456789', true);

-- История изменений заказов
INSERT INTO order_logs (order_id, status_from, status_to, changed_by, comment) VALUES
(1, 'pending', 'paid', 'Иван Петров', 'Оплата получена'),
(1, 'paid', 'shipped', 'Администратор', 'Заказ собран и отправлен'),
(1, 'shipped', 'delivered', 'Администратор', 'Доставлен получателю'),
(2, 'pending', 'paid', 'Иван Петров', 'Оплата получена'),
(2, 'paid', 'shipped', 'Администратор', 'Заказ отправлен'),
(3, 'pending', 'paid', 'Иван Петров', 'Оплата получена'),
(3, 'paid', 'shipped', 'Администратор', 'Заказ собран и отправлен'),
(4, 'pending', 'paid', 'Мария Сидорова', 'Оплата получена'),
(4, 'paid', 'shipped', 'Администратор', 'Заказ отправлен'),
(4, 'shipped', 'delivered', 'Администратор', 'Доставлен получателю'),
(5, 'pending', 'paid', 'Алексей Козлов', 'Оплата получена'),
(5, 'paid', 'shipped', 'Администратор', 'Заказ отправлен'),
(5, 'shipped', 'delivered', 'Администратор', 'Доставлен получателю');

-- Тестовые корзины пользователей
INSERT INTO user_carts (user_id, cart_data) VALUES
(3, '[{"id": 1, "name": "Intel Core i9-14900K", "price": 59999, "quantity": 1}, {"id": 7, "name": "NVIDIA RTX 4090 Founders Edition", "price": 199999, "quantity": 1}]'),
(4, '[{"id": 2, "name": "AMD Ryzen 9 7950X", "price": 54999, "quantity": 1}, {"id": 8, "name": "AMD RX 7900 XTX", "price": 89999, "quantity": 1}]'),
(5, '[{"id": 3, "name": "Intel Core i7-14700K", "price": 39999, "quantity": 1}, {"id": 9, "name": "NVIDIA RTX 4080 Super", "price": 79999, "quantity": 1}]');
