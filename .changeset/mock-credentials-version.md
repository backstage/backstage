---
'@backstage/backend-test-utils': patch
---

Fixed `mockCredentials` to include the internal `version: 'v1'` field on all credential objects (`none()`, `user()`, `limitedUser()`, `service()`), and fixed `user()` to encode the user entity ref into the token (matching `user.token(ref)` behavior). This makes mock credentials compatible with `toInternalBackstageCredentials()`, which validates the version field, and ensures that credentials for different users produce different tokens.
