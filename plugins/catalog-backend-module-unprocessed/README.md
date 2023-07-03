# @backstage/plugin-catalog-backend-module-unprocessed

This catalog-backend module adds support for viewing unprocessed entities. An unprocessed entity is one that doesn't show up in the catalog.

A distinction is made between `failed` and `pending` entities.

A `failed` entity has validation error that breaks processing.

A `pending` entity has not been processed yet.

## Installation

```shell
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-unprocessed
```

### backend

In `packages/backend/src/plugins/catalog.ts` import the module and initialize it after invoking `CatalogBuilder.build()`:

```ts title="packages/backend/src/plugins/catalog.ts"
import { UnprocessedEntitesModule } from '@backstage/plugin-catalog-backend-module-unprocessed';

//...

const unprocessed = new UnprocessedEntitesModule(
  await env.database.getClient(),
  router,
);
unprocessed.registerRoutes();
```

### backend-next

In `packages/backend-next/src/index.ts` add the module:

```ts title="packages/backend-next/src/index.ts"
backend.add(catalogModuleUnprocessedEntities());
```

_This plugin was created through the Backstage CLI_
