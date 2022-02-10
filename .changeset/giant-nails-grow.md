---
'@backstage/plugin-auth-backend': minor
---

The following breaking changes were made, which may imply specifically needing
to make small adjustments in your custom auth providers.

- **BREAKING**: Moved `IdentityClient`, `BackstageSignInResult`,
  `BackstageIdentityResponse`, and `BackstageUserIdentity` to
  `@backstage/plugin-auth-node`.
- **BREAKING**: Removed deprecated type `BackstageIdentity`, please use
  `BackstageSignInResult` from `@backstage/plugin-auth-node` instead.

While moving over, `IdentityClient` was also changed in the following ways:

- **BREAKING**: Made `IdentityClient.listPublicKeys` private. It was only used
  in tests, and should not be part of the API surface of that class.
- **BREAKING**: Removed the static `IdentityClient.getBearerToken`. It is now
  replaced by `getBearerTokenFromAuthorizationHeader` from
  `@backstage/plugin-auth-node`.
- **BREAKING**: Removed the constructor. Please use the `IdentityClient.create`
  static method instead.

Since the `IdentityClient` interface is marked as experimental, this is a
breaking change without a deprecation period.

In your auth providers, you may need to update your imports and usages as
follows (example code; yours may be slightly different):

````diff
-import { IdentityClient } from '@backstage/plugin-auth-backend';
+import {
+  IdentityClient,
+  getBearerTokenFromAuthorizationHeader
+} from '@backstage/plugin-auth-node';

   // ...

-  const identity = new IdentityClient({
+  const identity = IdentityClient.create({
     discovery,
     issuer: await discovery.getExternalBaseUrl('auth'),
   });```

   // ...

   const token =
-     IdentityClient.getBearerToken(req.headers.authorization) ||
+     getBearerTokenFromAuthorizationHeader(req.headers.authorization) ||
      req.cookies['token'];
````
