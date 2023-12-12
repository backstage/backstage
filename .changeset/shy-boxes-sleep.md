---
'@backstage/plugin-home': patch
---

StarredEntities component calls `getEntitiesByRefs` instead of `getEntities` to improve performance since we have the `entityRefs`
