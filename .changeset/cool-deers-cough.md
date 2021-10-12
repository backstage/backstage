---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': patch
---

Introduce a new `StarredEntitiesApi` that is used in the `useStarredEntities` hook.
The `@backstage/plugin-catalog` installs a default implementation that is backed by the `StorageApi`, but one can also override the `starredEntitiesApiRef`.

**BREAKING** All previously stored entities get lost with this update, because the storage format has been migrated from a custom string to an entity reference.
