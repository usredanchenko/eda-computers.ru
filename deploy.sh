#!/bin/bash

# EDA Computers Deployment Script
# Скрипт для деплоя системы EDA Computers

set -e  # Остановка при ошибке

echo "🚀 Начинаем деплой EDA Computers..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для логирования
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка наличия Docker
check_docker() {
    log_info "Проверяем Docker..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker не установлен!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose не установлен!"
        exit 1
    fi
    
    log_success "Docker и Docker Compose найдены"
}

# Остановка существующих контейнеров
stop_containers() {
    log_info "Останавливаем существующие контейнеры..."
    docker-compose down --remove-orphans || true
    log_success "Контейнеры остановлены"
}

# Очистка старых образов
cleanup_images() {
    log_info "Очищаем старые образы..."
    docker system prune -f || true
    log_success "Очистка завершена"
}

# Сборка образов
build_images() {
    log_info "Собираем Docker образы..."
    
    # Сборка server
    log_info "Собираем server образ..."
    docker-compose build server
    
    # Сборка web
    log_info "Собираем web образ..."
    docker-compose build web
    
    log_success "Все образы собраны"
}

# Запуск сервисов
start_services() {
    log_info "Запускаем сервисы..."
    
    # Запуск базы данных и Redis
    log_info "Запускаем базу данных и Redis..."
    docker-compose up -d postgres redis
    
    # Ждем готовности базы данных
    log_info "Ждем готовности базы данных..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T postgres pg_isready -U eda_user -d eda_computers > /dev/null 2>&1; then
            log_success "База данных готова"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        log_error "База данных не запустилась за отведенное время"
        exit 1
    fi
    
    # Запуск server
    log_info "Запускаем server..."
    docker-compose up -d server
    
    # Ждем готовности server
    log_info "Ждем готовности server..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:3001/health > /dev/null 2>&1; then
            log_success "Server готов"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        log_error "Server не запустился за отведенное время"
        exit 1
    fi
    
    # Запуск web
    log_info "Запускаем web приложение..."
    docker-compose up -d web
    
    # Ждем готовности web
    log_info "Ждем готовности web приложения..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            log_success "Web приложение готово"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        log_error "Web приложение не запустилось за отведенное время"
        exit 1
    fi
    
    # Запуск nginx
    log_info "Запускаем nginx..."
    docker-compose up -d nginx
    
    log_success "Все сервисы запущены"
}

# Проверка здоровья системы
health_check() {
    log_info "Проверяем здоровье системы..."
    
    # Проверка базы данных
    if docker-compose exec -T postgres pg_isready -U eda_user -d eda_computers > /dev/null 2>&1; then
        log_success "База данных: OK"
    else
        log_error "База данных: FAILED"
        return 1
    fi
    
    # Проверка Redis
    if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        log_success "Redis: OK"
    else
        log_error "Redis: FAILED"
        return 1
    fi
    
    # Проверка server
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        log_success "Server: OK"
    else
        log_error "Server: FAILED"
        return 1
    fi
    
    # Проверка web
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "Web: OK"
    else
        log_error "Web: FAILED"
        return 1
    fi
    
    # Проверка nginx
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_success "Nginx: OK"
    else
        log_error "Nginx: FAILED"
        return 1
    fi
    
    log_success "Все сервисы работают корректно"
}

# Показ информации о деплое
show_info() {
    echo ""
    echo "🎉 Деплой EDA Computers завершен успешно!"
    echo ""
    echo "📊 Статус сервисов:"
    docker-compose ps
    echo ""
    echo "🌐 Доступные URL:"
    echo "   Frontend (HTTP):  http://localhost:3000"
    echo "   Frontend (HTTPS): https://localhost"
    echo "   Backend API:      http://localhost:3001"
    echo "   Health Check:     http://localhost/health"
    echo ""
    echo "🔐 Тестовые аккаунты:"
    echo "   Admin:  admin@eda.com / password"
    echo "   User:   ivan@example.com / password"
    echo ""
    echo "📝 Логи:"
    echo "   docker-compose logs -f [service_name]"
    echo ""
    echo "🛠️  Управление:"
    echo "   Остановка:  docker-compose down"
    echo "   Перезапуск: docker-compose restart"
    echo "   Обновление: ./deploy.sh"
    echo ""
}

# Основная функция
main() {
    log_info "Начинаем деплой EDA Computers..."
    
    check_docker
    stop_containers
    cleanup_images
    build_images
    start_services
    health_check
    show_info
    
    log_success "Деплой завершен успешно! 🚀"
}

# Обработка аргументов командной строки
case "${1:-}" in
    "stop")
        log_info "Останавливаем EDA Computers..."
        docker-compose down
        log_success "Сервисы остановлены"
        ;;
    "restart")
        log_info "Перезапускаем EDA Computers..."
        docker-compose restart
        log_success "Сервисы перезапущены"
        ;;
    "logs")
        log_info "Показываем логи..."
        docker-compose logs -f "${2:-}"
        ;;
    "status")
        log_info "Статус сервисов:"
        docker-compose ps
        ;;
    "clean")
        log_info "Полная очистка..."
        docker-compose down -v --remove-orphans
        docker system prune -af
        log_success "Очистка завершена"
        ;;
    *)
        main
        ;;
esac
