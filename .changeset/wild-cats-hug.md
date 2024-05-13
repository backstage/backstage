---
'@backstage/plugin-catalog-backend-module-github': patch
---

Added `alwaysUseDefaultNamespace` option to `GithubMultiOrgEntityProvider`.

If set to true, the provider will use `default` as the namespace for all group entities. Groups with the same name across different orgs will be considered the same group.
