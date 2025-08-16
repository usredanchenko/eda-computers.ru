# EDA Computers - Система сборки компьютеров

Современная веб-платформа для сборки и заказа персональных компьютеров с полным циклом управления заказами, пользователями и администрированием.

## 🚀 Особенности

- **🔐 Безопасная аутентификация** с JWT токенами и CSRF защитой
- **👥 Ролевая система** (USER/ADMIN) с разграничением доступа
- **🛒 Полный цикл заказов** от создания до доставки
- **💬 Система комментариев** и отзывов с модерацией
- **📊 Админ-панель** с полным управлением системой
- **⚡ Высокая производительность** с кэшированием и оптимизацией
- **🔒 Безопасность** с rate limiting и валидацией данных
- **📈 Мониторинг** производительности и логирование
- **🎨 Современный UI** с неоновым дизайном и анимациями
- **📱 Адаптивный дизайн** для всех устройств

## 🏗️ Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Cache         │
                       │   (Redis)       │
                       └─────────────────┘
```

## 🛠️ Технологический стек

### Frontend
- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - утилитарный CSS фреймворк
- **Framer Motion** - анимации и переходы
- **React Hook Form** - управление формами
- **Zod** - валидация схем

### Backend
- **Node.js 18+** - серверная среда
- **Express.js** - веб-фреймворк
- **PostgreSQL** - реляционная база данных
- **Redis** - кэширование и сессии
- **JWT** - аутентификация
- **bcryptjs** - хеширование паролей
- **Multer** - загрузка файлов

### DevOps & Tools
- **Docker** - контейнеризация
- **Docker Compose** - оркестрация
- **Nginx** - обратный прокси
- **Jest** - тестирование
- **Playwright** - E2E тестирование
- **ESLint** - линтинг кода
- **Prettier** - форматирование кода

## 📦 Установка и запуск

### Предварительные требования

- **Docker** 20.10+ и **Docker Compose** 2.0+
- **Node.js** 18+ (для локальной разработки)
- **Git** для клонирования репозитория

### 🚀 Быстрый старт (Docker)

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd eda-computers-v1.0.1
```

2. **Настройка окружения**
```bash
cp env.example .env
# Отредактируйте .env файл под ваши нужды
```

3. **Запуск приложения**
```bash
# Первый запуск (сборка и запуск)
npm run setup

# Или пошагово:
npm run build    # Сборка контейнеров
npm run start    # Запуск в фоновом режиме
npm run seed     # Заполнение базы тестовыми данными
```

4. **Доступ к приложению**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:3001
- 📊 **Health Check**: http://localhost:3001/health
- 📚 **API Docs**: http://localhost:3001/api-docs (если включен Swagger)

### 🛠️ Разработка (локальная установка)

1. **Установка зависимостей**
```bash
# Backend
cd server
npm install

# Frontend
cd apps/web
npm install
```

2. **Настройка базы данных**
```bash
# Создание базы данных
createdb eda_computers

# Применение миграций
cd server
npm run migrate

# Заполнение тестовыми данными
npm run seed
```

3. **Запуск в режиме разработки**
```bash
# Backend (в одном терминале)
cd server
npm run dev

# Frontend (в другом терминале)
cd apps/web
npm run dev
```

## 📋 Доступные команды

### Основные команды
```bash
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка контейнеров
npm run start        # Запуск в продакшене
npm run stop         # Остановка приложения
npm run clean        # Очистка контейнеров и данных
```

### Управление контейнерами
```bash
npm run logs         # Просмотр логов всех сервисов
npm run logs:web     # Логи только веб-приложения
npm run logs:server  # Логи только сервера
npm run logs:db      # Логи базы данных
npm run restart      # Перезапуск всех сервисов
npm run status       # Статус контейнеров
```

### Разработка и тестирование
```bash
npm run test         # Запуск тестов
npm run test:watch   # Тесты в режиме наблюдения
npm run lint         # Проверка кода
npm run type-check   # Проверка типов TypeScript
npm run shell:web    # Доступ к контейнеру веб-приложения
npm run shell:server # Доступ к контейнеру сервера
npm run shell:db     # Доступ к базе данных
```

### База данных
```bash
npm run seed         # Заполнение тестовыми данными
npm run migrate      # Применение миграций
npm run migrate:reset # Сброс и пересоздание базы
npm run backup       # Создание резервной копии
npm run restore      # Восстановление из резервной копии
```

### Мониторинг
```bash
npm run health       # Проверка здоровья приложения
npm run analyze      # Анализ размера бандла
```

## 🔧 Конфигурация

### Переменные окружения

Основные переменные окружения находятся в файле `.env`:

```bash
# База данных
DB_USER=postgres
DB_HOST=localhost
DB_NAME=eda_computers
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Сервер
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Платежи (ЮKassa)
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key
```

Полный список переменных смотрите в `env.example`.

### Структура проекта

```
eda-computers-v1.0.1/
├── apps/
│   └── web/                 # Next.js frontend
│       ├── app/            # App Router страницы
│       ├── components/     # React компоненты
│       ├── hooks/          # Custom hooks
│       ├── lib/            # Утилиты и API клиент
│       └── types/          # TypeScript типы
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── routes/         # API маршруты
│   │   ├── middleware/     # Middleware
│   │   ├── models/         # Модели данных
│   │   └── utils/          # Утилиты
│   └── migrations/         # Миграции базы данных
├── nginx/                  # Nginx конфигурация
├── db/                     # Скрипты базы данных
├── docs/                   # Документация
└── docker-compose.yml      # Docker Compose конфигурация
```

## 🧪 Тестирование

### Запуск тестов
```bash
# Unit тесты
npm run test

# Тесты с покрытием
npm run test:coverage

# E2E тесты
npm run test:e2e

# Все тесты (CI)
npm run test:ci
```

### Типы тестов
- **Unit тесты**: Jest + React Testing Library
- **E2E тесты**: Playwright
- **API тесты**: Supertest
- **Интеграционные тесты**: Jest

## 🚀 Развертывание

### Продакшен
```bash
# Использование продакшен конфигурации
docker-compose -f docker-compose.prod.yml up -d

# Или через скрипт
./deploy.sh
```

### Мониторинг
- **Логи**: `npm run logs`
- **Статус**: `npm run status`
- **Здоровье**: `npm run health`

## 🤝 Разработка

### Git Workflow
1. Создайте feature ветку: `git checkout -b feature/your-feature`
2. Внесите изменения
3. Запустите тесты: `npm run test:ci`
4. Создайте Pull Request

### Code Style
- **ESLint**: Автоматическая проверка кода
- **Prettier**: Автоматическое форматирование
- **TypeScript**: Строгая типизация
- **Husky**: Pre-commit хуки

### Commit Convention
```
feat: добавлена новая функция
fix: исправлена ошибка
docs: обновлена документация
style: изменения форматирования
refactor: рефакторинг кода
test: добавлены тесты
chore: обновление зависимостей
```

## 📚 API Документация

### Основные эндпоинты

#### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получение профиля
- `POST /api/auth/logout` - Выход

#### Компоненты
- `GET /api/components` - Список компонентов
- `GET /api/components/:id` - Детали компонента
- `GET /api/components/category/:category` - По категории

#### Заказы
- `POST /api/orders` - Создание заказа
- `GET /api/orders` - Список заказов (админ)
- `GET /api/orders/user/:userId` - Заказы пользователя
- `PUT /api/orders/:id/status` - Обновление статуса

#### Админ панель
- `GET /api/admin/users` - Список пользователей
- `GET /api/admin/reviews` - Список отзывов
- `PUT /api/admin/reviews/:id/approve` - Одобрение отзыва
- `DELETE /api/admin/reviews/:id` - Удаление отзыва

## 🐛 Отладка

### Логи
```bash
# Все логи
npm run logs

# Конкретный сервис
npm run logs:web
npm run logs:server
npm run logs:db
```

### Доступ к контейнерам
```bash
# Веб-приложение
npm run shell:web

# Сервер
npm run shell:server

# База данных
npm run shell:db
```

### Частые проблемы

#### Порт занят
```bash
# Проверка занятых портов
lsof -i :3000
lsof -i :3001

# Остановка процесса
kill -9 <PID>
```

#### Проблемы с базой данных
```bash
# Сброс базы
npm run migrate:reset

# Пересоздание контейнеров
npm run clean
npm run setup
```

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature ветку (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📞 Поддержка

- 📧 Email: support@edacomputers.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Документация: [Wiki](https://github.com/your-repo/wiki)

---

**EDA Computers** - Технологии будущего в каждом клике! 🚀
