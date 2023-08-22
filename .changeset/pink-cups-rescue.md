---
'@backstage/plugin-auth-node': minor
---

Introduced a new system for building auth providers for `@backstage/plugin-auth-backend`, which both increases the amount of code re-use across providers, and also works better with the new backend system.

Many existing types have been moved from `@backstage/plugin-auth-backend` in order to avoid a direct dependency on the plugin from modules.

Auth provider integrations are now primarily implemented through a pattern of creating "authenticators", which are in turn specific to each kind of integrations. Initially there are two types: `createOAuthAuthenticator` and `createProxyAuthenticator`. These come paired with functions that let you create the corresponding route handlers, `createOAuthRouteHandlers` and `createProxyAuthRouteHandlers`, as well as provider factories, `createOAuthProviderFactory` and `createProxyAuthProviderFactory`. This new authenticator pattern allows the sign-in logic to be separated from the auth integration logic, allowing it to be completely re-used across all providers of the same kind.

The new provider factories also implement a new declarative way to configure sign-in resolvers, rather than configuration through code. Sign-in resolvers can now be configured through the `resolvers` configuration key, where the first resolver that provides an identity will be used, for example:

```yaml
auth:
  providers:
    google:
      development:
        clientId: ...
        clientSecret: ...
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityAnnotation
            - resolver: emailLocalPartMatchingUserEntityName
```

These configurable resolvers are created with a new `createSignInResolverFactory` function, which creates a sign-in resolver factory, optionally with an options schema that will be used both when configuring the sign-in resolver through configuration and code.

The internal helpers from `@backstage/plugin-auth-backend` that were used to implement auth providers using passport strategies have now also been made available as public API, through `PassportHelpers` and `PassportOAuthAuthenticatorHelper`.
