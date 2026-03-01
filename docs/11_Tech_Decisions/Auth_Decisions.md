# Auth Decisions

## 1) NextAuth (Auth.js)
### Почему выбрали
- Готовая интеграция с Next.js.
- Поддержка Credentials и OAuth провайдеров.
- Гибкие callback-и для user role/plan в сессии.

### Почему не иначе
- Кастом auth с нуля на MVP — высокий security риск и больше времени на поддержку.

### Документация
- https://authjs.dev/getting-started
- https://authjs.dev/reference/nextjs

## 2) Credentials + Google prepared-by-env
### Почему выбрали
- Credentials покрывают базовый onboarding без внешней зависимости.
- Google можно включить без изменения кода, только через env.

### Почему не иначе
- OAuth-only ухудшает UX для пользователей без нужного провайдера.

### Документация
- https://authjs.dev/getting-started/providers/credentials
- https://authjs.dev/getting-started/providers/google

## 3) Middleware + server guards
### Почему выбрали
- Защита на уровне маршрутов + защита на уровне операций.
- Снижает риск обхода только UI-ограничений.

### Документация
- https://nextjs.org/docs/app/building-your-application/routing/middleware
- https://authjs.dev/guides/protecting-routes

## Связанные заметки
- [[05_Backend/API_Structure]]
- [[01_Roadmap/Phase_1_MVP]]
- [[11_Tech_Decisions/Backend_Decisions]]
