---
'@backstage/plugin-catalog-backend-module-github': patch
---

Use schedule from config at backend module.

Also, it removes `GithubEntityProviderCatalogModuleOptions`
in favor of config-only for the backend module setup
like at other similar modules.
