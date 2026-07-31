---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-search': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-techdocs': patch
---

Navigation to absolute paths and to pages in other plugins now goes through the app history when one is available, and falls back to React Router when it is not, so the same plugin code works under scoped plugin routing as well as in the old frontend system.
