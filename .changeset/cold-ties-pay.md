---
'@backstage/core-plugin-api': minor
---

The `IdentityApi` has received several updates. The `getUserId`, `getProfile`, and `getIdToken` have all been deprecated.

The replacement for `getUserId` is the new `getBackstageIdentity` method, which provides both the `userEntityRef` as well as the `ownershipEntityRefs` that are used to resolve ownership. Existing usage of the user ID would typically be using a fixed entity kind and namespace, for example `` `user:default/${identityApi.getUserId()}` ``, this kind of usage should now instead use the `userEntityRef` directly.

The replacement for `getProfile` is the new async `getProfileInfo`.

The replacement for `getIdToken` is the new `getCredentials` method, which provides an optional token to the caller like before, but it is now wrapped in an object for forwards compatibility.

The deprecated `idToken` field of the `BackstageIdentity` type has been removed, leaving only the new `token` field, which should be used instead. The `BackstageIdentity` also received a new `identity` field, which is a decoded version of the information within the token. Furthermore the `BackstageIdentity` has been renamed to `BackstageIdentityResponse`, with the old name being deprecated.

We expect most of the breaking changes in this update to have low impact since the `IdentityApi` implementation is provided by the app, but it is likely that some tests need to be updated.

Another breaking change is that the `SignInPage` props have been updated, and the `SignInResult` type is now deprecated. This is unlikely to have any impact on the usage of this package, but it is an important change that you can find more information about in the [`@backstage/core-app-api` CHANGELOG.md](https://github.com/backstage/backstage/blob/master/packages/core-app-api/CHANGELOG.md).
