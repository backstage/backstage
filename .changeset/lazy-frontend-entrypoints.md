---
'@backstage/plugin-app': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-import': patch
'@backstage/plugin-catalog-unprocessed-entities': patch
'@backstage/plugin-devtools': patch
'@backstage/plugin-home': patch
'@backstage/plugin-search': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-user-settings': patch
---

Reduced the initial app bundle size by loading page and optional UI implementations only when their extensions render.
