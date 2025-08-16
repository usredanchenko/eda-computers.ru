#!/bin/bash

echo "🔍 Проверка и исправление проблем с авторизацией EDA Computers"
echo "================================================================"

# Проверяем, запущены ли контейнеры
echo "📋 Проверка статуса контейнеров..."
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "❌ Контейнеры не запущены. Запускаем..."
    docker-compose -f docker-compose.prod.yml up -d
    sleep 10
fi

# Проверяем подключение к базе данных
echo "🗄️  Проверка подключения к базе данных..."
if ! docker exec eda-computers-db pg_isready -U eda_user -d eda_computers; then
    echo "❌ Проблема с подключением к базе данных"
    exit 1
fi

# Применяем исправления к базе данных
echo "🔧 Применение исправлений к базе данных..."
docker exec -i eda-computers-db psql -U eda_user -d eda_computers < db/fix_auth_data.sql

# Проверяем API сервер
echo "🌐 Проверка API сервера..."
if ! curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "❌ API сервер недоступен"
    echo "Перезапускаем сервер..."
    docker-compose -f docker-compose.prod.yml restart server
    sleep 10
fi

# Проверяем веб-приложение
echo "🌍 Проверка веб-приложения..."
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Веб-приложение недоступно"
    echo "Перезапускаем веб-приложение..."
    docker-compose -f docker-compose.prod.yml restart web
    sleep 10
fi

# Проверяем логи на ошибки
echo "📝 Проверка логов на ошибки..."
echo "Логи сервера:"
docker logs eda-computers-server --tail 20 | grep -i error || echo "Ошибок в логах сервера не найдено"

echo "Логи веб-приложения:"
docker logs eda-computers-web --tail 20 | grep -i error || echo "Ошибок в логах веб-приложения не найдено"

# Тестируем API endpoints
echo "🧪 Тестирование API endpoints..."

# Тест health check
echo "Проверка health check..."
curl -s http://localhost:3001/api/health | jq . || echo "Health check недоступен"

# Тест регистрации
echo "Тест регистрации..."
curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}' | jq . || echo "Регистрация недоступна"

echo ""
echo "✅ Проверка завершена!"
echo ""
echo "📋 Тестовые аккаунты:"
echo "Админ: admin@eda.com / admin123"
echo "Пользователь: user@eda.com / user123"
echo "Тест: test@example.com / test123"
echo ""
echo "🌐 Доступ к приложению:"
echo "Веб-сайт: http://localhost:3000"
echo "API: http://localhost:3001"
echo ""
echo "🔧 Если проблемы остались, проверьте:"
echo "1. Логи контейнеров: docker logs [container_name]"
echo "2. Переменные окружения в env.production"
echo "3. Конфигурацию Nginx"
echo "4. SSL сертификаты"
