# Frontend Decisions

## 1) Next.js App Router
### Почему выбрали
- Единая платформа для страниц, API route handlers и server components.
- Упрощает архитектуру MVP (меньше сервисов, меньше деплой-сложности).
- Удобный путь роста к более сложной SSR/ISR стратегии.

### Почему не иначе
- Отдельный SPA + отдельный backend: больше интеграционной нагрузки на старте.
- Vite-only SPA: хорошо для pure frontend, но хуже для fullstack-модели текущего проекта.

### Документация
- https://nextjs.org/docs/app
- https://nextjs.org/docs/app/building-your-application/routing

## 2) TypeScript strict mode
### Почему выбрали
- Раннее обнаружение ошибок на compile-time.
- Повышение надежности API контрактов и сервисного слоя.

### Почему не иначе
- JS-only ускоряет старт, но резко повышает риск регрессий по мере роста.

### Документация
- https://www.typescriptlang.org/docs/handbook/intro.html
- https://www.typescriptlang.org/tsconfig#strict

## 3) Tailwind + shadcn/ui
### Почему выбрали
- Быстрый UI delivery без жесткой привязки к готовой design system.
- Компоненты shadcn контролируются в репозитории (можно кастомизировать без vendor lock-in).

### Почему не иначе
- Готовые heavy UI kits ускоряют прототип, но часто мешают долгосрочной кастомизации.

### Документация
- https://tailwindcss.com/docs
- https://ui.shadcn.com/docs

## 4) TanStack Query
### Почему выбрали
- Прозрачная модель кэша, invalidation и статусов запросов.
- Отлично подходит для list mutations/refresh сценариев.

### Почему не иначе
- Ручной fetch state management в масштабе становится хрупким и шумным.

### Документация
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://tanstack.com/query/latest/docs/framework/react/guides/queries

## Связанные заметки
- [[04_Frontend/Architecture]]
- [[04_Frontend/Refactoring]]
- [[11_Tech_Decisions/Stack_Overview]]
