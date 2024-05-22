---
'@backstage/integration': minor
---

Adds an optional `rateLimit` property to `BitbucketServerIntegrationConfig`. When provided the `rateLimit` determines how long to wait in milliseconds
between calls to the Bitbucket Server API.

The default is `undefined`, which means no rate limiting will be applied.
