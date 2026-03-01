# Phase 1 — MVP

## Scope
- Auth (Credentials + Google prepared-by-env).
- Anime catalog: list/detail/search/filters/pagination.
- User list: CRUD + rating + free limit.
- Admin: minimal CRUD anime.
- Docker compose + nginx + healthcheck.

## Микро-таски
- [ ] Базовые сущности Prisma + миграция.
- [ ] Seed 30-50 аниме + жанры.
- [ ] API контракты и валидация Zod.
- [ ] UI страницы и пустые состояния.
- [ ] Middleware guards.
- [ ] README self-host setup.

## Acceptance
- Пользователь регистрируется, логинится, добавляет тайтл.
- Админ может создать и удалить тайтл.
- `/api/health` отдает 200.
