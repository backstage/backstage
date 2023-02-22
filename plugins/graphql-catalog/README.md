# Catalog GraphQL Plugin

A [GraphQL Module][graphql-module] providing access to the
[Backstage Software Catalog][catalog]

The plugin provides basic Catalog types, such as `Entity`, `User`,
`Component`, `System`, etc...

You will almost always want to start by adding this plugin to your
[Graphql Backend][graphql-backend]

Some key features are currently missing. These features may change the schema in backward-incompatible ways.

1. `filter` query for filtering `nodes/entities`.
1. `viewer` query for retrieving data for the current user.

- [Catalog module](#catalog-module)
- [Catalog Data loader](#catalog-data-loader-advanced)

## Catalog module

The `Catalog` module is installed just as any other [GraphQL
Module][graphql-modules]: pass it to `modules` options of
[`@backstage/plugin-graphql-backend`](../graphql-backend/README.md)
`createRouter` function.

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

## Catalog Data Loader (Advanced)

In most use cases, you will not need to create a Catalog `dataloader` by
hand. However, when writing [custom data loaders for accessing 3rd
party sources][custom-loader] or [rolling your own GraphQL Server
implementation][roll-your-own] you will need to provide the Catalog
loader yourself. This plugin provides the `createLoader` helper to do
just that.

[graphql-backend]: ../graphql-backend/README.md
[graphql-modules]: https://the-guild.dev/graphql/modules
[custom-loader]: ../graphql-backend/README.md#custom-loader
[roll-your-own]: ../graphql-common/README.md#getting-started
[catalog]: https://backstage.io/docs/features/software-catalog/software-catalog-overview
