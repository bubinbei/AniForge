# Roadmap Diagram

```mermaid
gantt
  title AniForge Product Roadmap
  dateFormat  YYYY-MM-DD
  section Phase 1 MVP
  Core Architecture           :a1, 2026-03-01, 14d
  Auth + Catalog + Lists      :a2, after a1, 14d
  Admin + Docker + Docs       :a3, after a2, 10d
  section Phase 2 Expansion
  AI Recommendations v1       :b1, after a3, 14d
  Gamification                :b2, after b1, 10d
  section Phase 3 Startup
  Billing Mock -> Stripe      :c1, after b2, 14d
  Redis + Metrics + Scaling   :c2, after c1, 14d
```
