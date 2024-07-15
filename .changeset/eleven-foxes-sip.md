---
'@backstage/plugin-permission-backend': patch
'@backstage/plugin-permission-node': patch
---

The `PermissionPolicy` interface has been updated to align with the recent changes to the Backstage auth system. The second argument to the `handle` method is now of the new `PolicyQueryUser` type. This type maintains the old fields from the `BackstageIdentityResponse`, which are now all deprecated. Instead, two new fields have been added, which allows access to the same information:

- `credentials` - A `BackstageCredentials` object, which is useful for making requests to other services on behalf of the user as part of evaluating the policy. This replaces the deprecated `token` field. See the [Auth Service documentation](https://backstage.io/docs/backend-system/core-services/auth#creating-request-tokens) for information about how to create a token using these credentials.
- `info` - A `BackstageUserInfo` object, which contains the same information as the deprecated `identity`, except for the `type` field that was redundant.

Most existing policies can be updated by replacing the `BackstageIdentityResponse` type with `PolicyQueryUser`, which is exported from `@backstage/plugin-permission-node`, as well as replacing any occurrences of `user?.identity` with `user?.info`.
