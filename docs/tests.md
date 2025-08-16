# A5 — Тесты и устойчивость

## Как прогнать тесты локально (без Docker)

- Фронтенд (unit):
  - `cd apps/web`
  - `npm ci`
  - `npm test`
- Фронтенд (e2e):
  - `cd apps/web`
  - `npm ci`
  - `npx playwright install --with-deps`
  - `npm run test:e2e`

Примечание: в прод-контейнере web dev-зависимости не устанавливаются, поэтому тесты запускайте локально или добавьте отдельную тест-сборку.

## Набор сценариев

- Unit:
  - `authUtils` — редиректы и доступ по ролям (ADMIN/USER/ANY)
- E2E (Playwright):
  - Гость на `/admin` → редирект на `/auth/login?redirect=/admin`
  - Гость на `/account` → редирект на `/auth/login?redirect=/account`
  - Логин ADMIN → `/admin` (заголовок «Админ-панель»)
  - Логин USER → `/account` (заголовок «Личный кабинет»)

## Мини чек-лист устойчивости

- Auth API
  - `GET /api/auth/csrf-token` → 200, cookie `csrf_token`
  - `POST /api/auth/login` → 200, httpOnly cookie `auth_token`
  - `GET /api/auth/me` → 200 для авторизованного, 401 для гостя
- Orders API
  - USER: `POST /api/orders` → 201; `GET /api/orders` → список своих
  - ADMIN: `GET /api/orders/all` → 200; `PUT /api/orders/:id/status` → 200
- CORS
  - Префлайт OPTIONS содержит `Access-Control-Allow-Origin: http://localhost:3000`, `Allow-Credentials: true`
- UI
  - Нет дублирующихся landmark `<nav>`; работает один `Navigation` из layout
  - Guarded-роуты: гости редиректятся на логин с `redirect`

## Известные ограничения

- Тесты в контейнере `web` не запускаются, т.к. прод-образ без dev-зависимостей.
- Админ-флоу заказов без пагинации/фильтров — можно добавить без изменения дизайна.
