# Makefile для EDA Computers Docker Deployment

.PHONY: help deploy stop restart logs clean build up down ps status health backup restore cleanup-local

# Цвета для вывода
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Переменные
COMPOSE_FILE := docker-compose.yml
PROD_COMPOSE_FILE := docker-compose.prod.yml

help: ## Показать справку
	@echo "$(BLUE)EDA Computers Docker Deployment$(NC)"
	@echo ""
	@echo "$(YELLOW)Доступные команды:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

deploy: ## Развернуть приложение
	@echo "$(BLUE)Развертывание EDA Computers...$(NC)"
	@./deploy.sh deploy

deploy-prod: ## Развернуть приложение в продакшн режиме
	@echo "$(BLUE)Развертывание EDA Computers в продакшн режиме...$(NC)"
	@docker-compose -f $(PROD_COMPOSE_FILE) up -d --build

stop: ## Остановить приложение
	@echo "$(YELLOW)Остановка приложения...$(NC)"
	@./deploy.sh stop

restart: ## Перезапустить приложение
	@echo "$(YELLOW)Перезапуск приложения...$(NC)"
	@./deploy.sh restart

logs: ## Показать логи
	@echo "$(BLUE)Показать логи всех сервисов...$(NC)"
	@./deploy.sh logs

logs-web: ## Показать логи веб-приложения
	@echo "$(BLUE)Логи веб-приложения:$(NC)"
	@docker-compose logs -f web

logs-server: ## Показать логи сервера
	@echo "$(BLUE)Логи сервера:$(NC)"
	@docker-compose logs -f server

logs-db: ## Показать логи базы данных
	@echo "$(BLUE)Логи базы данных:$(NC)"
	@docker-compose logs -f postgres

logs-redis: ## Показать логи Redis
	@echo "$(BLUE)Логи Redis:$(NC)"
	@docker-compose logs -f redis

logs-nginx: ## Показать логи Nginx
	@echo "$(BLUE)Логи Nginx:$(NC)"
	@docker-compose logs -f nginx

clean: ## Полная очистка
	@echo "$(RED)Полная очистка...$(NC)"
	@./deploy.sh clean

build: ## Собрать образы
	@echo "$(BLUE)Сборка Docker образов...$(NC)"
	@docker-compose build --no-cache

build-prod: ## Собрать образы для продакшена
	@echo "$(BLUE)Сборка Docker образов для продакшена...$(NC)"
	@docker-compose -f $(PROD_COMPOSE_FILE) build --no-cache

up: ## Запустить контейнеры
	@echo "$(BLUE)Запуск контейнеров...$(NC)"
	@docker-compose up -d

down: ## Остановить контейнеры
	@echo "$(YELLOW)Остановка контейнеров...$(NC)"
	@docker-compose down

ps: ## Показать статус контейнеров
	@echo "$(BLUE)Статус контейнеров:$(NC)"
	@docker-compose ps

status: ps ## Алиас для ps

health: ## Проверка здоровья сервисов
	@echo "$(BLUE)Проверка здоровья сервисов...$(NC)"
	@echo "$(GREEN)Проверка Nginx...$(NC)"
	@curl -f http://localhost/health 2>/dev/null && echo "$(GREEN)✓ Nginx готов$(NC)" || echo "$(RED)✗ Nginx не готов$(NC)"
	@echo "$(GREEN)Проверка API...$(NC)"
	@curl -f http://localhost:3001/health 2>/dev/null && echo "$(GREEN)✓ API готов$(NC)" || echo "$(RED)✗ API не готов$(NC)"
	@echo "$(GREEN)Проверка веб-приложения...$(NC)"
	@curl -f http://localhost:3000 2>/dev/null && echo "$(GREEN)✓ Веб-приложение готово$(NC)" || echo "$(RED)✗ Веб-приложение не готово$(NC)"

backup: ## Создать резервную копию
	@echo "$(BLUE)Создание резервной копии...$(NC)"
	@mkdir -p backups
	@docker-compose exec -T postgres pg_dump -U postgres eda_computers > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Резервная копия создана в backups/$(NC)"

restore: ## Восстановить из резервной копии (BACKUP_FILE=filename.sql)
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "$(RED)Укажите файл резервной копии: make restore BACKUP_FILE=backups/filename.sql$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Восстановление из $(BACKUP_FILE)...$(NC)"
	@docker-compose exec -T postgres psql -U postgres -d eda_computers < $(BACKUP_FILE)
	@echo "$(GREEN)Восстановление завершено$(NC)"

cleanup-local: ## Очистка локальных систем
	@echo "$(YELLOW)Очистка локальных систем развертывания...$(NC)"
	@./cleanup-local.sh

cleanup-local-docker: ## Очистка только Docker ресурсов
	@echo "$(YELLOW)Очистка Docker ресурсов...$(NC)"
	@./cleanup-local.sh docker-only

cleanup-local-services: ## Очистка только локальных сервисов
	@echo "$(YELLOW)Очистка локальных сервисов...$(NC)"
	@./cleanup-local.sh services-only

cleanup-local-files: ## Очистка только локальных файлов
	@echo "$(YELLOW)Очистка локальных файлов...$(NC)"
	@./cleanup-local.sh files-only

scale-web: ## Масштабировать веб-сервис (REPLICAS=3)
	@if [ -z "$(REPLICAS)" ]; then \
		echo "$(RED)Укажите количество реплик: make scale-web REPLICAS=3$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Масштабирование веб-сервиса до $(REPLICAS) реплик...$(NC)"
	@docker-compose up -d --scale web=$(REPLICAS)

scale-server: ## Масштабировать сервер (REPLICAS=2)
	@if [ -z "$(REPLICAS)" ]; then \
		echo "$(RED)Укажите количество реплик: make scale-server REPLICAS=2$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Масштабирование сервера до $(REPLICAS) реплик...$(NC)"
	@docker-compose up -d --scale server=$(REPLICAS)

shell-web: ## Открыть shell в веб-контейнере
	@echo "$(BLUE)Открытие shell в веб-контейнере...$(NC)"
	@docker-compose exec web sh

shell-server: ## Открыть shell в сервер-контейнере
	@echo "$(BLUE)Открытие shell в сервер-контейнере...$(NC)"
	@docker-compose exec server sh

shell-db: ## Открыть shell в базе данных
	@echo "$(BLUE)Открытие shell в базе данных...$(NC)"
	@docker-compose exec postgres psql -U postgres -d eda_computers

shell-redis: ## Открыть shell в Redis
	@echo "$(BLUE)Открытие shell в Redis...$(NC)"
	@docker-compose exec redis redis-cli

update: ## Обновить приложение
	@echo "$(BLUE)Обновление приложения...$(NC)"
	@docker-compose down
	@git pull origin main
	@docker-compose up -d --build
	@echo "$(GREEN)Обновление завершено$(NC)"

monitor: ## Мониторинг ресурсов
	@echo "$(BLUE)Мониторинг ресурсов Docker...$(NC)"
	@docker stats

ssl-renew: ## Обновить SSL сертификаты
	@echo "$(BLUE)Обновление SSL сертификатов...$(NC)"
	@rm -rf nginx/ssl/*
	@./deploy.sh deploy
	@echo "$(GREEN)SSL сертификаты обновлены$(NC)"

env-check: ## Проверить переменные окружения
	@echo "$(BLUE)Проверка переменных окружения...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(RED)Файл .env не найден$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Файл .env найден$(NC)"
	@echo "$(YELLOW)Проверьте содержимое файла .env$(NC)"

# Команды для разработки
dev: ## Запустить в режиме разработки
	@echo "$(BLUE)Запуск в режиме разработки...$(NC)"
	@npm run dev

dev-web: ## Запустить только веб-приложение в режиме разработки
	@echo "$(BLUE)Запуск веб-приложения в режиме разработки...$(NC)"
	@npm run dev:web

dev-server: ## Запустить только сервер в режиме разработки
	@echo "$(BLUE)Запуск сервера в режиме разработки...$(NC)"
	@npm run dev:server

# Команды для тестирования
test: ## Запустить тесты
	@echo "$(BLUE)Запуск тестов...$(NC)"
	@npm test

test-web: ## Запустить тесты веб-приложения
	@echo "$(BLUE)Запуск тестов веб-приложения...$(NC)"
	@cd apps/web && npm test

test-server: ## Запустить тесты сервера
	@echo "$(BLUE)Запуск тестов сервера...$(NC)"
	@cd server && npm test

# Команды для линтинга
lint: ## Запустить линтер
	@echo "$(BLUE)Запуск линтера...$(NC)"
	@npm run lint

lint-web: ## Запустить линтер веб-приложения
	@echo "$(BLUE)Запуск линтера веб-приложения...$(NC)"
	@cd apps/web && npm run lint

lint-server: ## Запустить линтер сервера
	@echo "$(BLUE)Запуск линтера сервера...$(NC)"
	@cd server && npm run lint

# Команды для форматирования
format: ## Форматировать код
	@echo "$(BLUE)Форматирование кода...$(NC)"
	@npm run format

# Информационные команды
info: ## Показать информацию о системе
	@echo "$(BLUE)Информация о системе:$(NC)"
	@echo "$(GREEN)Docker версия:$(NC)"
	@docker --version
	@echo "$(GREEN)Docker Compose версия:$(NC)"
	@docker-compose --version
	@echo "$(GREEN)Node.js версия:$(NC)"
	@node --version
	@echo "$(GREEN)NPM версия:$(NC)"
	@npm --version
	@echo "$(GREEN)Операционная система:$(NC)"
	@uname -a

ports: ## Показать используемые порты
	@echo "$(BLUE)Используемые порты:$(NC)"
	@lsof -i :3000 -i :3001 -i :5432 -i :6379 -i :80 -i :443 2>/dev/null || echo "$(YELLOW)Порты свободны$(NC)"

# Команды для отладки
debug: ## Включить режим отладки
	@echo "$(BLUE)Включение режима отладки...$(NC)"
	@docker-compose down
	@docker-compose up -d
	@echo "$(GREEN)Режим отладки включен. Логи: make logs$(NC)"

debug-web: ## Отладка веб-приложения
	@echo "$(BLUE)Отладка веб-приложения...$(NC)"
	@docker-compose logs -f web

debug-server: ## Отладка сервера
	@echo "$(BLUE)Отладка сервера...$(NC)"
	@docker-compose logs -f server

# Команды для очистки
prune: ## Очистить неиспользуемые Docker ресурсы
	@echo "$(BLUE)Очистка неиспользуемых Docker ресурсов...$(NC)"
	@docker system prune -f
	@docker volume prune -f
	@docker network prune -f
	@echo "$(GREEN)Очистка завершена$(NC)"

prune-all: ## Полная очистка Docker
	@echo "$(RED)Полная очистка Docker (внимание: удалит все образы и контейнеры)...$(NC)"
	@read -p "Вы уверены? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@docker system prune -a -f --volumes
	@echo "$(GREEN)Полная очистка завершена$(NC)"
