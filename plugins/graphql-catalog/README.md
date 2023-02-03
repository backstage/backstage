# Catalog GraphQL Plugin

Welcome to the Catalog GraphQL plugin!

The plugin provides basic Catalog types, such as `Entity/User/Component/System/etc`. And also it provides `createLoader` function that creates a `DataLoader` instance for caching Catalog client requests

Some key features are currently missing. These features may change the schema in backward-incompatible ways.

1. `filter` query for filtering `nodes/entities`.
1. `viewer` query for retrieving data for the current user.

- [Getting started](#getting-started)
  - [Catalog module](#catalog-module)
  - [Catalog loader](#catalog-loader)

## Getting started

### Catalog module

Using `Catalog` GraphQL module is pretty simple, you just need to pass it to `modules` options of [`@backstage/plugin-graphql-backend`](../graphql-backend/README.md) `createRouter` function.

```ts
import { Catalog } from '@backstage/plugin-graphql-catalog';

// packages/backend/src/plugins/graphql.ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    modules: [Catalog],
  });
}
```

### Catalog loader

Catalog loader wraps `catalog.getEntitiesByRefs` requests into [`DataLoader`](https://github.com/graphql/dataloader), which takes all caching and batching routine. If you are using [`@backstage/plugin-graphql-backend`](../graphql-backend/README.md) it's already used under the hood. But for some case you might need to use it explicitly, such as:

1. [Define custom loader for requesting data from 3rd party sources](../graphql-backend/README.md#custom-loader)
2. [Write your own GraphQL Server implementation](../graphql-common/README.md#getting-started)
