# @backstage/plugin-catalog-backend-module-unprocessed-node

This catalog-backend module adds support for viewing unprocessed entities. An unprocessed entity is one that doesn't show up in the catalog.

A distinction is made between `failed` and `pending` entities.

A `failed` entity has validation error that breaks processing.

A `pending` entity has not been processed yet.

## Installation

### backend

In `packages/backend/src/plugins/catalog.ts` import the module and initialize it after invoking `CatalogBuilder.build()`:

```ts
import { UnprocessedEntitesModule } from '@backstage/plugin-catalog-backend-module-unprocessed';

//...

const unprocessed = new UnprocessedEntitesModule(
  await env.database.getClient(),
  router,
  env.logger,
);
unprocessed.registerRoutes();
```

### backend-next

In `packages/backend-next/src/index.ts` add the module:

```ts
backend.add(catalogModuleUnprocessedEntities());
```

_This plugin was created through the Backstage CLI_
