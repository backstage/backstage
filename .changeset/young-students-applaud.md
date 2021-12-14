---
'@backstage/core-plugin-api': patch
---

Renamed `AuthProvider` to `AuthProviderInfo` and add a required 'id' property to match the majority of usage. The `AuthProvider` type without the `id` property still exists but is deprecated, and all usage of it without an `id` is deprecated as well. For example, calling `createAuthRequest` without a `provider.id` is deprecated and it will be required in the future.

The following types have been renamed. The old names are still exported but deprecated, and are scheduled for removal in a future release.

- Renamed `AuthRequesterOptions` to `OAuthRequesterOptions`
- Renamed `AuthRequester` to `OAuthRequester`
- Renamed `PendingAuthRequest` to `PendingOAuthRequest`
