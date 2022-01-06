---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING** Add authorized refresh service

In order to integrate the permissions system with the refresh endpoint in catalog-backend, a new AuthorizedRefreshService was created as a thin wrapper around the existing refresh service which performs authorization and handles the case when authorization is denied. In order to instantiate AuthorizedRefreshService, a permission client is required, which was added as a new field to `CatalogEnvironment`.

The new `permissions` field in `CatalogEnvironment` should already receive the permission client from the `PluginEnvrionment`, so there should be no changes required to the catalog backend setup. See [the create-app changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md) for more details.
