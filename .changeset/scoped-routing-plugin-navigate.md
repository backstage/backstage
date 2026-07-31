---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-search': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-techdocs': patch
---

Absolute and cross-plugin navigation now uses framework navigation when an app history is present and falls back to React Router when it is not, so the same plugin code works under scoped plugin routing and the old frontend system.
