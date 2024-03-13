---
'@backstage/plugin-catalog-backend-module-unprocessed': minor
'@backstage/plugin-catalog-unprocessed-entities': minor
'@backstage/plugin-catalog-unprocessed-entities-common': patch
---

**BREAKING**- the `@backstage/plugin-catalog-backend-module-unprocessed` now requires the `permissionsApi`.
If you're using this module in the old backend system you'll need to pass the `permissions` object to the `registerRoutes` method in `packages/backend/src/plugins/catalog.ts`.
No changes should be required if you're using the new backend system.

```diff
- unprocessed.registerRoutes();
+ unprocessed.registerRoutes({ permissions: env.permissions });
```

Adds the ability to delete an unprocessed entity from the `refresh_state` table. This change requires enabling permissions for your Backstage instance.
