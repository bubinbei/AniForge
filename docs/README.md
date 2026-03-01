# AniForge Docs Vault

Документация хранится в формате Obsidian Vault и отражает **фактическое состояние проекта**.

## Где главный чеклист
- Основной контроль выполнения Phase 1: `docs/01_Roadmap/Phase_1_MVP.md`
- Фактический статус реализации: `docs/10_Progress/As_Built_Status.md`
- Текущий спринт: `docs/10_Progress/Sprint_1.md`

## Как читать vault
1. `00_Vision` — продуктовая цель и монетизация.
2. `01_Roadmap` — план фаз + что закрыто.
3. `04_Frontend` / `05_Backend` — инженерная архитектура и контракты.
4. `07_DevOps` — self-host и эксплуатация.
5. `10_Progress` — оперативный статус и принятые решения.

## Быстрый статус (на дату обновления)
- MVP-ядро собрано: auth, catalog, list, admin, health.
- Recommendations v1 реализованы: endpoint + UI блок в профиле.
- Docker/compose/nginx/backup scripts добавлены.
- Следующий блок: gamification (XP/levels/achievements).

## Правила поддержания актуальности
- После каждой заметной фичи обновлять:
  - `docs/10_Progress/As_Built_Status.md`
  - профильный документ (frontend/backend/devops/ai)
  - чеклист фазы (Phase_1/2/3)
- Вносить не только "что сделано", но и ограничения/долги.
