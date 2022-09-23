---
'@backstage/plugin-auth-node': minor
---

Change `BackstageIdentityResponse` to a generic `IdentityApiGetIdentityResult` type, that can be either a user identity and a server identity. This change also includes two condition functions that allows the type to be determined.
