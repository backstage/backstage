---
'@backstage/plugin-cost-insights': minor
---

Add support for multiple types of entity cost breakdown.

This change is backwards-incompatible with plugin-cost-insights 0.3.x; the `entities` field on Entity returned in product cost queries changed from `Entity[]` to `Record<string, Entity[]`.
