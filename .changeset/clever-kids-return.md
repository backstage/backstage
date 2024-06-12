---
'@backstage/plugin-auth-node': patch
---

Updated scope management for OAuth providers, where the `createOAuthAuthenticator` now accepts a new collection of `scopes` options:

- `scopes.persist` - Whether scopes should be persisted, replaces the `shouldPersistScopes` option.
- `scopes.required` - A list of required scopes that will always be requested.
- `scopes.transform` - A function that can be used to transform the scopes before they are requested.

The `createOAuthProviderFactory` has also received a new `additionalScopes` option, and will also read `additionalScopes` from the auth provider configuration. Both of these can be used to add additional scopes that should always be requested.

A significant change under the hood that this new scope management brings is that providers that persist scopes will now always merge the already granted scopes with the requested ones. The previous behavior was that the full authorization flow would not include existing scopes, while the refresh flow would only include the existing scopes.
