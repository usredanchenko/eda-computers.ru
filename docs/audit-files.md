# Аудит файлов (A0)

Статусы: нужен / удалить / сомнительно.

## Корень
- README.md — нужен
- CORS_FIX_REPORT.md — удалить
- DEPLOYMENT_SUCCESS_REPORT.md — удалить
- DEPLOY_SUCCESS_REPORT.md — удалить
- DEPLOY_REPORT.md — удалить
- AUTH_FIXES_REPORT.md — удалить
- USER_SYSTEM_REPORT.md — удалить
- REDIRECT_FIXES_REPORT.md — удалить

## docs/
- docs/tests.md — нужен
- docs/audit.md — нужен
- docs/nav-removal.md — нужен
- docs/recovery-report.md — сомнительно
- docs/r8-devops-report.md — сомнительно
- docs/etap1_report.md — сомнительно

## apps/web/
- apps/web/coverage/** — удалить
- apps/web/public/images/components/README.md — нужен
- apps/web/REFACTORING_SUMMARY.md — сомнительно

## db/
- db/TEST_DATA_SUMMARY.md — сомнительно
- db/TEST_DATA_INFO.md — сомнительно

## Системные и артефакты
- **/. — удалить
- **/*.log (из node_modules) — удалить
- **/coverage/** — удалить

Итого: к удалению — coverage, .DS_Store, отчёты в корне; сомнительное — оставить до решения.
