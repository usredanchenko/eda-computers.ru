# Многоэтапная сборка для оптимизации размера образа
FROM node:18-alpine AS base

# Устанавливаем зависимости для сборки
FROM base AS deps
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
# Устанавливаем все зависимости для сборки (dev нужны для build: tailwind/postcss)
RUN npm ci --ignore-scripts || npm install --ignore-scripts

# Этап сборки
FROM base AS builder
WORKDIR /app

# Копируем зависимости из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем SWC для избежания проблем с ARM64
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Сборка приложения
RUN npm run build

# Этап запуска
FROM base AS runner
WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем собранное приложение
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Переключаемся на пользователя nextjs
USER nextjs

# Открываем порт
EXPOSE 3000

# Устанавливаем переменные окружения
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Запускаем приложение
CMD ["node", "server.js"]
