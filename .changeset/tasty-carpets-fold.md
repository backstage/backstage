---
'@backstage/plugin-catalog-react': minor
---

**BREAKING**: Removed the `useEntityKinds` hook, use `catalogApi.getEntityFacets({ facets: ['kind'] })` instead.
