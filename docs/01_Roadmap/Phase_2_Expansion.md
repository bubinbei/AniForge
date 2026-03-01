# Phase 2 — Expansion (As-Built Progress)

## Scope
- AI recommendations v1 (без ML, rule-based).
- Daily picks endpoint.
- XP, уровни, achievements.

## Статус на текущий момент
- [x] Recommendation service с explainability.
- [x] `GET /api/recommendations` + UI блок в профиле.
- [~] Начисление XP за list-события (foundation готов).
- [~] Базовые achievements seeded и выдаются по событиям.
- [ ] Отдельный UI прогресса достижений (список/бейджи).

## Микро-таски
### Recommendations
- [x] Скоринг по жанрам + рейтингам + popularity.
- [x] Исключение уже добавленных тайтлов.
- [x] Текст "почему рекомендовано".
- [x] Daily picks.

### Gamification
- [x] User `xp` и `level` в модели.
- [x] Сервис начисления XP и авто-unlock базовых achievements.
- [x] XP/уровень/кол-во достижений отображаются в профиле.
- [ ] Экран достижений с визуальным прогрессом.
- [ ] Лента событий (что именно дало XP).

## Риски
- Холодный старт пользователя для рекомендаций.
- Переусложнение правил геймификации без аналитики.

## Definition of Done (Phase 2)
1. Рекомендации показываются персонально и объяснимо.
2. XP/уровни/ачивки начисляются автоматически в ключевых сценариях.
3. Пользователь видит свой прогресс в UI.

## Связанные заметки
- [[06_AI/Recommendation_Logic]]
- [[10_Progress/As_Built_Status]]
- [[11_Tech_Decisions/Backend_Decisions]]
