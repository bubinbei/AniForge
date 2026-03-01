# Server Architecture

```mermaid
flowchart TB
  U[Users] --> N[Nginx Reverse Proxy]
  N --> A[Next.js App Container]
  A --> P[(PostgreSQL on NVMe)]
  A --> R[(Redis)]
  P --> B[/mnt/hdd/backups]
  A --> L[/mnt/hdd/logs]
```

## Политика хранилищ
- NVMe: контейнеры, Postgres data, активная БД.
- HDD: бэкапы, архив логов, медиа.
