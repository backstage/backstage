---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': patch
---

Introduce a new `StarredEntitiesApi` that is used in the `useStarredEntities` hook.
The `@backstage/plugin-catalog` installs a default implementation that is backed by the `StorageApi`, but one can also override the `starredEntitiesApiRef`.

This change also updates the storage format from a custom string to an entity reference and moves the location in the local storage.
A migration will convert the previously starred entities to the location on the first load of Backstage.
