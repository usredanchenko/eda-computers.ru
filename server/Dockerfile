# Dockerfile для Express.js сервера
FROM node:18-alpine

# Создание пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Установка зависимостей для сборки
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# Копирование файлов зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm install --omit=dev

# Копирование исходного кода
COPY . .

# Создание директории для логов
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app

# Переключение на пользователя nodejs
USER nodejs

# Экспорт порта
EXPOSE 3001

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3001

# Команда запуска
CMD ["node", "src/index.js"]
