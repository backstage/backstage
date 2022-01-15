---
'@backstage/plugin-auth-backend': minor
---

Add new authentication provider to support the oauth2-proxy.

**BREAKING** The `AuthHandler` requires now an `AuthResolverContext` parameter. This aligns with the
behavior of the `SignInResolver`.
