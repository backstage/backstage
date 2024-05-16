---
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
'@backstage/plugin-scaffolder-node-test-utils': patch
'@backstage/plugin-search-backend-module-elasticsearch': patch
'@backstage/plugin-search-backend-module-pg': patch
'@backstage/plugin-search-backend-node': patch
'@backstage/plugin-signals-backend': patch
'@backstage/plugin-events-node': patch
---

Replace the usage of `getVoidLogger` with `mockServices.logger.mock` in order to remove the dependency with the soon-to-deprecate `backend-common` package.
