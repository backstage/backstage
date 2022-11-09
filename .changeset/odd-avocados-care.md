---
'@backstage/plugin-auth-node': patch
---

Adds an optional parameter to the `IdentityApi#getIdentity`. This change also updates the `DefaultIdentityClient` so that if optional is not provided it will fail.
