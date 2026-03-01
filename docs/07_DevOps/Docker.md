# Docker / Self-Host (As-Built)

## Реализовано
- [x] Multi-stage `Dockerfile`
- [x] `docker-compose.yml` со стеком:
  - app
  - postgres
  - redis
  - nginx
- [x] Nginx reverse proxy (`docker/nginx/default.conf`)
- [x] Healthcheck для app/postgres
- [x] Скрипты backup/restore PostgreSQL

## Точки монтирования
- NVMe:
  - Postgres data
  - Redis data
- HDD:
  - backups
  - nginx logs

## Runbook (кратко)
1. Заполнить `.env`.
2. `docker compose up -d --build`.
3. Проверить `docker compose ps`.
4. Проверить `GET /api/health`.

## Backup
- Скрипт: `scripts/backup-postgres.sh`
- Restore: `scripts/restore-postgres.sh <dump.sql.gz>`
- Рекомендуемая cron-периодичность: ежедневно 03:00.

## Что осталось улучшить
- Проверка backup restore в CI/операционном чеклисте.
- Добавить инструкцию по SSL termination варианту (Caddy/Traefik/Nginx+certbot).
- Уточнить стратегию обновлений с минимальным downtime.
