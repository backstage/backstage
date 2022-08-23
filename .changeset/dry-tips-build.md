---
'@backstage/plugin-auth-node': patch
---

`IdentityClient` is now deprecated. Please migrate to `IdentityApi` and `DefaultIdentityClient` instead. The authenticate function on `DefaultIdentityClient` is also deprecated. Please use `getIdentity` instead.
