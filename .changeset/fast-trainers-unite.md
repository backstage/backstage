---
'@backstage/core-app-api': minor
---

**BREAKING CHANGE**

The app `SignInPage` component has been updated to switch out the `onResult` callback for a new `onSignInSuccess` callback. This is an immediate breaking change without any deprecation period, as it was deemed to be the way of making this change that had the lowest impact.

The new `onSignInSuccess` callback directly accepts an implementation of an `IdentityApi`, rather than a `SignInResult`. The `SignInPage` from `@backstage/core-component` has been updated to fit this new API, and as long as you pass on `props` directly you should not see any breakage.

However, if you implement your own custom `SignInPage`, then this will be a breaking change and you need to migrate over to using the new callback. While doing so you can take advantage of the `UserIdentity.fromLegacy` helper from `@backstage/core-components` to make the migration simpler by still using the `SignInResult` type. This helper is also deprecated though and is only provided for immediate migration. Long-term it will be necessary to build the `IdentityApi` using for example `UserIdentity.create` instead.

The following is an example of how you can migrate existing usage immediately using `UserIdentity.fromLegacy`:

```ts
onResult(signInResult);
// becomes
onSignInSuccess(UserIdentity.fromLegacy(signInResult));
```

The following is an example of how implement the new `onSignInSuccess` callback of the `SignInPage` using `UserIdentity.create`:

```ts
const identityResponse = await authApi.getBackstageIdentity();
// Profile is optional and will be removed, but allows the
// synchronous getProfile method of the IdentityApi to be used.
const profile = await authApi.getProfile();
onSignInSuccess(
  UserIdentity.create({
    identity: identityResponse.identity,
    authApi,
    profile,
  }),
);
```
