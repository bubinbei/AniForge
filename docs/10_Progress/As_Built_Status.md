# As-Built Status

Дата обновления: 2026-03-01

## Что уже сделано (фактически)

### Core MVP
- Next.js 14 App Router проект собран.
- Prisma schema + seed добавлены.
- Auth: credentials + prepared Google OAuth.
- Каталог: list/detail/filter/search/pagination.
- User list: add/update/delete + rating + free limit.
- Admin: базовый CRUD для anime.
- Health endpoint: `/api/health`.

### Smart (частично)
- Recommendations v1 endpoint реализован.
- Explainability строка реализована.
- Recommendations UI в профиле реализован.

### DevOps
- Dockerfile + compose + nginx + scripts (backup/restore).
- README self-host инструкция есть.

### Docs
- Полный Obsidian vault в репозитории.
- Обновленные as-built документы по frontend/backend/devops/ai.

## Что протестировано
- `pnpm build` проходит.
- Основные API/страницы собираются без type ошибок.

## Что еще не закрыто
- XP/levels/achievements (геймификация) — не реализовано.
- Stripe/mock billing — не реализовано.
- Redis rate limit/cache как активная логика — не реализовано.
- Полноценный e2e test suite — не реализован.

## Приоритеты next
1. Геймификация: сервис XP + endpoint hooks + UI индикаторы.
2. Улучшение рекомендаций v1 (diversity + penalties).
3. Тестирование: unit для сервисов и validators.
4. Операционный smoke-runbook + restore drill.

## Связанные заметки
- [[01_Roadmap/Phase_1_MVP]]
- [[01_Roadmap/Phase_2_Expansion]]
- [[04_Frontend/Architecture]]
- [[05_Backend/API_Structure]]
- [[06_AI/Recommendation_Logic]]
- [[07_DevOps/Docker]]
