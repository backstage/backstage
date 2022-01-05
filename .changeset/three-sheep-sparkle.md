---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING** Add authorized refresh service

In order to integrate the permissions system with the refresh endpoint in catalog-backend, a new AuthorizedRefreshService was created as a thin wrapper around the existing refresh service which performs authorization and handles the case when authorization is denied.

In order for authorization to be enabled, the existing `refreshService` should be replaced with an instance of `AuthorizedRefreshService`:

```diff
- const refreshService = new DefaultRefreshService({
-   database: processingDatabase,
- });
+ const refreshService = new AuthorizedRefreshService(
+   new DefaultRefreshService({ database: processingDatabase }),
+   permissions,
+ );
```

`CatalogEnvironment` now has a `permissions` field. This means that the environment parameter passed to `CatalogBuilder.create` in your Backstage backend needs to contain a `permissions` of type `ServerPermissionClient`. See the example backend's [`PluginEnvironment`](https://github.com/backstage/backstage/blob/ffdb98aa2973366d48ff1774a7f892bc0c926e7e/packages/backend/src/types.ts#L29) and how it's initialized [here])(https://github.com/backstage/backstage/blob/ffdb98aa2973366d48ff1774a7f892bc0c926e7e/packages/backend/src/index.ts#L68-L71).
