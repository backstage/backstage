---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-catalog-import': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-techdocs-react': patch
'@backstage/plugin-techdocs-addons-test-utils': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-scaffolder-react': patch
'@backstage/plugin-search': patch
'@backstage/plugin-search-react': patch
'@backstage/plugin-home': patch
'@backstage/plugin-kubernetes': patch
'@backstage/plugin-kubernetes-cluster': patch
'@backstage/plugin-user-settings': patch
'@backstage/plugin-devtools': patch
'@backstage/plugin-api-docs': patch
'@backstage/plugin-auth': patch
'@backstage/plugin-permission-react': patch
'@backstage/plugin-app-visualizer': patch
'@backstage/plugin-app': patch
'@backstage/ui': patch
---

Migrated routing imports from `react-router-dom` to `@backstage/frontend-plugin-api` and removed `react-router-dom` from peer dependencies.
