# User Flow

```mermaid
flowchart LR
  A[Landing] --> B[Register/Login]
  B --> C[Catalog]
  C --> D[Anime Detail]
  D --> E[Add to My List]
  E --> F[Profile]
  F --> G[Recommendations]
```

## Ключевые пути
- Guest: Landing -> Catalog.
- New user: Register -> Catalog -> Add first title.
- Returning user: Login -> My List -> Continue watching.
