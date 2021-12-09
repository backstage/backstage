---
'@backstage/plugin-permission-backend': patch
'@backstage/plugin-permission-node': patch
---

Updated to use the new `BackstageIdentityResponse` type from `@backstage/plugin-auth-backend`.

The `BackstageIdentityResponse` type is backwards compatible with the `BackstageIdentity`, and provides an additional `identity` field with the claims of the user.
