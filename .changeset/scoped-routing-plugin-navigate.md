---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-search': patch
'@backstage/plugin-techdocs': patch
---

Navigation to absolute paths and to pages in other plugins now goes through the app's own navigation where one is available, and falls back to React Router where it is not. The same plugin code therefore works under scoped plugin routing as well as in the old frontend system.
