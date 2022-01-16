---
'@backstage/plugin-auth-backend': minor
---

The following exports have been **removed** from this package, and moved over to `@backstage/plugin-auth-node`:

- `AuthResponse`
- `BackstageIdentity`
- `BackstageIdentityResponse`
- `BackstageSignInResult`
- `BackstageUserIdentity`
- `IdentityClient`
- `ProfileInfo`
- `TokenIssuer`

If you were using these exports, please update your dependencies to point at `@backstage/plugin-auth-node`.
