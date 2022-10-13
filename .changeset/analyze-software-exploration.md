---
'@backstage/plugin-catalog-react': patch
---

Both `EntityProvider` and `AsyncEntityProvider` contexts now wrap all children with an `AnalyticsContext` containing the corresponding `entityRef`; this opens up the possibility for all events underneath these contexts to be associated with and aggregated by the corresponding entity.
