---
'@backstage/plugin-catalog-backend-module-github': patch
---

Added configurable `pageSizes` option to `GithubOrgEntityProvider` for GitHub GraphQL API queries to prevent `RESOURCE_LIMITS_EXCEEDED` errors with organizations with large number of teams and members. This aligns the configuration options with `GithubMultiOrgEntityProvider`.
