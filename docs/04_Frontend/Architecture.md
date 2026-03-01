# Frontend Architecture (As-Built)

## Архитектурные принципы
- App Router как основа маршрутизации.
- UI-слой отделен от бизнес-логики.
- Данные: React Query в client-компонентах, server rendering там, где это уместно.
- Компоненты разделены на `ui`, `shared`, `anime`.

## Фактическая структура
- `app/(public)/*`: landing/login/register
- `app/(app)/*`: catalog/anime/[id]/my-list/profile/admin
- `app/api/*`: route handlers
- `components/ui/*`: базовые примитивы
- `components/shared/*`: layout/navigation
- `components/anime/*`: доменные блоки

## Ключевые реализованные компоненты
- `AnimeCard`, `SearchBar`, `FiltersPanel`, `Pagination`
- `AnimeListActions` (добавление/редактирование листа с detail page)
- `RecommendationsPanel` (UI для AI recommendations v1)
- `Sidebar`, `Header`, `Skeleton`

## Data flow
1. UI вызывает endpoint через `fetch`/React Query.
2. API возвращает единый формат `{ success, data/meta }`.
3. На мутациях вызывается `invalidateQueries` для актуализации UI.

## Состояния и UX
- Loading: skeleton/текстовые индикаторы.
- Empty: явные сообщения "Пусто/Ничего не найдено".
- Error: текстовые ошибки из API.

## Что уже хорошо
- Базовый сценарий user list полностью работает через UI.
- Typed routes в Next включены и учтены в компонентах навигации.
- Страницы профиля и каталога пригодны для демо.

## Технический долг / улучшения
- Внедрить toast notifications (вместо локальных текстовых сообщений).
- Унифицировать API client wrapper в `lib/utils`.
- Улучшить accessibility форм и кнопок.
- Перейти на `next/image` после нормализации источников картинок.
