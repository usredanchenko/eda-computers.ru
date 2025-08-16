# A0 — Полный аудит и карта регрессий

## Конфиги и окружение
- Docker Compose: фронт 3000, API 3001, nginx 80/443. NEXT_PUBLIC_API_URL у веб — http://localhost:3001.
- Сервер CORS: исправлен на рефлект Origin (http://localhost:3000, 127.0.0.1:3000), credentials: true, preflight OK.
- CSRF: GET /api/auth/csrf-token -> cookie csrf_token + JSON {csrfToken}.

## Основные пользовательские потоки
- Главная → Конструктор `/constructor` → работает (200 OK).
- Главная → Готовые сборки `/builds` → работает.
- Логин/Регистрация → куки httpOnly + localStorage дублирование токена.
- ЛК `/account` для USER, `/admin` для ADMIN: после входа должны редиректить по роли.

## Матрица регрессий (выжимка)
| Флоу | Симптом | Причина | Риск | План фикса |
|---|---|---|---|---|
| Auth из браузера | CORS Failed to fetch | Access-Control-Allow-Origin был `https://localhost` | Блокирует логин/CSRF | Исправлено CORS на сервере (рефлект Origin); проверить в браузере |
| Дубли навигации | Есть `<nav class="bg-dark-900/80 ...">` | Два хэдера: `Navigation` в layout и `Header` в страницах | Конфликты, визуальный дубль | Удален `Header` из страниц, оставлен только `Navigation` |
| Конструктор | "Не могу перейти" | Кэш/битый роут ранее | Пользовательский блок | Проверено 200 OK; если не открывается — жесткий рефреш |
| RBAC | Непредсказуемые переходы | Guard/redirect не едины | Доступ к чужим экранам | Проверить хуки `useAuth`, ссылки в `Navigation` |

## Навигация
- Оставлен единственный источник: `apps/web/components/Navigation.tsx` через `layout.tsx`.
- Удалены вхождения `Header` из страниц: `app/page.tsx`, `app/about/page.tsx`, `app/builds/page.tsx`, `app/test-navigation/page.tsx`.

## Приоритетные фиксы
- P0: CORS/CSRF/credentials — исправлено, проверить логин из UI.
- P1: Единый guard и редиректы по ролям на фронте, устранить зависимость от localStorage (cookie — основной источник).
- P1: Убедиться, что `/account` и `/admin` отрисовываются только при корректной роли.
