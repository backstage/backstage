---
'@backstage/plugin-catalog-backend': minor
---

Add authorized refresh service

In order to integrate the permissions system with the refresh endpoint in catalog-backend, a new AuthorizedRefreshService was created as a thin wrapper around the existing refresh service which performs authorization and handles the case when authorization is denied.

The existing `refreshService` should be replaced with an instance of `AuthorizedRefreshService`:

```diff
  const refreshService = new DefaultRefreshService({
    database: processingDatabase,
  });
+ const authorizedRefreshService = new AuthorizedRefreshService(
+   refreshService,
+   permissions,
+ );
  const router = await createNextRouter({
    entitiesCatalog,
    locationAnalyzer,
    locationService,
-   refreshService,
+   authorizedRefreshService,
    logger,
    config,
  });
```
