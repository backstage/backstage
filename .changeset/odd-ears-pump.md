---
'@backstage/plugin-auth-backend': minor
---

**BREAKING CHANGE** The `idToken` field of `BackstageIdentity` has been removed, with the `token` taking its place. This means you may need to update existing `signIn.resolver` implementations to return an `token` rather than an `idToken`. This also applies to custom auth providers.

The `BackstageIdentity` type has been deprecated and will be removed in the future. Taking its place is the new `BackstageSignInResult` type with the same shape.

This change also introduces the new `BackstageIdentityResponse` that mirrors the type with the same name from `@backstage/core-plugin-api`. The `BackstageIdentityResponse` type is different from the `BackstageSignInResult` in that it also has a `identity` field which is of type `BackstageUserIdentity` and is a decoded version of the information within the token.

When implementing a custom auth provider that is not based on the `OAuthAdapter` you may need to convert `BackstageSignInResult` into a `BackstageIdentityResponse`, this can be done using the new `prepareBackstageIdentityResponse` function.
