# Stack Overview

## Критерии выбора стека
- Быстрый запуск MVP без сложной инфраструктуры.
- Возможность эволюции к SaaS.
- Self-host сценарий на домашнем сервере.
- Низкая стоимость поддержки для одного разработчика.

## Выбранный стек
- Frontend/API: Next.js 14 (App Router), React, TypeScript
- Styling/UI: Tailwind CSS + shadcn/ui
- Data: PostgreSQL + Prisma
- Auth: NextAuth (Credentials + Google prepared-by-env)
- Query/cache: TanStack Query
- Infra: Docker Compose + Nginx + (подготовленный) Redis

## Почему не иначе (коротко)
- Не разделяли backend в отдельный сервис на MVP: меньше latency и быстрее итерации.
- Не брали тяжелый UI framework: нужен контролируемый и быстрый UI слой.
- Не брали ORM с ручным SQL-only подходом: Prisma дает скорость разработки и типобезопасность.

## Официальная документация
- Next.js: https://nextjs.org/docs
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/docs
- Prisma: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs/
- NextAuth: https://authjs.dev/
- TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview
- Docker Compose: https://docs.docker.com/compose/
- Nginx: https://nginx.org/en/docs/

## Связанные заметки
- [[11_Tech_Decisions/Frontend_Decisions]]
- [[11_Tech_Decisions/Auth_Decisions]]
- [[11_Tech_Decisions/Backend_Decisions]]
- [[11_Tech_Decisions/DevOps_Decisions]]
