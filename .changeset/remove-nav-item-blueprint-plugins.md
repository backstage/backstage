---
'@backstage/plugin-catalog': patch
'@backstage/plugin-search': patch
'@backstage/plugin-home': patch
'@backstage/plugin-api-docs': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-user-settings': patch
'@backstage/plugin-devtools': patch
'@backstage/plugin-catalog-unprocessed-entities': patch
'@backstage/plugin-app-visualizer': patch
---

Removed separate nav item extensions. Sidebar entries are now provided via `title` and `icon` on each plugin's page extension.
