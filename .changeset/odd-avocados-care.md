---
'@backstage/plugin-auth-node': minor
---

**BREAKING**: `IdentityApi#getIdentity` will throw an `AuthenticationError` if `IdentityApi#getIdentity` is called without a valid authorization header.

Adds an optional parameter to the `IdentityApi#getIdentity`. This change also updates the `DefaultIdentityClient` so that if optional is not provided it will fail.
