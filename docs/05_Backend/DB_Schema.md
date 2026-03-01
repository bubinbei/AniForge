# DB Schema

## Ключевые модели
- User
- Anime
- Genre / AnimeGenre
- UserAnimeList
- Subscription
- Achievement / UserAchievement
- AuditLog

## Индексы
- `Anime(title, releaseYear, avgRating)`
- `UserAnimeList(userId, animeId) unique`
- `Subscription(userId, status)`

## Ограничения
- Free plan limit: 10 items.
- Rating: 1-10.
- Role-based admin actions.
