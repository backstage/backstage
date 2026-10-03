---
'@backstage/plugin-catalog-backend-module-github': patch
---

The GitHub multi-org catalog provider now uses the shared GraphQL client with throttling and retries, matching the single-org provider. Large `githubOrg` syncs are less likely to fail on secondary rate limits or transient GitHub 5xx errors.
