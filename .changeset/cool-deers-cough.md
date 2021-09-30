---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': patch
---

Introduce a new `StarredEntitiesApi` that is used in the `useStarredEntities` hook.
The `@backstage/plugin-catalog` installs a default implementation that is backed by the `StorageApi`, but one can also override the `starredEntitiesApiRef`.
