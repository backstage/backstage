---
'@backstage/plugin-auth-node': patch
---

Added the `identity` property to `BackstageSignInResult`.

The `prepareBackstageIdentityResponse` function will now also forward the `identity` to the response if present in the provided sign-in result.
