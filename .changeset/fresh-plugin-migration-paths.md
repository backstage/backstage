---
'@backstage/plugin-app-backend': patch
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
'@backstage/plugin-events-backend': patch
'@backstage/plugin-notifications-backend': patch
'@backstage/plugin-notifications-backend-module-slack': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-scaffolder-backend-module-workspace-database': patch
'@backstage/plugin-search-backend-module-pg': patch
'@backstage/plugin-user-settings-backend': patch
---

Backend plugins now locate their database migrations relative to their own package directory, without requiring the package to be resolvable by name.
