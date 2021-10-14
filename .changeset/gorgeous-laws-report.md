---
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-scaffolder': patch
---

Introduce a `useStarredEntity` hook to check if a single entity is starred.
It provides a more efficient implementation compared to the `useStarredEntities` hook, because the rendering is only triggered if the selected entity is starred, not if _any_ entity is starred.
