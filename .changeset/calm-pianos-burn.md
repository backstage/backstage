---
'@backstage/plugin-catalog-react': patch
---

Added two new `EntityRefLinks` props, the first being `getTitle` that allows for customization of the title used for each link. The second one is `fetchEntities`, which triggers a fetching of all entities so that the full entity definition is available in the `getTitle` callback.
