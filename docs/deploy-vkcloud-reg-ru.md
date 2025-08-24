## Деплой eda-computers.ru в VK Cloud (домен на reg.ru)

Ниже пошаговая инструкция для развёртывания этого репозитория в VK Cloud c доменом `eda-computers.ru` (зарегистрирован на reg.ru). Конфигурация ориентирована на `docker-compose.prod.yml` и `nginx/nginx.conf` из репозитория.

### 1) Предварительные условия
- Аккаунт VK Cloud и проект с квотами на 1 публичный IP.
- Домен на reg.ru: доступ к управлению DNS-зоной.
- Рекомендуемая ВМ: Ubuntu 22.04 LTS, 2 vCPU, 4–8 GB RAM, 30+ GB SSD.
- Открытые порты: 22/tcp (SSH), 80/tcp (HTTP), 443/tcp (HTTPS).

### 2) Создать ВМ и получить публичный IP
1. В VK Cloud → Compute Cloud → создать ВМ (Ubuntu 22.04).
2. Привязать внешний статический IP (Floating IP) к ВМ.
3. Разрешить трафик 80/443/22 в Security Group/Firewall.

### 3) Настроить DNS на reg.ru
В DNS-зоне домена добавьте записи:
- A: `eda-computers.ru` → ПУБЛИЧНЫЙ_IP_ВМ
- A (или CNAME): `www` → ПУБЛИЧНЫЙ_IP_ВМ (или CNAME на `eda-computers.ru`)

Подождите актуализации DNS (обычно 5–30 минут).

### 4) Установка Docker на ВМ
```bash
sudo apt update -y && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update -y
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin git
sudo usermod -aG docker $USER
newgrp docker
```

### 5) Клонирование репозитория
```bash
cd /opt
sudo mkdir -p /opt/eda-computers && sudo chown -R $USER:$USER /opt/eda-computers
git clone https://<ВАШ_GIT_РЕПО>.git eda-computers
cd /opt/eda-computers
```

### 6) Подготовка переменных окружения
Создайте файл `.env` в корне проекта (рядом с `docker-compose.prod.yml`). Docker Compose подхватывает `.env` автоматически.

Базовый шаблон (адаптируйте под прод):
```env
JWT_SECRET=<случайный_длинный_секрет>
FRONTEND_URL=https://eda-computers.ru
NEXT_PUBLIC_API_URL=https://eda-computers.ru
CORS_ORIGIN=https://eda-computers.ru

DB_USER=eda_user
DB_PASSWORD=<надежный_пароль>
REDIS_PASSWORD=<надежный_пароль>

YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
YOOKASSA_WEBHOOK_SECRET=
```

Примечания:
- Значения `FRONTEND_URL`, `NEXT_PUBLIC_API_URL`, `CORS_ORIGIN` должны указывать на ваш боевой домен с HTTPS.
- `DB_PASSWORD`, `REDIS_PASSWORD`, `JWT_SECRET` — обязательно задать сильные значения.

### 7) Выпуск TLS-сертификата Let’s Encrypt
Nginx в нашем `nginx/nginx.conf` ожидает сертификаты по путям `/etc/nginx/ssl/cert.pem` и `/etc/nginx/ssl/key.pem`, которые смонтированы из папки `./nginx/ssl` проекта. Проще всего выпустить сертификат на хосте и скопировать файлы в эту папку.

1. Установите certbot (standalone):
```bash
sudo snap install core && sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot || true
```

2. Убедитесь, что порт 80 свободен (если контейнеры ещё не запущены — он свободен).

3. Выпустите сертификат на оба домена:
```bash
sudo certbot certonly --standalone \
  -d eda-computers.ru -d www.eda-computers.ru \
  --non-interactive --agree-tos -m admin@eda-computers.ru
```

4. Скопируйте сертификаты в папку, которую монтирует Nginx:
```bash
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/eda-computers.ru/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/eda-computers.ru/privkey.pem  nginx/ssl/key.pem
```

5. Настройте автообновление (cron) с перезагрузкой Nginx:
```bash
sudo bash -c 'cat > /etc/cron.d/certbot-eda <<EOF
0 3 * * * root certbot renew --quiet --deploy-hook "cp /etc/letsencrypt/live/eda-computers.ru/fullchain.pem /opt/eda-computers/nginx/ssl/cert.pem && cp /etc/letsencrypt/live/eda-computers.ru/privkey.pem /opt/eda-computers/nginx/ssl/key.pem && docker compose -f /opt/eda-computers/docker-compose.prod.yml restart nginx"
EOF'
```

Альтернатива: использовать VK Cloud Load Balancer c TLS-терминацией и пробросом HTTP на порт 80 Nginx. Тогда локальные сертификаты не нужны.

### 8) Сборка и запуск
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Проверьте, что контейнеры здоровы:
```bash
docker ps
docker compose -f docker-compose.prod.yml logs -f nginx | cat
```

### 9) Проверки после запуска
- `https://eda-computers.ru/health` должен вернуть `healthy` (из Nginx).
- Главная открывается по HTTPS без mixed-content ошибок.
- API доступен по `https://eda-computers.ru/api/...`.

### 10) Частые проблемы
- DNS ещё не обновился — подождите до 30–60 минут.
- Порт 80 занят при выпуске сертификата — остановите Nginx, затем `certbot certonly --standalone`.
- Неверные переменные окружения: проверьте `.env`, особенно `CORS_ORIGIN`, `FRONTEND_URL`, `NEXT_PUBLIC_API_URL`.

### 11) Обновления приложения
```bash
git pull
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

—
Подробности по конфигурации см. в файлах `docker-compose.prod.yml` и `nginx/nginx.conf` в корне репозитория.


