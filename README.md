# AniForge

AniForge — AI-powered anime discovery & tracking платформа (MVP + roadmap до SaaS).

## Текущий стек
- Next.js 14 (App Router), React, TypeScript, Tailwind, shadcn/ui
- NextAuth (Credentials + Google prepared-by-env)
- PostgreSQL + Prisma
- Redis (подготовка под кэш/rate-limit)
- Nginx reverse proxy
- Docker Compose для self-host

## Быстрый запуск локально

```bash
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
```

Проверка health:
- `GET http://localhost:3000/api/health`

## Запуск через Docker Compose

```bash
cp .env.example .env
docker compose up -d --build
```

Проверка:
- `docker compose ps`
- `curl http://localhost/api/health`

## .env (минимум)
Смотри `.env.example`. Критично заполнить:
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `DATABASE_URL` (для локального запуска без docker)
- `ADMIN_EMAIL` (для seed-назначения admin)

## Self-host в Proxmox (рекомендуемый baseline)

### 1. VM
- Ubuntu Server 24.04 LTS
- 2-4 vCPU, 6-8GB RAM, диск NVMe под систему/контейнеры
- Примонтированный HDD в `/mnt/hdd`

### 2. Установка Docker
```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

### 3. Подготовка директорий
```bash
sudo mkdir -p /mnt/nvme/aniforge/postgres
sudo mkdir -p /mnt/nvme/aniforge/redis
sudo mkdir -p /mnt/hdd/backups/aniforge
sudo mkdir -p /mnt/hdd/logs/aniforge-nginx
sudo chown -R $USER:$USER /mnt/nvme/aniforge /mnt/hdd/backups/aniforge /mnt/hdd/logs/aniforge-nginx
```

### 4. Настройка env
Заполни `.env` и укажи пути:
- `NVME_POSTGRES_DATA=/mnt/nvme/aniforge/postgres`
- `NVME_REDIS_DATA=/mnt/nvme/aniforge/redis`
- `HDD_BACKUPS_DIR=/mnt/hdd/backups/aniforge`
- `HDD_LOGS_DIR=/mnt/hdd/logs/aniforge-nginx`

### 5. Запуск
```bash
docker compose up -d --build
```

## SSL/домен
Варианты:
- Оставить Nginx как есть и поставить внешний Caddy/Traefik с Let's Encrypt.
- Или настроить SSL прямо в Nginx (certbot).

## Backup strategy

### Ручной backup
```bash
export POSTGRES_USER=aniforge
export POSTGRES_DB=aniforge
./scripts/backup-postgres.sh
```

### Restore
```bash
export POSTGRES_USER=aniforge
export POSTGRES_DB=aniforge
./scripts/restore-postgres.sh /mnt/hdd/backups/aniforge/aniforge_YYYY-MM-DD_HH-MM-SS.sql.gz
```

### Cron (ежедневно в 03:00)
```bash
0 3 * * * cd /opt/aniforge && POSTGRES_USER=aniforge POSTGRES_DB=aniforge BACKUP_DIR=/mnt/hdd/backups/aniforge ./scripts/backup-postgres.sh >> /mnt/hdd/logs/aniforge-backup.log 2>&1
```

## Важные заметки
- Комментарии в коде и документация на русском.
- Имена файлов/переменных в коде на английском.
- Основной чеклист: `docs/01_Roadmap/Phase_1_MVP.md`.
