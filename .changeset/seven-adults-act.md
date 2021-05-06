---
'@backstage/plugin-auth-backend': patch
---

Adds custom sign-in resolvers and profile transformation for Google auth provider. Read more about what this means for Backstage user identity and determining ownership of entities https://backstage.io/docs/auth/identity-resolver
Related the [RFC] From Identity to Ownership, v2 https://github.com/backstage/backstage/issues/4089

Adds `ent` field in the claims of Backstage ID Token with a list of entity references containing identity and membership info about the user across multiple systems.

Adds an optional `providerFactories` to the `createRouter` exported by the auth-backend plugin.

Updates `BackstageIdentity` so that

- `idToken` is deprecated in favor of `token`
- An optional `entity` field is added which represents the entity that the user is represented by within Backstage.
