---
'@backstage/backend-defaults': patch
'@backstage/backend-test-utils': patch
'@backstage/cli-module-new': patch
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-auth-backend-module-cloudflare-access-provider': patch
'@backstage/plugin-auth-node': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-backend-module-aws': patch
'@backstage/plugin-catalog-backend-module-azure': patch
'@backstage/plugin-catalog-backend-module-backstage-openapi': patch
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
'@backstage/plugin-catalog-backend-module-bitbucket-server': patch
'@backstage/plugin-catalog-backend-module-gerrit': patch
'@backstage/plugin-catalog-backend-module-gitea': patch
'@backstage/plugin-catalog-backend-module-github': patch
'@backstage/plugin-catalog-backend-module-gitlab': patch
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
'@backstage/plugin-catalog-backend-module-ldap': patch
'@backstage/plugin-catalog-backend-module-msgraph': patch
'@backstage/plugin-catalog-backend-module-puppetdb': patch
'@backstage/plugin-notifications-backend': patch
'@backstage/plugin-permission-common': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-search-backend-module-elasticsearch': patch
'@backstage/plugin-search-backend-module-pg': patch
'@backstage/plugin-search-backend-node': patch
'@backstage/plugin-search-react': patch
'@backstage/plugin-signals': patch
'@backstage/plugin-signals-backend': patch
---

Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
