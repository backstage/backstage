---
'@backstage/integration': patch
'@backstage/plugin-techdocs-node': patch
---

Fixed the method `resolveEditUrl` of `BitbucketServerIntegration` to return the entire url instead of cutting the query parameters
