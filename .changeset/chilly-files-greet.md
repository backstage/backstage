---
'@backstage/core-components': minor
---

The `SignInPage` has been updated to use the new `onSignInSuccess` callback that was introduced in the same release. While existing code will usually continue to work, it is technically a breaking change because of the dependency on `SignInProps` from the `@backstage/core-plugin-api`. For more information on this change and instructions on how to migrate existing code, see the [`@backstage/core-app-api` CHANGELOG.md](https://github.com/backstage/backstage/blob/master/packages/core-app-api/CHANGELOG.md).

Added a new `UserIdentity` class which helps create implementations of the `IdentityApi`. It provides a couple of static factory methods such as the most relevant `create`, and `createGuest` to create an `IdentityApi` for a guest user.

Also provides a deprecated `fromLegacy` method to create an `IdentityApi` from the now deprecated `SignInResult`. This method will be removed in the future when `SignInResult` is also removed.
