---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Added optional `accountId` config to `search.elasticsearch` for resolving account-specific AWS credentials, enabling support for `webIdentityTokenFile` and `accountDefaults` when using AWS OpenSearch.
