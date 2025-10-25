---
'@backstage/plugin-catalog-backend-module-github': patch
---

Added configurable `pageSizes` for GitHub GraphQL API queries to prevent `RESOURCE_LIMITS_EXCEEDED` errors with organizations with large number of repositories. Please see the [GitHub Discovery documentation](https://backstage.io/docs/integrations/github/discovery#configuration) for new configuration options.
