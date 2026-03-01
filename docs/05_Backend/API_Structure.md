# API Structure

## Endpoints
- `GET /api/health`
- `GET/POST /api/anime`
- `GET/PATCH/DELETE /api/anime/:id`
- `GET /api/me`
- `GET /api/list`
- `POST/DELETE /api/list/:animeId`
- `GET /api/recommendations`

## Формат ответа
- Success: `{ success: true, data, meta? }`
- Error: `{ success: false, error: { code, message, details? } }`

## Security
- middleware guards for protected routes.
- server-side admin checks for mutations.
