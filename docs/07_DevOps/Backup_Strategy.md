# Backup Strategy

## Цель
Надежный backup PostgreSQL на HDD с возможностью восстановления.

## Стратегия
- Ежедневный `pg_dump` в `/mnt/hdd/backups/aniforge`.
- Ротация: хранить 14 daily + 8 weekly.
- Еженедельная проверка restore на тестовой БД.

## Cron пример
`0 3 * * * /opt/aniforge/scripts/backup-postgres.sh`

## Disaster Recovery
1. Поднять postgres контейнер.
2. Запустить `restore-postgres.sh` с нужным dump.
3. Прогнать smoke checks API.
