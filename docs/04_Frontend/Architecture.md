# Frontend Architecture

## Слои
- `app/*`: страницы и layout.
- `components/*`: визуальные блоки.
- `lib/services/*`: доступ к данным и бизнес-операции.

## Data fetching
- TanStack Query в client components.
- SSR/Server components для критичных экранов.

## Error handling
- `app/error.tsx` для глобального fallback.
- Endpoint-level messages через единый API контракт.
