---
'@backstage/plugin-auth-node': minor
---

**BREAKING**: Sign-in resolvers configured via `.signIn.resolvers` now take precedence over sign-in resolvers passed to `signInResolver` option of `createOAuthProviderFactory`. This effectively makes sign-in resolvers passed via the `signInResolver` the default one, which you can then override through configuration.
