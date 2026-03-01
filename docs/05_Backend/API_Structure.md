# API Structure (As-Built)

## Базовый контракт
- Success:
```json
{ "success": true, "data": {}, "meta": {} }
```
- Error:
```json
{ "success": false, "error": { "code": "...", "message": "...", "details": {} } }
```

## Реализованные endpoints

### Health
- `GET /api/health`
- Ответ: status/uptime/timestamp

### Auth
- `POST /api/auth/register`
- `GET|POST /api/auth/[...nextauth]`

### Profile
- `GET /api/me`

### Anime catalog
- `GET /api/anime`
  - query: `page`, `pageSize`, `search`, `genre`, `yearFrom`, `yearTo`, `minRating`
- `POST /api/anime` (admin)
- `GET /api/anime/:id`
- `PATCH /api/anime/:id` (admin)
- `DELETE /api/anime/:id` (admin)

### User list
- `GET /api/list`
- `POST /api/list/:animeId`
  - body: `{ status, rating? }`
- `DELETE /api/list/:animeId`

### Recommendations
- `GET /api/recommendations`
- Возвращает:
  - `recommendations[]` (scored)
  - `dailyPicks[]`
  - `profileSignals.favoriteGenres`
  - `profileSignals.topRatedTitles`

## Безопасность
- Middleware защищает `/profile`, `/my-list`, `/admin`.
- Server guard `requireAdmin` на admin мутациях.
- Zod валидация входных данных.

## Ограничения FREE плана
- Лимит: не более 10 тайтлов суммарно во всех статусах.
- Реализация: проверка в `lib/services/list-service.ts`.

## Типовые коды ошибок
- `UNAUTHORIZED`
- `FORBIDDEN`
- `VALIDATION_ERROR`
- `FREE_PLAN_LIMIT`
- `NOT_FOUND`
- `INTERNAL_ERROR`

## Следующие улучшения
- Единый error mapper middleware/helper.
- Rate limiting (redis-backed) для write endpoints.
- OpenAPI-спецификация в docs.

## Связанные заметки
- [[05_Backend/DB_Schema]]
- [[05_Backend/Tasks]]
- [[06_AI/Recommendation_Logic]]
- [[07_DevOps/Docker]]
