# GraphQL Backend

The `graphql-backend` plugin adds a [GraphQL][] endpoint
(`/api/graphql`) to your Backstage instances, and provides a mechanism
to customize it without having to write any bespoke TypeScript.

It uses [GraphQL Modules][graphql-modules] and [Envelop][] plugins so you can
compose pieces of schema and middleware from many different places
(including other plugins) into a single, complete GraphQL server.

At a minimum, you should install the [graphql-catalog][] which adds basic
schema elements to access the [Backstage Catalog][backstage-catalog] via GraphQL

- [Getting started](#getting-started)
- [Extending Schema](../graphql-common/README.md#extending-schema)
- [Envelop Plugins](#envelop-plugins)
- [Custom loader](#custom-loader)
- [Integrations](#integrations)
  - [Backstage GraphiQL Plugin](#backstage-graphiql-plugin)
  - [Backstage API Docs](#backstage-api-docs)

## Getting Started

To install the GraphQL Backend onto your server:

1. Create `packages/backend/src/plugins/graphql.ts` file with the following
   content

```ts
import { createRouter } from '@backstage/plugin-graphql-backend';
import { CatalogClient } from '@backstage/catalog-client';
import { Router } from 'express';
import { Logger } from 'winston';

interface PluginEnvironment {
  logger: Logger;
  config: Config;
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
  });
}
```

2. Register the router in `packages/backend/src/index.ts`:

```ts
const graphqlEnv = useHotMemoize(module, () => createEnv('graphql'));

const service = createServiceBuilder(module)
  .loadConfig(configReader)
  /** several different routers */
  .addRouter('/graphql', await graphql(graphqlEnv));
```

3. Start the backend

```bash
yarn workspace example-backend start
```

This will launch the full example backend. However, without any modules
installed, you won't be able to do much with it.

## GraphQL Modules

The way to add new types and new resolvers to your GraphQL backend is
with [GraphQL Modules][graphql-modules]. These are portable little
bundles of schema that you can drop into place and have them extend
your GraphQL server. The most important of these that is maintained by
the Backstage team is the [graphql-catalog][] plugin that makes your
Catalog accessible via GraphQL. To add this module to your GraphQL server,
add it to the `modules` array in your backend config:

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

To learn more about adding your own modules, see the [graphql-common][] package.

## Envelop Plugins

Whereas [Graphql Modules][graphql-modules] are used to extend the
schema and resolvers of your GraphQL server, [Envelop][] plugins are
used to extend its GraphQL stack with tracing, error handling, context
extensions, and other middlewares.

Plugins are be added via the `plugins` option. For example, to prevent
potentially sensitive error messages from leaking to your client in
production, add the [`useMaskedErrors`][usemaskederrors] package.

```ts
import { useMaskedErrors } from '@envelop/core';

// packages/backend/src/plugins/graphql.ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    plugins: [useMaskedErrors()],
  });
}
```

## Custom Data Loaders (Advanced)

By default, your graphql context will contain a `Dataloader` for retrieving
records from the Catalog by their GraphQL ID. Most of the time this is all you
will need. However, sometimes you will need to load data not just from the
Backstage catalog, but from a different data source entirely. To do this, you
will need to write a custom data loader.

> ⚠️Caution! If you find yourself wanting to load data directly from a
> source other than the catalog, first consider the idea of instead
> just ingesting that data into the catalog, and then using the
> default data loader. After consideration, If you still want to load
> data directly from a source other than the Backstage catalog, then
> proceed with care.

To implement a custom loader, you will have to provide two things:
`loader` and `refToId`

1. To properly decide which data source should be used you need to
   encode something inside node's id. You can do it whatever you'd
   like. But the GraphQL plugin doesn't know how to encode `Entity`
   reference to id, so you need to define `refToId` function

```ts
import {
  CompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';

export function refToId(ref: CompoundEntityRef | string) {
  return Buffer.from(
    JSON.stringify({
      source: 'Catalog',
      ref: stringifyEntityRef(ref),
    }),
  ).toString('base64');
}
```

2. Next, you need to define custom loader. It's a function that
   returns a [`DataLoader`](https://github.com/graphql/dataloader)
   that allows to batch multiple requests to 3rd party APIs and caches
   responses within a single GraphQL request.

```ts
import { ResolverContext } from '@backstage/plugin-graphql-common';
import DataLoader from 'dataloader';
import { Node } from '../__generated__/graphql';

export function createCustomLoader(context: ResolverContext) {
  async function fetchFoo(...args) {
    /* ... */
  }
  async function fetchBar(...args) {
    /* ... */
  }

  return new DataLoader<string, Node>(
    async (ids: string[]): Promise<Array<Node | Error>> => {
      // Note: We disable cache for internal DataLoaders, because ids are already cached
      const catalogLoader = createLoader(context, { cache: false });
      const fooLoader = new DataLoader(fetchFoo, { cache: false });
      const barLoader = new DataLoader(fetchBar, { cache: false });

      return ids.map(id => {
        const { ref, typename } = JSON.parse(
          Buffer.from(id, 'base64').toString(),
        );

        switch (typename) {
          case 'Entity':
            return catalogLoader.load(ref);
          case 'Foo':
            return fooLoader(ref);
          case 'Bar':
            return barLoader(ref);
          default:
            new GraphQLError(`There is no loader for type ${typename}`);
        }
      });
    },
  );
}
```

3. Finally pass both functions to GraphQL backend router

```ts
// packages/backend/src/plugins/graphql.ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    refToId,
    createLoader: createCustomLoader,
  });
}
```

> ⚠️Heads up! Currently
> [`@relation`](../graphql-common/README.md#relation) directive can't
> resolve relationships for non-Entity objects. As a workaround, you
> can prepare data from 3rd party source by adding `relations` field
> with the same structure as it's in `Entity`

## Integrations

### Backstage GraphiQL Plugin

It's convenient to be able to query the Backstage GraphQL API from inside of Backstage App. You can accomplish this by installing the [Backstage GraphiQL Plugin](https://roadie.io/backstage/plugins/graphiQL/) and adding the GraphQL API endpoint to the GraphiQL Plugin API factory.

1. Once you installed `@backstage/plugin-graphiql` plugin [with these instructions](https://roadie.io/backstage/plugins/graphiQL/)
2. Modify `packages/app/src/apis.ts` to add your GraphQL API as an endpoint

```ts
factory: ({ errorApi, githubAuthApi, discovery }) =>
  GraphQLEndpoints.from([
    {
      id: 'backstage-backend',
      title: 'Backstage GraphQL API',
      // we use the lower level object with a fetcher function
      // as we need to `await` the backend url for the graphql plugin
      fetcher: async (params: any) => {
        const graphqlURL = await discovery.getBaseUrl('graphql');
        return fetch(graphqlURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        }).then(res => res.json());
      },
    },
  ]);
```

Checkout this example [`packages/app/src/apis.ts`](../../packages/app/src/apis.ts).

### Backstage API Docs

You might want to show the schema from your GraphQL API in the API definition section of an API entity in Backstage. You can use the `/api/graphql/schema` endpoint to read the schema provided by your GraphQL API. Here's how:

1. Create the API entity and reference `definition.$text: http://localhost:7007/api/graphql/schema`

   ```yaml
   apiVersion: backstage.io/v1alpha1
   kind: API
   metadata:
     name: backstage-graphql-api
     description: GraphQL API provided by GraphQL Plugin
   spec:
     type: graphql
     owner: engineering@backstage.io
     lifecycle: production
     definition:
       $text: http://localhost:7007/api/graphql/schema
   ```

2. Modify `app-config.yaml` to allow reading urls from `localhost:7007`

```yaml
backend:
  ...
  reading:
    allow:
      - host: localhost:7007
```

[graphql]: https://graphql.org
[envelop]: https://the-guild.dev/graphql/envelop
[graphql-modules]: https://the-guild.dev/graphql/modules
[graphql-catalog]: ../graphql-catalog/README.md
[graphql-common]: ../graphql-common/README.md
[backstage-catalog]: https://backstage.io/docs/features/software-catalog/software-catalog-overview
[usemaskederrors]: https://the-guild.dev/graphql/envelop/plugins/use-masked-errors
