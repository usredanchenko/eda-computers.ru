#!/bin/bash

# Скрипт для удаления локальных систем развертывания
set -e

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

# Остановка и удаление Docker контейнеров
cleanup_docker() {
    log_info "Остановка Docker контейнеров..."
    
    if [ -f "docker-compose.yml" ]; then
        docker-compose down --remove-orphans -v
        log_success "Docker контейнеры остановлены и удалены"
    else
        log_warning "Файл docker-compose.yml не найден"
    fi
}

# Удаление Docker образов
cleanup_images() {
    log_info "Удаление Docker образов..."
    
    # Удаление образов проекта
    docker images | grep "eda-computers" | awk '{print $3}' | xargs -r docker rmi -f
    
    # Удаление неиспользуемых образов
    docker image prune -f
    
    log_success "Docker образы очищены"
}

# Удаление Docker volumes
cleanup_volumes() {
    log_info "Удаление Docker volumes..."
    
    # Удаление volumes проекта
    docker volume ls | grep "eda-computers" | awk '{print $2}' | xargs -r docker volume rm -f
    
    # Удаление неиспользуемых volumes
    docker volume prune -f
    
    log_success "Docker volumes очищены"
}

# Удаление Docker networks
cleanup_networks() {
    log_info "Удаление Docker networks..."
    
    # Удаление неиспользуемых networks
    docker network prune -f
    
    log_success "Docker networks очищены"
}

# Остановка локальных сервисов
stop_local_services() {
    log_info "Остановка локальных сервисов..."
    
    # Остановка PostgreSQL (если запущен локально)
    if pgrep -x "postgres" > /dev/null; then
        log_info "Остановка PostgreSQL..."
        brew services stop postgresql 2>/dev/null || \
        sudo systemctl stop postgresql 2>/dev/null || \
        sudo service postgresql stop 2>/dev/null || \
        log_warning "Не удалось остановить PostgreSQL"
    fi
    
    # Остановка Redis (если запущен локально)
    if pgrep -x "redis-server" > /dev/null; then
        log_info "Остановка Redis..."
        brew services stop redis 2>/dev/null || \
        sudo systemctl stop redis 2>/dev/null || \
        sudo service redis stop 2>/dev/null || \
        log_warning "Не удалось остановить Redis"
    fi
    
    # Остановка Node.js процессов проекта
    log_info "Остановка Node.js процессов..."
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "nodemon" 2>/dev/null || true
    pkill -f "node.*src/index.js" 2>/dev/null || true
    
    log_success "Локальные сервисы остановлены"
}

# Удаление локальных файлов
cleanup_local_files() {
    log_info "Удаление локальных файлов..."
    
    # Удаление node_modules
    if [ -d "node_modules" ]; then
        rm -rf node_modules
        log_info "Удален node_modules"
    fi
    
    if [ -d "apps/web/node_modules" ]; then
        rm -rf apps/web/node_modules
        log_info "Удален apps/web/node_modules"
    fi
    
    if [ -d "server/node_modules" ]; then
        rm -rf server/node_modules
        log_info "Удален server/node_modules"
    fi
    
    # Удаление .next директории
    if [ -d "apps/web/.next" ]; then
        rm -rf apps/web/.next
        log_info "Удален apps/web/.next"
    fi
    
    # Удаление логов
    if [ -d "logs" ]; then
        rm -rf logs
        log_info "Удалена директория logs"
    fi
    
    # Удаление временных файлов
    find . -name "*.tmp" -delete 2>/dev/null || true
    find . -name "*.log" -delete 2>/dev/null || true
    
    log_success "Локальные файлы очищены"
}

# Очистка портов
cleanup_ports() {
    log_info "Проверка и освобождение портов..."
    
    # Проверка порта 3000
    if lsof -ti:3000 > /dev/null 2>&1; then
        log_info "Освобождение порта 3000..."
        lsof -ti:3000 | xargs kill -9
    fi
    
    # Проверка порта 3001
    if lsof -ti:3001 > /dev/null 2>&1; then
        log_info "Освобождение порта 3001..."
        lsof -ti:3001 | xargs kill -9
    fi
    
    # Проверка порта 5432
    if lsof -ti:5432 > /dev/null 2>&1; then
        log_info "Освобождение порта 5432..."
        lsof -ti:5432 | xargs kill -9
    fi
    
    # Проверка порта 6379
    if lsof -ti:6379 > /dev/null 2>&1; then
        log_info "Освобождение порта 6379..."
        lsof -ti:6379 | xargs kill -9
    fi
    
    log_success "Порты освобождены"
}

# Основная функция
main() {
    log_info "Начинаем очистку локальных систем развертывания..."
    
    # Подтверждение действия
    read -p "Вы уверены, что хотите удалить все локальные системы развертывания? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warning "Операция отменена"
        exit 0
    fi
    
    stop_local_services
    cleanup_ports
    cleanup_docker
    cleanup_images
    cleanup_volumes
    cleanup_networks
    cleanup_local_files
    
    log_success "Очистка завершена успешно!"
    log_info "Теперь вы можете использовать Docker для развертывания:"
    log_info "  ./deploy.sh deploy"
}

# Обработка аргументов командной строки
case "${1:-cleanup}" in
    "cleanup")
        main
        ;;
    "docker-only")
        log_info "Очистка только Docker ресурсов..."
        cleanup_docker
        cleanup_images
        cleanup_volumes
        cleanup_networks
        log_success "Docker ресурсы очищены"
        ;;
    "services-only")
        log_info "Остановка только локальных сервисов..."
        stop_local_services
        cleanup_ports
        log_success "Локальные сервисы остановлены"
        ;;
    "files-only")
        log_info "Удаление только локальных файлов..."
        cleanup_local_files
        log_success "Локальные файлы удалены"
        ;;
    *)
        echo "Использование: $0 {cleanup|docker-only|services-only|files-only}"
        echo "  cleanup      - полная очистка всех локальных систем"
        echo "  docker-only  - очистка только Docker ресурсов"
        echo "  services-only - остановка только локальных сервисов"
        echo "  files-only   - удаление только локальных файлов"
        exit 1
        ;;
esac
