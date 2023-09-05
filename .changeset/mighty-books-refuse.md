---
'@backstage/core-app-api': major
'@backstage/core-components': minor
'@backstage/catalog-model': minor
'@backstage/plugin-catalog-graph': minor
'@backstage/plugin-lighthouse': minor
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-org-react': minor
'@backstage/plugin-playlist': minor
---

Redfines definition of BackstageRouteObject to comply with how React Router works in React 18. Additionally, narrows types where necessary to further comply with types in React 18. Namely, `any` is made explicit, and cases where types could be various values at runtime are now handled internally.
