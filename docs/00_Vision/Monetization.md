# Monetization

## Модель
- Free: до 10 тайтлов суммарно во всех списках.
- Premium: без лимитов + advanced filters + расширенная аналитика.

## Почему так
- Free дает полноценный вход в продукт и демонстрирует ценность tracking/discovery.
- Ограничение в 10 тайтлов создает естественный триггер для апгрейда у активных пользователей.
- Premium фокусируется на power-user сценариях, а не на блокировке базовых функций.

## Этапы внедрения
1. Phase 1: hardcoded plan rules, без платежей.
2. Phase 3 (mock): имитация billing lifecycle.
3. Phase 3 (real): Stripe Checkout + webhooks + статус подписки по событиям.

## KPI монетизации
- Free -> Premium conversion.
- Churn rate.
- ARPPU.

## Связанные заметки
- [[01_Roadmap/Phase_3_Startup]]
- [[11_Tech_Decisions/Backend_Decisions]]
- [[10_Progress/As_Built_Status]]
