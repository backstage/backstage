---
'@backstage/plugin-auth-backend': minor
---

- Made `IdentityClient.listPublicKeys` private. It was only used in tests, and
  should not be part of the API surface of that class.
- Removed the static `IdentityClient.getBearerToken`. It is now replaced by
  `getBearerTokenFromAuthorizationHeader` from `@backstage/plugin-auth-node`.

Since the `IdentityClient` interface is marked as experimental, this is a
breaking change without a deprecation period.
