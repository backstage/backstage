---
'@backstage/backend-common': patch
'@backstage/backend-dynamic-feature-service': patch
'@backstage/plugin-app-backend': patch
'@backstage/plugin-catalog-backend-module-aws': patch
'@backstage/plugin-catalog-backend-module-azure': patch
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
'@backstage/plugin-catalog-backend-module-bitbucket-server': patch
'@backstage/plugin-catalog-backend-module-gerrit': patch
'@backstage/plugin-catalog-backend-module-github': patch
'@backstage/plugin-catalog-backend-module-gitlab': patch
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
'@backstage/plugin-catalog-backend-module-msgraph': patch
'@backstage/plugin-catalog-backend-module-puppetdb': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-events-backend-module-aws-sqs': patch
'@backstage/plugin-events-backend-module-azure': patch
'@backstage/plugin-events-backend-module-bitbucket-cloud': patch
'@backstage/plugin-events-backend-module-gerrit': patch
'@backstage/plugin-events-backend-module-github': patch
'@backstage/plugin-events-backend-module-gitlab': patch
'@backstage/plugin-events-backend': patch
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-permission-backend': patch
'@backstage/plugin-proxy-backend': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-search-backend-module-catalog': patch
'@backstage/plugin-search-backend-module-elasticsearch': patch
'@backstage/plugin-search-backend-module-explore': patch
'@backstage/plugin-search-backend-module-pg': patch
'@backstage/plugin-search-backend-module-techdocs': patch
'@backstage/plugin-search-backend': patch
'@backstage/plugin-techdocs-backend': patch
'@backstage/plugin-user-settings-backend': patch
---

Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
