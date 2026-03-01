# DevOps Decisions

## 1) Docker Compose для MVP
### Почему выбрали
- Быстрый воспроизводимый запуск на локальной машине и сервере.
- Достаточно для single-node self-host.

### Почему не иначе
- Kubernetes на этом этапе даст лишнюю сложность без реальной нагрузки.

### Документация
- https://docs.docker.com/compose/

## 2) Nginx reverse proxy
### Почему выбрали
- Простой и надежный reverse proxy.
- Удобен для маршрутизации и базовых production настроек.

### Почему не иначе
- Можно использовать Caddy/Traefik, но Nginx более знаком и предсказуем в ручном self-host.

### Документация
- https://nginx.org/en/docs/

## 3) Redis включен заранее
### Почему выбрали
- Подготовка к rate limiting/cache без смены инфраструктурного контура.

### Почему не иначе
- Подключать Redis поздно возможно, но тогда меняется прод-операционный профиль.

### Документация
- https://redis.io/docs/latest/

## 4) Backup/Restore scripts
### Почему выбрали
- Минимально необходимый уровень эксплуатационной надежности.
- Явный путь восстановления после сбоя.

### Документация
- `pg_dump`: https://www.postgresql.org/docs/current/app-pgdump.html
- `psql`: https://www.postgresql.org/docs/current/app-psql.html

## Связанные заметки
- [[07_DevOps/Docker]]
- [[07_DevOps/Backup_Strategy]]
- [[10_Progress/As_Built_Status]]
