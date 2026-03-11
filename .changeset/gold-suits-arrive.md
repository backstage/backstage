---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': patch
---

Fixed a bug in the catalog table where the header showed an incorrect count when the Starred, Owned, or All filter was active and multiple entities shared the same name across different namespaces. The header count now stays in sync with the sidebar count.

`useStarredEntitiesCount`, `useOwnedEntitiesCount`, and `useAllEntitiesCount` are now exported as public API from `@backstage/plugin-catalog-react`, making it easier to keep counts consistent in custom catalog UI components.
