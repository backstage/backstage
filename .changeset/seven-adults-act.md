---
'@backstage/plugin-auth-backend': patch
---

Adds support for custom sign-in resolvers and profile transformations for the
Google auth provider.

Adds an `ent` claim in Backstage tokens, with a list of
[entity references](https://backstage.io/docs/features/software-catalog/references)
related to your signed-in user's identities and groups across multiple systems.

Adds an optional `providerFactories` argument to the `createRouter` exported by
the `auth-backend` plugin.

Updates `BackstageIdentity` so that

- `idToken` is deprecated in favor of `token`
- An optional `entity` field is added which represents the entity that the user is represented by within Backstage.

More information:

- [The identity resolver documentation](https://backstage.io/docs/auth/identity-resolver)
  explains the concepts and shows how to implement your own.
- The [From Identity to Ownership](https://github.com/backstage/backstage/issues/4089)
  RFC contains details about how this affects ownership in the catalog
