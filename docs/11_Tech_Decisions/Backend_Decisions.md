# Backend Decisions

## 1) Route Handlers в Next.js
### Почему выбрали
- Единый кодовый контур с frontend.
- Быстрый MVP цикл: UI -> API -> DB в одном репозитории.

### Почему не иначе
- Отдельный backend сервис дает гибкость, но добавляет DevOps/CI/CD overhead на раннем этапе.

### Документация
- https://nextjs.org/docs/app/building-your-application/routing/route-handlers

## 2) Prisma + PostgreSQL
### Почему выбрали
- Типобезопасные запросы, миграции, хорошая DX.
- PostgreSQL стабилен и предсказуем для SaaS-сценариев.

### Почему не иначе
- NoSQL ускоряет отдельные сценарии, но текущая доменная модель хорошо ложится на реляционную БД.

### Документация
- https://www.prisma.io/docs/orm/prisma-client
- https://www.prisma.io/docs/orm/prisma-migrate
- https://www.postgresql.org/docs/

## 3) Сервисный слой
### Почему выбрали
- Бизнес-правила (например, free limit) не должны размазываться по UI/API.
- Упрощает покрытие unit-тестами.

### Почему не иначе
- Логика только в route handlers быстро ведет к дублированию и тяжело рефакторится.

## 4) Zod валидация
### Почему выбрали
- Явные контракты входных данных.
- Раннее и единообразное отлавливание ошибок.

### Документация
- https://zod.dev/

## Связанные заметки
- [[05_Backend/API_Structure]]
- [[05_Backend/DB_Schema]]
- [[10_Progress/As_Built_Status]]
