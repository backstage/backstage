---
'@backstage/plugin-auth-backend': minor
---

Switched the handling of the `BackstageIdentityResponse` so that the returned `identity.userEntityRef` is always a full entity reference. If `userEntityRef` was previously set to `jane`, it will now be `user:default/jane`. The `userEntityRef` in the response is parsed from the `sub` claim in the payload of the Backstage token.
