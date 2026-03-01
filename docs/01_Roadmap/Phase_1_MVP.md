# Phase 1 — MVP (As-Built)

## Цель фазы
Собрать рабочее ядро AniForge, которое можно развернуть и показать как end-to-end продукт: авторизация, каталог, личные списки, админка, базовый self-host контур.

## Scope и фактический статус
- [x] Auth (Credentials)
- [x] Google OAuth (prepared-by-env, включается переменными)
- [x] Профиль пользователя `/profile`
- [x] Защита приватных роутов через middleware + server guards
- [x] Catalog: list/detail/search/filters/pagination
- [x] User list: add/update/delete + rating
- [x] Ограничение free plan (10 тайтлов)
- [x] Admin CRUD (минимальный)
- [x] Health endpoint `/api/health`
- [x] Dockerfile + docker-compose + nginx config
- [x] Backup/restore scripts
- [x] Obsidian docs vault

## Микро-таски (детализация)
### Data/Prisma
- [x] Схема БД для User/Anime/Genre/List/Subscription/Achievements/AuditLog
- [x] Индексы под поиск и основные фильтры
- [x] Seed 30+ демо тайтлов + жанры
- [x] Назначение первого admin через `ADMIN_EMAIL`

### Backend API
- [x] Единый формат успех/ошибка
- [x] Zod валидация для auth/anime/list
- [x] RBAC checks для admin-операций
- [x] Логика FREE лимита в сервисном слое

### Frontend
- [x] Landing, login, register, catalog, anime detail, my-list, profile, admin
- [x] Sidebar + Header + Skeletons
- [x] CRUD list операций в UI
- [x] Inline editing статуса/оценки в `/my-list`

### DevOps
- [x] multi-stage Dockerfile
- [x] compose стек: app/postgres/redis/nginx
- [x] healthchecks и restart policy
- [x] backup/restore shell scripts
- [x] README self-host инструкция

## Acceptance Criteria (проверка)
- [x] Регистрация -> вход -> каталог -> добавить тайтл -> профиль
- [x] Админ может создать и удалить тайтл
- [x] `/api/health` возвращает 200
- [x] `pnpm build` проходит

## Ограничения текущей реализации
- Локальная проверка полного docker smoke в текущем окружении может быть недоступна (если нет Docker).
- UI уведомления реализованы текстом, без выделенной toast-системы.
- Stripe/billing не входит в Phase 1.

## Definition of Done для Phase 1
Phase 1 считается завершенной, когда локально/на сервере подтвержден сценарий:
1. Поднята БД и seed.
2. Пользователь проходит основной user flow.
3. Админ проходит CRUD flow.
4. Health и backup script работают.
