---
'@backstage/plugin-auth-backend': minor
---

Made `IdentityClient.listPublicKeys` private. It was only used in tests, and should not be part of the API surface of that class. The interface is marked as experimental, and therefore this is a breaking change without a deprecation period.
