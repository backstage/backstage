# @backstage/plugin-catalog-unprocessed-entities-common

## 0.0.12

### Patch Changes

- df4d646: Moved types, API and client to the common package, allowing both frontend and
  backend plugins to use the `CatalogUnprocessedEntitiesClient`.

  The following types, clients and interfaces have been deprecated and should be
  imported from the `@backstage/plugin-catalog-unprocessed-entities-common` instead:
  `CatalogUnprocessedEntitiesApi`, `CatalogUnprocessedEntitiesApiResponse`, `UnprocessedEntity`,
  `UnprocessedEntityCache`, `UnprocessedEntityError`, `CatalogUnprocessedEntitiesClient`.

  All those types, clients and interfaces are re-exported temporarily in the
  `@backstage/plugin-catalog-unprocessed-entities` package until cleaned up.

## 0.0.12-next.0

### Patch Changes

- df4d646: Moved types, API and client to the common package, allowing both frontend and
  backend plugins to use the `CatalogUnprocessedEntitiesClient`.

  The following types, clients and interfaces have been deprecated and should be
  imported from the `@backstage/plugin-catalog-unprocessed-entities-common` instead:
  `CatalogUnprocessedEntitiesApi`, `CatalogUnprocessedEntitiesApiResponse`, `UnprocessedEntity`,
  `UnprocessedEntityCache`, `UnprocessedEntityError`, `CatalogUnprocessedEntitiesClient`.

  All those types, clients and interfaces are re-exported temporarily in the
  `@backstage/plugin-catalog-unprocessed-entities` package until cleaned up.

## 0.0.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.3

## 0.0.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.3-next.0

## 0.0.10

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.2

## 0.0.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.2-next.0

## 0.0.9

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.1

## 0.0.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.1-next.0

## 0.0.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0

## 0.0.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0-next.0

## 0.0.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.4

## 0.0.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.4-next.0

## 0.0.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.3

## 0.0.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.3-next.0

## 0.0.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.2

## 0.0.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1

## 0.0.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.1

## 0.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.0

## 0.0.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.0

## 0.0.2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.14

## 0.0.2-next.0

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.14-next.0

## 0.0.1

### Patch Changes

- 924c1ac: **BREAKING**- the `@backstage/plugin-catalog-backend-module-unprocessed` constructor is now private, and have been moved to using the static `.create` method instead which now requires a `PermissionService` and `DiscoveryService`.

  If you're using this module in the old backend system you'll need to migrate to using the `.create` method and pass in the new required parameters in `packages/backend/src/plugins/catalog.ts`.

  No changes should be required if you're using the new backend system.

  ```diff
  -  const unprocessed = new UnprocessedEntitiesModule(
  -    await env.database.getClient(),
  -    router,
  -  );
  + const unprocessed = UnprocessedEntitiesModule.create({
  +    database: await env.database.getClient(),
  +    router,
  +    permissions: env.permissions,
  +    discovery: env.discovery,
  +  });

    unprocessed.registerRoutes();
  ```

  Adds the ability to delete an unprocessed entity from the `refresh_state` table. This change requires enabling permissions for your Backstage instance.

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13
