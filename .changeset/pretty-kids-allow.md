---
'@backstage/plugin-catalog-backend-module-github': patch
---

Added configurable pageSizes for GitHub GraphQL API queries to prevent RESOURCE_LIMITS_EXCEEDED errors with organizations with large number of teams, members and repositories. Default page sizes reduced by 50% to improve stability.
