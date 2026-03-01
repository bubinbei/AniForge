# Recommendation Logic (Implemented v1)

## Статус
- [x] Endpoint реализован: `/api/recommendations`
- [x] Вывод reasons для каждой рекомендации
- [x] UI блок в профиле (`RecommendationsPanel`)

## Какие сигналы используются
- Пользовательские оценки (`rating`) и статусы (`WATCHING/COMPLETED/...`)
- Жанры тайтлов из списка пользователя
- `avgRating` и `popularityScore` кандидатов

## Алгоритм v1
1. Собрать список пользователя.
2. Посчитать веса жанров:
   - выше вес у тайтлов с высокими оценками,
   - дополнительный вес для `COMPLETED`.
3. Исключить уже добавленные тайтлы.
4. Найти кандидатов по пересечению с любимыми жанрами.
5. Посчитать score кандидата:
   - genre relevance
   - avg rating
   - popularity
6. Сформировать explainability строку.
7. Вернуть:
   - `recommendations` (top 12)
   - `dailyPicks` (top 3)
   - `profileSignals`

## Формула score (текущая)
`totalScore = genreScore * 1.5 + ratingScore * 1.2 + popularityScore * 0.5`

## Ограничения
- Нет ML/embeddings.
- Нет негативных сигналов (дропы пока не штрафуют отдельно).
- Нет diversity penalty (можно показывать близкие по жанрам результаты).

## Следующая итерация
- Penalize `DROPPED` жанры.
- Добавить "новизну" и diversity.
- Собирать CTR рекомендаций для дальнейшей калибровки.

## Связанные заметки
- [[06_AI/Future_ML]]
- [[05_Backend/API_Structure]]
- [[04_Frontend/Architecture]]
- [[10_Progress/As_Built_Status]]
