# GraphQL Backend

This is the GraphQL Backend plugin.

It's responsible for merging different GraphQL modules together and provide fully-featured GraphQL server.

- [Getting started](#getting-started)
- [Extending Schema](../graphql-common/README.md#extending-schema)
- [Envelop Plugins](#envelop-plugins)
- [Custom loader](#custom-loader)
- [Integrations](#integrations)
  - [Backstage GraphiQL Plugin](#backstage-graphiql-plugin)
  - [Backstage API Docs](#backstage-api-docs)

## Getting Started

To run it within the backend do:

1. Create `packages/backend/src/plugins/graphql.ts` file with the following content

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

This will launch the full example backend.

## Envelop Plugins

GraphQL backend uses [`envelop`](https://the-guild.dev/graphql/envelop) a lightweight JavaScript (TypeScript) library for customizing the GraphQL execution layer. So it's possible to pass any envelop plugins and enhance the capabilities of your GraphQL server.

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

## Custom loader

Another ability of GraphQL backend is requesting data from different sources and not only from `Catalog`. To achieve this you need to implement two things: `loader` and `refToId`

1. To properly decide which data source should be used you need to encode something inside node's id. You can do it whatever you'd like. But the GraphQL plugin doesn't know how to encode `Entity` reference to id, so you need to define `refToId` function

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

2. Then you need to define custom loader. It's a function that returns a [`DataLoader`](https://github.com/graphql/dataloader) that allows to batch multiple requests to 3rd party APIs and caches responses within a single GraphQL request.

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

3. Finally pass both function to GraphQL backend router

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

**NOTE**: Currently [`@relation`](../graphql-common/README.md#relation) directive can't resolve relationships for non-Entity objects. As a workaround, you can prepare data from 3rd party source by adding `relations` field with the same structure as it's in `Entity`

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

You might want to show the schema from your GraphQL API in API definition section of an API entity in Backstage. You can use the `/api/graphql/schema` endpoint to read the schema provided by your GraphQL API. Here is how you can accomplish this.

1. Create API entity and reference `definition.$text: http://localhost:7007/api/graphql/schema`

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
