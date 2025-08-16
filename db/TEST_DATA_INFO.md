# Тестовые данные EDA Computers

## Обзор
База данных содержит полный набор тестовых данных для разработки и тестирования системы EDA Computers.

## Статистика данных
- **Пользователи**: 9 (2 админа, 7 пользователей)
- **Категории**: 7 (процессоры, видеокарты, память, материнские платы, накопители, блоки питания, корпуса)
- **Компоненты**: 45 (различные модели процессоров, видеокарт, памяти и т.д.)
- **Заказы**: 8 (различные статусы: pending, paid, building, shipping, delivered)
- **Отзывы**: 6 (с различными рейтингами и статусами)
- **Готовые сборки**: 10 (различные уровни производительности)
- **Комментарии к заказам**: 13
- **История изменений заказов**: 19
- **Корзины пользователей**: 6

## Тестовые пользователи

### Администраторы
- **admin@eda.com** / 123456 - Администратор EDA
- **moderator@eda.com** / 123456 - Модератор EDA

### Обычные пользователи
- **user@eda.com** / 123456 - Тест Пользователь
- **ivan@example.com** / 123456 - Иван Петров
- **maria@example.com** / 123456 - Мария Сидорова
- **alex@example.com** / 123456 - Алексей Козлов
- **test1@example.com** / 123456 - Тест Пользователь1
- **test2@example.com** / 123456 - Тест Пользователь2
- **test3@example.com** / 123456 - Тест Пользователь3

## Категории компонентов

1. **Процессоры** (6 компонентов)
   - Intel Core i9-14900K (59,999₽)
   - AMD Ryzen 9 7950X (54,999₽)
   - Intel Core i7-14700K (39,999₽)
   - AMD Ryzen 7 7700X (29,999₽)
   - Intel Core i5-14600K (24,999₽)
   - AMD Ryzen 5 7600X (19,999₽)
   - Intel Core i3-14100 (12,999₽)
   - AMD Ryzen 5 5500 (9,999₽)
   - Intel Core i9-13900K (49,999₽)
   - AMD Ryzen 9 7900X (44,999₽)

2. **Видеокарты** (10 компонентов)
   - NVIDIA RTX 4090 Founders Edition (199,999₽)
   - AMD RX 7900 XTX (89,999₽)
   - NVIDIA RTX 4080 Super (79,999₽)
   - AMD RX 7900 XT (69,999₽)
   - NVIDIA RTX 4070 Ti Super (59,999₽)
   - AMD RX 7800 XT (49,999₽)
   - NVIDIA RTX 4060 Ti (29,999₽)
   - AMD RX 7600 (24,999₽)
   - NVIDIA RTX 4060 (19,999₽)
   - AMD RX 6750 XT (29,999₽)

3. **Оперативная память** (5 компонентов)
   - Corsair Dominator Platinum DDR5-6000 32GB (12,999₽)
   - G.Skill Trident Z5 DDR5-5600 16GB (6,999₽)
   - Kingston Fury Beast DDR4-3600 32GB (5,999₽)
   - Crucial Ballistix DDR5-5200 32GB (8,999₽)
   - TeamGroup T-Force Delta DDR5-6000 16GB (7,999₽)

4. **Материнские платы** (5 компонентов)
   - ASUS ROG Maximus Z790 Hero (29,999₽)
   - MSI MPG B650 Carbon WiFi (19,999₽)
   - Gigabyte B760 Aorus Elite (15,999₽)
   - ASUS TUF Gaming B650-Plus (14,999₽)
   - MSI PRO Z790-P WiFi (18,999₽)

5. **Накопители** (5 компонентов)
   - Samsung 990 PRO 2TB NVMe (12,999₽)
   - WD Black SN850X 1TB NVMe (7,999₽)
   - Seagate Barracuda 2TB HDD (2,999₽)
   - Crucial P5 Plus 2TB NVMe (11,999₽)
   - Kingston KC3000 1TB NVMe (6,999₽)

6. **Блоки питания** (5 компонентов)
   - Corsair AX1600i 1600W (29,999₽)
   - Seasonic PRIME TX-1300 1300W (24,999₽)
   - EVGA SuperNOVA 850 G6 850W (12,999₽)
   - be quiet! Dark Power Pro 12 1200W (27,999₽)
   - Corsair RM850x 850W (11,999₽)

7. **Корпуса** (5 компонентов)
   - NZXT H510 Elite (8,999₽)
   - Corsair 4000D Airflow (7,999₽)
   - Lian Li O11 Dynamic (12,999₽)
   - Fractal Design Meshify C (6,999₽)
   - Phanteks P400A (5,999₽)

## Готовые сборки

1. **Gaming Beast RTX 4090** (399,999₽) - Максимальная производительность для 4K игр
2. **Streamer Pro RTX 4080** (299,999₽) - Идеально для стриминга и игр
3. **Creator Workstation** (249,999₽) - Для работы с видео и 3D
4. **Budget Gaming** (99,999₽) - Отличная производительность за разумные деньги
5. **Office PC** (49,999₽) - Для работы и учебы
6. **Entry Level Gaming** (79,999₽) - Бюджетная игровая сборка
7. **Mid Range Gaming** (129,999₽) - Средняя игровая сборка
8. **High End Gaming** (199,999₽) - Высокопроизводительная игровая сборка
9. **Streaming Setup** (159,999₽) - Сборка для стриминга
10. **Workstation** (179,999₽) - Рабочая станция

## Статусы заказов

- **pending** - Ожидает оплаты
- **paid** - Оплачен
- **building** - В сборке
- **shipping** - Отправлен
- **delivered** - Доставлен

## Статусы отзывов

- **pending** - Ожидает модерации
- **approved** - Одобрен
- **rejected** - Отклонен

## Загрузка данных

Для загрузки тестовых данных используйте:

```bash
# Основные данные
docker exec -i eda-computers-db psql -U eda_user -d eda_computers < db/clean_seed.sql

# Дополнительные данные
docker exec -i eda-computers-db psql -U eda_user -d eda_computers < db/extended_seed.sql
```

## Очистка данных

Для очистки всех данных:

```bash
docker exec -i eda-computers-db psql -U eda_user -d eda_computers -c "TRUNCATE TABLE order_comments, order_logs, reviews, orders, user_carts, user_sessions, components, builds, categories, users RESTART IDENTITY CASCADE;"
```

## Полезные запросы

### Проверка статистики
```sql
SELECT 'Пользователи' as table_name, COUNT(*) as count FROM users 
UNION ALL SELECT 'Компоненты', COUNT(*) FROM components 
UNION ALL SELECT 'Заказы', COUNT(*) FROM orders 
UNION ALL SELECT 'Отзывы', COUNT(*) FROM reviews;
```

### Поиск пользователей
```sql
SELECT email, first_name, last_name, role FROM users;
```

### Поиск компонентов по категории
```sql
SELECT c.name, c.price, c.stock_quantity 
FROM components c 
JOIN categories cat ON c.category_id = cat.id 
WHERE cat.name = 'Процессоры';
```

### Заказы с пользователями
```sql
SELECT o.id, o.customer_name, o.total_price, o.status, u.email 
FROM orders o 
LEFT JOIN users u ON o.user_id = u.id;
```
