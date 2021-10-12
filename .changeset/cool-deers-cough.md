---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': patch
---

Introduce a new `StarredEntitiesApi` that is used in the `useStarredEntities` hook.
The `@backstage/plugin-catalog` installs a default implementation that is backed by the `StorageApi`, but one can also override the `starredEntitiesApiRef`.

**BREAKING** All previously stored entities get lost with this update, because:

1. The storage format has been migrated from a custom string to an entity reference.
2. The storage key in the local storage has been changed.
