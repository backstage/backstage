---
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
---

The Bitbucket Cloud entity provider now finds catalog files with the workspace code search API of Bitbucket Cloud, because Bitbucket Cloud removes the old code search API on 2026-11-15. The provider finds the same locations for the same configuration.

The new API needs a credential that identifies a user, for example an Atlassian account email as `username` with an API `token`. The token needs the scopes `read:repository:bitbucket` and `read:workspace:bitbucket`. The old API did not need `read:workspace:bitbucket`. Bitbucket Cloud rejects app passwords for this API, so if your integration uses `appPassword`, change it to an API token.
