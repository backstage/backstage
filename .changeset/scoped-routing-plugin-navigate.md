---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-search': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-techdocs': patch
---

Absolute and cross-plugin navigations now use framework navigation when a navigation controller is present and fall back to React Router when it is not, so the same plugin code works under scoped plugin routing and the old frontend system.
