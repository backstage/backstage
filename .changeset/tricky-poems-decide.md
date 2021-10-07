---
'@backstage/plugin-catalog-backend': patch
---

A number of classes and types, that were part of the old catalog engine implementation, are now formally marked as deprecated. They will be removed entirely from the code base in a future release.

After upgrading to this version, it is recommended that you take a look inside your `packages/backend/src/plugins/catalog.ts` file (using a code editor), to see if you are using any functionality that it marks as deprecated. If you do, please migrate away from it at your earliest convenience.

Migrating to using the new engine implementation is typically a matter of calling `CatalogBuilder.create({ ... })` instead of `new CatalogBuilder({ ... })`.

If you are seeing deprecation warnings for `createRouter`, you can either use the `router` field from the return value from updated catalog builder, or temporarily call `createNextRouter`. The latter will however also be deprecated at a later time.
