---
'@backstage/plugin-auth-node': patch
---

The `BackstageIdentityResponse` interface now has an optional `expiresInSeconds` field that can be used to signal session expiration. The `prepareBackstageIdentityResponse` utility will now also read the expiration from the provided token, and include it in the response.
