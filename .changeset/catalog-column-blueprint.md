---
'@backstage/plugin-catalog-react': minor
---

Added `CatalogColumnBlueprint` for creating catalog table column extensions that attach to the catalog page. This enables adopters to customize, reorder, and extend catalog table columns using the existing `app.extensions` mechanism in `app-config.yaml`. The blueprint also supports a `filter` config option using the standard filter predicate format to control column visibility per entity kind.
