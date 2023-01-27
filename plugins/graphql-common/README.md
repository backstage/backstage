# Common GraphQL Plugin

Welcome to the Common GraphQL plugin!

The plugin provides very basic functionality to simplify your routine work with GraphQL.

It includes the following features,

1. **Core schema** - good starting point for extending with your own types.
1. **Schema-based resolvers** - add field resolvers using directives without requiring JavaScript.
1. **Modular schema definition** - allows organizing related schema into [graphql-modules](https://www.graphql-modules.com/docs)
1. [**Connection**](https://relay.dev/docs/guides/graphql-server-specification/#connections) - based on [GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm).
1. **Strives to support** - [GraphQL Server Specification](http://spec.graphql.org)

- [Getting started](#getting-started)
- [Extending Schema](#extending-schema)
  - [Directives API](#directives-api)
    - [`@field`](#field)
    - [`@relation`](#relation)
    - [`@extend`](#extend)
- [Integrations](#integrations)
  - [Codegen/TypeScript](#codegen-typescript)
  - [Backstage GraphiQL Plugin](#backstage-graphiql-plugin)
  - [Backstage API Docs](#backstage-api-docs)

## Getting started

The simplest way to start is use [`@backstage/plugin-graphql-backend`](https://github.com/backstage/backstage/tree/master/plugins/graphql-backend) instead.

Otherwise you'll need to create a router with GraphQL server. The minimal setup might be:

```ts
// packages/backend/src/plugins/graphql.ts
import * as graphql from 'graphql';
import DataLoader from 'dataloader';
import { graphqlHTTP } from 'express-graphql';
import { createGraphQLApp } from '@backstage/plugin-graphql-common';
import { envelop, useEngine } from '@envelop/core';
import { useDataLoader } from '@envelop/dataloader';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { Module } from 'graphql-modules';
import { Router } from 'express';

interface PluginEnvironment {
  loader: () => DataLoader<any, any>;
  modules?: Module[];
}

export default function createRouter(env: PluginEnvironment): Router {
  const application = createGraphQLApp({ modules: env.modules });
  const run = envelop({
    plugins: [
      useEngine(graphql),
      useGraphQLModules(application),
      useDataLoader('loader', env.loader),
    ],
  });
  const { parse, validate, contextFactory, execute } = run();

  const router = Router();

  const server = graphqlHTTP({
    schema: application.schema,
    graphiql: true,
    customParseFn: parse,
    customValidateFn: validate,
    customExecuteFn: async args =>
      execute({
        ...args,
        contextValue: await contextFactory(),
      }),
  });

  router.use(server);

  return router;
}
```

Then add the router to your backend API router:

```ts
// packages/backend/src/index.ts
import graphql from './plugins/graphql';

/* ... */

const graphqlEnv = useHotMemoize(module, () => createEnv('graphql'));

/* ... */

apiRouter.use('/graphql', await graphql(graphqlEnv));
```

See [packages/backend/src/index.ts](https://github.com/backstage/backstage/blob/master/packages/backend/src/index.ts) for an example.

## Extending Schema

This plugin has minimal core schema which isn't useful. So you might be interested in installing [`@backstage/plugin-graphql-catalog`](https://github.com/backstage/backstage/tree/master/plugins/graphql-catalog) plugin that provides a GraphQL module with basic Backstage Catalog types. And if you'd like to add your types/fields this section will tell how to do it by writing custom GraphQL module.

1. Create modules directory where you'll store all your GraphQL modules, for example in `packages/backend/src/modules`
1. Create a module directory `my-module`
1. Create a GraphQL schema file `my-module.graphql` in module's directory

```graphql
extend type Query {
  hello: String!
}
```

1. Create a GraphQL module file `my-module.ts` in module's directory

```ts
import { resolvePackagePath } from '@backstage/backend-common';
import { loadFilesSync } from '@graphql-tools/load-files';
import { createModule } from 'graphql-modules';

export const myModule = createModule({
  id: 'my-module',
  dirname: resolvePackagePath('backend', 'src/modules/my-module'),
  typeDefs: loadFilesSync(
    resolvePackagePath('backend', 'src/modules/my-module/my-module.graphql'),
  ),
  resolvers: {
    Query: {
      hello: () => 'world',
    },
  },
});
```

1. Pass your module to `createRouter` function of GraphQL backend plugin

```ts
// packages/backend/src/plugins/graphql.ts
import { createRouter } from '@backstage/plugin-graphql-backend';
import { Catalog } from '@backstage/plugin-graphql-catalog';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { MyModule } from '../modules/my-module/my-module';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    catalog: env.client,
    modules: [Catalog, MyModule],
  });
}
```

1. Start your backend and you should be able to query your API with `{ hello }` query to get `{ data: { hello: 'world' } }`

### Directives API

#### `@field`

#### `@relation`

#### `@extend`

## Integrations

### Codegen/TypeScript
