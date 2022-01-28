---
'@backstage/plugin-auth-backend': minor
---

**BREAKING** Added `tokenManager` as a required property for the auth-backend `createRouter` function. This dependency is used to issue server tokens that are used by the `CatalogIdentityClient` when looking up users and their group membership during authentication.

These changes are **required** to `packages/backend/src/plugins/auth.ts`:

```diff
export default async function createPlugin({
  logger,
  database,
  config,
  discovery,
+ tokenManager,
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    logger,
    config,
    database,
    discovery,
+   tokenManager,
  });
}
```

**BREAKING** The `CatalogIdentityClient` constructor now expects a `TokenManager` instead of a `TokenIssuer`. The `TokenManager` interface is used to generate a server token when [resolving a user's identity and membership through the catalog](https://backstage.io/docs/auth/identity-resolver). Using server tokens for these requests allows the auth-backend to bypass authorization checks when permissions are enabled for Backstage. This change will break apps that rely on the user tokens that were previously used by the client. Refer to the ["Backend-to-backend Authentication" tutorial](https://backstage.io/docs/tutorials/backend-to-backend-auth) for more information on server token usage.
