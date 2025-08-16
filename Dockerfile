# Multi-stage build для оптимизации размера образа
FROM node:18-alpine AS base

# Установка зависимостей для сборки
RUN apk add --no-cache libc6-compat

# Рабочая директория
WORKDIR /app

# Копирование файлов package.json
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY server/package*.json ./server/

# Установка зависимостей
RUN npm ci --only=production

# Этап сборки фронтенда
FROM base AS web-builder
WORKDIR /app
COPY . .
WORKDIR /app/apps/web
RUN npm run build

# Этап сборки бэкенда
FROM base AS server-builder
WORKDIR /app/server
COPY server/ ./
RUN npm ci --only=production

# Финальный этап
FROM node:18-alpine AS runner

# Создание пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Установка необходимых пакетов
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Копирование собранных приложений
COPY --from=web-builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=web-builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=server-builder --chown=nextjs:nodejs /app/server ./server

# Копирование конфигурационных файлов
COPY --chown=nextjs:nodejs package*.json ./
COPY --chown=nextjs:nodejs apps/web/next.config.js ./apps/web/
COPY --chown=nextjs:nodejs apps/web/public ./apps/web/public

# Переключение на пользователя nextjs
USER nextjs

# Экспорт портов
EXPOSE 3000 3001

# Команда запуска
CMD ["node", "apps/web/server.js"]
