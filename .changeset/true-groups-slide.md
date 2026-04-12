---
'@backstage/plugin-catalog-backend-module-github': patch
---

Added automatic retry on temporary errors (like 5XX) to the shared GitHub GraphQL client used by `GithubOrgEntityProvider` and replaced the GraphQL client in `GithubEntityProvider` by this one as well, improving resilience against intermittent GitHub API failures.
