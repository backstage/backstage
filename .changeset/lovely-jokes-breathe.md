---
'@backstage/plugin-search-backend-module-elasticsearch': minor
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-techdocs-backend': minor
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-search-backend': minor
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
'@backstage/plugin-catalog-backend-module-bitbucket-server': patch
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
'@backstage/plugin-events-backend-module-bitbucket-cloud': patch
'@backstage/plugin-catalog-backend-module-msgraph': patch
'@backstage/plugin-search-backend-module-techdocs': patch
'@backstage/plugin-catalog-backend-module-gerrit': patch
'@backstage/plugin-catalog-backend-module-github': patch
'@backstage/plugin-catalog-backend-module-gitlab': patch
'@backstage/plugin-events-backend-module-aws-sqs': patch
'@backstage/plugin-search-backend-module-catalog': patch
'@backstage/plugin-search-backend-module-explore': patch
'@backstage/plugin-catalog-backend-module-azure': patch
'@backstage/plugin-events-backend-module-gerrit': patch
'@backstage/plugin-events-backend-module-azure': patch
'@backstage/plugin-catalog-backend-module-aws': patch
'@backstage/plugin-search-backend-module-pg': patch
'@backstage/plugin-user-settings-backend': patch
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-permission-backend': patch
'@backstage/plugin-events-backend': patch
'@backstage/plugin-proxy-backend': patch
'@backstage/plugin-app-backend': patch
---

The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
