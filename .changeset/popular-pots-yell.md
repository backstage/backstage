---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: Removed all directly exported auth provider factories, option types, and sign-in resolvers. For example: `AwsAlbProviderOptions`, `bitbucketUserIdSignInResolver`, `createGithubProvider`. These are all still accessible via the `providers` export. For example, use `providers.github.create()` rather than `createGithubProvider()`, and `providers.bitbucket.resolvers.userIdMatchingUserEntityAnnotation()` rather than `bitbucketUserIdSignInResolver`.

**BREAKING**: Removed the exported `AuthProviderFactoryOptions` type as well as the deprecated option fields of the `AuthProviderFactory` callback. This includes the `tokenManager`, `tokenIssuer`, `discovery`, and `catalogApi` fields. Existing usage of these should be replaced with the new utilities in the `resolverContext` field. The deprecated `TokenIssuer` type is now also removed, since it is no longer used.

**BREAKING**: Removed `getEntityClaims`, use `getDefaultOwnershipEntityRefs` instead.

**DEPRECATION**: Deprecated `AtlassianAuthProvider` as it was unintentionally exported.
