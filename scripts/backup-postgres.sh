#!/usr/bin/env sh
set -eu

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="${BACKUP_DIR:-/mnt/hdd/backups/aniforge}"

mkdir -p "$BACKUP_DIR"

docker compose exec -T postgres pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" | gzip > "$BACKUP_DIR/aniforge_${TIMESTAMP}.sql.gz"

find "$BACKUP_DIR" -type f -name "aniforge_*.sql.gz" -mtime +14 -delete

echo "Backup created: $BACKUP_DIR/aniforge_${TIMESTAMP}.sql.gz"
