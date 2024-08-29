---
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
'@backstage/plugin-search-backend-module-techdocs': patch
'@backstage/plugin-search-backend-module-catalog': patch
'@backstage/plugin-search-backend-module-explore': patch
'@backstage/plugin-permission-node': patch
'@backstage/plugin-signals-backend': patch
'@backstage/plugin-auth-backend': patch
---

Internal refactor to remove dependencies on the identity and token manager services, which have been removed. Public APIs no longer require the identity service or token manager to be provided.
