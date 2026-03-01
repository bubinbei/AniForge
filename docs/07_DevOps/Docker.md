# Docker

## Сервисы compose
- app
- postgres
- redis
- nginx

## Требования
- Явные healthcheck для app/postgres.
- Переменные окружения через `.env`.
- Рестарт-политика `unless-stopped`.

## TODO
- [ ] Добавить multi-stage Dockerfile.
- [ ] Проверить production build в контейнере.
- [ ] Описать zero-downtime update (базовый runbook).
