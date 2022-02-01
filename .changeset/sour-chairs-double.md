---
'@backstage/create-app': patch
---

Added `tokenManager` as a required property for the auth-backend `createRouter` function. This dependency is used to issue server tokens that are used by the `CatalogIdentityClient` when looking up users and their group membership during authentication.

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
