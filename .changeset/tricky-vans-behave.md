---
'@backstage/backend-openapi-utils': patch
---

Adds a new function `wrapInOpenApiTestServer` that allows for proxied requests at runtime. This will support the new `yarn backstage-repo-tools schema openapi test` command.
