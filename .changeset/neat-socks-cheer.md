---
'@backstage/plugin-auth-node': patch
---

allow declarative sign in resolvers declared in `signInResolverFactories` to take precedence over the statically defined sign in resolvers in `signInResolver` for the `createOAuthProviderFactory`.
